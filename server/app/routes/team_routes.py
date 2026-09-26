from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.user import User
from app.core.security import get_current_user
from app.database.database import get_db
from app.models.team_models import FeatureSuccessionAssignment
from app.schemas.team_schemas import (
    TeamOverviewResponse,
    DeveloperStatusResponse,
    OffboardDeveloperRequest,
    OffboardDeveloperResponse,
    ReinstateDeveloperRequest,
    OverrideSuccessionRequest,
    SimulateSuccessionRequest,
    FeatureReassignmentResult,
    CandidateScoreBreakdown,
)
from app.services.succession_service import TeamSuccessionService

router = APIRouter(prefix="/team", tags=["Team Roster & Succession Engine"])


@router.get(
    "/overview",
    response_model=TeamOverviewResponse,
    summary="Get full team roster, developer statuses, risk metrics, and active succession plans (0 GitHub API calls)"
)
async def get_team_overview(
    repo: Optional[str] = Query(default=None, description="Optional repository name filter"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Returns all developers across the organization/repository.
    Aggregates past commit data, touched files, domain affinities, and availability
    strictly from local database cache with 0 GitHub API calls.
    """
    devs_data = TeamSuccessionService.get_team_developers(db, current_user.id, repo)
    
    # Load recent succession assignments
    assign_query = db.query(FeatureSuccessionAssignment).filter(
        FeatureSuccessionAssignment.user_id == current_user.id
    )
    if repo:
        assign_query = assign_query.filter(FeatureSuccessionAssignment.repo_name == repo)
    assignments_rows = assign_query.order_by(FeatureSuccessionAssignment.updated_at.desc()).all()

    recent_assignments = []
    for a in assignments_rows:
        bd = a.score_breakdown or {}
        recent_assignments.append(FeatureReassignmentResult(
            feature_id=a.feature_id,
            feature_name=a.feature_name,
            category=bd.get("category", "General"),
            previous_owner=a.departed_developer,
            assigned_successor=a.assigned_developer,
            successor_score=a.suitability_score,
            status=a.status,
            is_manual_override=a.is_manual_override,
            top_candidates=[],
            rationale=bd.get("rationale") or f"Assigned to @{a.assigned_developer} based on past experience."
        ))

    dev_models = [
        DeveloperStatusResponse(
            developer_name=d["developer_name"],
            role=d["role"],
            avatar_url=d["avatar_url"],
            email=d["email"],
            status=d["status"],
            is_dominant=d["is_dominant"],
            knowledge_percentage=d["knowledge_percentage"],
            risk_level=d["risk_level"],
            commits_count=d["commits_count"],
            owned_features=d["owned_features"],
            top_domains=d["top_domains"],
            availability_score=d["availability_score"],
            quit_at=d["quit_at"]
        )
        for d in devs_data
    ]

    active_count = sum(1 for d in dev_models if d.status != "quitted")
    quitted_count = sum(1 for d in dev_models if d.status == "quitted")

    return TeamOverviewResponse(
        total_developers=len(dev_models),
        active_developers=active_count,
        quitted_developers=quitted_count,
        orphaned_features_count=len(recent_assignments),
        reassigned_features_count=len(recent_assignments),
        api_calls_made=0,
        cache_status="DATABASE_ACTIVE",
        developers=dev_models,
        recent_assignments=recent_assignments
    )


@router.post(
    "/developer/offboard",
    response_model=OffboardDeveloperResponse,
    summary="Offboard or mark a developer as quitted, automatically reassigning their features to the best available candidate"
)
async def offboard_developer(
    req: OffboardDeveloperRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Marks developer as quitted, finds orphaned features, scores all remaining available
    candidates using past experience metrics in the database, and auto-assigns the top successor.
    Uses 0 GitHub API calls.
    """
    res = TeamSuccessionService.offboard_developer(
        db=db,
        user_id=current_user.id,
        developer_name=req.developer_name,
        repo_name=req.repo,
        reason=req.reason
    )
    return res


@router.post(
    "/developer/reinstate",
    summary="Reinstate a previously quitted or offboarded developer back to the active team"
)
async def reinstate_developer(
    req: ReinstateDeveloperRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Restores developer to active status."""
    res = TeamSuccessionService.reinstate_developer(
        db=db,
        user_id=current_user.id,
        developer_name=req.developer_name,
        repo_name=req.repo
    )
    return res


@router.post(
    "/succession/simulate",
    response_model=List[FeatureReassignmentResult],
    summary="Simulate offboarding a developer to preview successor recommendations without changing developer status"
)
async def simulate_succession(
    req: SimulateSuccessionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Preview what happens if developer leaves: calculates candidate scores and
    returns full breakdown without modifying DB status.
    """
    departed_lower = req.developer_name.strip().lower()
    all_devs = TeamSuccessionService.get_team_developers(db, current_user.id, req.repo)
    active_candidates = [d for d in all_devs if d["developer_name"].strip().lower() != departed_lower and d["status"] != "quitted"]
    if not active_candidates:
        active_candidates = [d for d in all_devs if d["developer_name"].strip().lower() != departed_lower]

    all_features = TeamSuccessionService.get_features_for_repo(db, current_user.id, req.repo)

    orphaned_features = []
    for feat in all_features:
        dom = (feat.get("dominant_developer") or "").strip().lower()
        contribs = feat.get("contributors") or feat.get("knowledge_graph", {}).get("developers", [])
        has_contrib = any((c.get("name") or c.get("developer") or "").strip().lower() == departed_lower for c in contribs)
        if dom == departed_lower or has_contrib:
            orphaned_features.append(feat)

    if not orphaned_features:
        orphaned_features = all_features[:2]

    results = []
    for feat in orphaned_features:
        fid = feat.get("id") or feat.get("feature_id") or "feat"
        fname = feat.get("name") or feat.get("feature_name") or "Feature"
        fcat = feat.get("category") or "Core Engine & API"

        candidates_scored = []
        for cand in active_candidates:
            score_obj = TeamSuccessionService.score_candidate_for_feature(cand, feat)
            candidates_scored.append(score_obj)

        candidates_scored.sort(key=lambda c: c.total_score, reverse=True)
        for idx, c in enumerate(candidates_scored):
            c.rank = idx + 1

        best = candidates_scored[0] if candidates_scored else None

        results.append(FeatureReassignmentResult(
            feature_id=fid,
            feature_name=fname,
            category=fcat,
            previous_owner=req.developer_name,
            assigned_successor=best.developer_name if best else "Unassigned",
            successor_avatar=best.avatar_url if best else None,
            successor_score=best.total_score if best else 0.0,
            status="simulated",
            is_manual_override=False,
            top_candidates=candidates_scored[:4],
            rationale=best.rationale if best else "No candidate available"
        ))

    return results


@router.post(
    "/succession/override",
    summary="Manually override the assigned developer for a feature"
)
async def override_succession(
    req: OverrideSuccessionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Allows manual assignment override by team lead."""
    assignment = TeamSuccessionService.override_succession(
        db=db,
        user_id=current_user.id,
        feature_id=req.feature_id,
        repo_name=req.repo,
        new_developer=req.new_developer,
        notes=req.notes
    )
    return {
        "status": "success",
        "feature_id": req.feature_id,
        "assigned_developer": assignment.assigned_developer,
        "message": f"Successfully assigned @{req.new_developer} to feature '{req.feature_id}'"
    }
