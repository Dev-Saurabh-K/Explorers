from fastapi import APIRouter, Depends, HTTPException, Query, status
from typing import List, Optional
from app.models.user import User
from app.core.security import get_current_user
from app.schemas.knowledge_schemas import (
    DeveloperConcentration,
    FeatureKnowledgeGraph,
    RepositoryKnowledgeGraph,
    FeatureKnowledgeRequest,
    BatchFeaturesKnowledgeRequest,
)
from app.services.github_functions import (
    get_repo_commits,
    get_commits_by_shas,
    get_feature_diff_context,
)
from app.services.knowledge_service import KnowledgeConcentrationService

router = APIRouter(prefix="/github/repo", tags=["Knowledge Concentration & Graph Telemetry"])
knowledge_service = KnowledgeConcentrationService()


@router.get(
    "/knowledge-concentration",
    response_model=RepositoryKnowledgeGraph,
    summary="Get repository-wide developer knowledge concentration percentages and graph data"
)
async def get_repository_knowledge_concentration(
    repo: str = Query(..., description="Repository full name, e.g. 'owner/repo'"),
    max_commits: int = Query(default=100, ge=5, le=500, description="Max commits to analyze"),
    current_user: User = Depends(get_current_user)
):
    token = current_user.github_access_token
    if not token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authenticated user does not have a linked GitHub access token"
        )

    try:
        raw_commits = get_repo_commits(token, repo, limit=max_commits)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to fetch commits for repository '{repo}': {str(e)}"
        )

    if not raw_commits:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No commits found for repository '{repo}'"
        )

    # Calculate overall repo knowledge graph
    repo_graph = knowledge_service.calculate_repository_knowledge(
        repo_name=repo,
        all_commits=raw_commits,
        feature_breakdown=[]
    )
    return repo_graph


@router.post(
    "/feature-knowledge",
    response_model=FeatureKnowledgeGraph,
    summary="Calculate knowledge concentration and graph representation for a specific feature"
)
async def get_feature_knowledge(
    req: FeatureKnowledgeRequest,
    current_user: User = Depends(get_current_user)
):
    token = current_user.github_access_token
    if not token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authenticated user does not have a linked GitHub access token"
        )

    if not req.commit_shas:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one commit SHA must be provided for the feature"
        )

    try:
        commits = get_commits_by_shas(token, req.repo, req.commit_shas)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to fetch commits for feature '{req.feature_name}': {str(e)}"
        )

    diff_context = None
    if req.include_diff_stats:
        try:
            diff_context = get_feature_diff_context(token, req.repo, req.commit_shas)
        except Exception:
            diff_context = None

    feature_graph = knowledge_service.calculate_feature_knowledge(
        commits=commits,
        feature_id=req.feature_id,
        feature_name=req.feature_name,
        diff_context=diff_context
    )
    return feature_graph


@router.post(
    "/features-knowledge-batch",
    response_model=RepositoryKnowledgeGraph,
    summary="Batch calculate knowledge concentration across multiple features with cross-feature charts"
)
async def get_batch_features_knowledge(
    req: BatchFeaturesKnowledgeRequest,
    current_user: User = Depends(get_current_user)
):
    token = current_user.github_access_token
    if not token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authenticated user does not have a linked GitHub access token"
        )

    if not req.features:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one feature must be provided"
        )

    # Collect all unique commit SHAs across all features
    all_shas = list({sha for f in req.features for sha in f.commit_shas})
    try:
        commit_records = get_commits_by_shas(token, req.repo, all_shas)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to fetch commits for repository '{req.repo}': {str(e)}"
        )

    commit_lookup = {c["sha"][:7]: c for c in commit_records}
    commit_lookup.update({c["sha"]: c for c in commit_records})

    feature_graphs: List[FeatureKnowledgeGraph] = []
    for f in req.features:
        f_commits = []
        for sha in f.commit_shas:
            s_sha = sha[:7]
            if s_sha in commit_lookup:
                f_commits.append(commit_lookup[s_sha])
            elif sha in commit_lookup:
                f_commits.append(commit_lookup[sha])

        diff_ctx = None
        if req.include_diff_stats:
            try:
                diff_ctx = get_feature_diff_context(token, req.repo, f.commit_shas)
            except Exception:
                diff_ctx = None

        fg = knowledge_service.calculate_feature_knowledge(
            commits=f_commits,
            feature_id=f.feature_id,
            feature_name=f.feature_name,
            diff_context=diff_ctx
        )
        feature_graphs.append(fg)

    repo_graph = knowledge_service.calculate_repository_knowledge(
        repo_name=req.repo,
        all_commits=commit_records,
        feature_breakdown=feature_graphs
    )
    return repo_graph


@router.get(
    "/knowledge-graph",
    response_model=RepositoryKnowledgeGraph,
    summary="Get full repository knowledge graph with stacked bar charts and bus factor telemetry"
)
async def get_repository_knowledge_graph(
    repo: str = Query(..., description="Repository full name, e.g. 'owner/repo'"),
    max_commits: int = Query(default=100, ge=5, le=500, description="Max commits to analyze"),
    current_user: User = Depends(get_current_user)
):
    token = current_user.github_access_token
    if not token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authenticated user does not have a linked GitHub access token"
        )

    try:
        raw_commits = get_repo_commits(token, repo, limit=max_commits)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to fetch commits for repository '{repo}': {str(e)}"
        )

    if not raw_commits:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No commits found for repository '{repo}'"
        )

    # Heuristic domain clustering based on conventional commit scopes or prefixes
    # e.g., feat(auth), fix(db), chore, ui, docs, etc.
    clusters: dict[str, list[dict]] = {}
    for c in raw_commits:
        msg = c.get("message", "").lower()
        if any(k in msg for k in ["auth", "login", "jwt", "token", "oauth", "security", "user"]):
            category = "Authentication & Security"
        elif any(k in msg for k in ["db", "database", "sql", "migration", "table", "schema", "model"]):
            category = "Database & Models"
        elif any(k in msg for k in ["ui", "css", "style", "page", "component", "frontend", "view", "theme"]):
            category = "Frontend UI & Views"
        elif any(k in msg for k in ["api", "route", "endpoint", "controller", "server", "fastapi"]):
            category = "Backend & API Routing"
        elif any(k in msg for k in ["ai", "gemini", "langchain", "prompt", "doc", "cluster"]):
            category = "AI & Intelligence Services"
        elif any(k in msg for k in ["docker", "ci", "deploy", "action", "infra", "config", "env"]):
            category = "DevOps & Infrastructure"
        else:
            category = "Core Features & Utilities"

        clusters.setdefault(category, []).append(c)

    feature_graphs: List[FeatureKnowledgeGraph] = []
    for cat_name, cat_commits in clusters.items():
        feat_id = cat_name.lower().replace(" & ", "-").replace(" ", "-")
        fg = knowledge_service.calculate_feature_knowledge(
            commits=cat_commits,
            feature_id=feat_id,
            feature_name=cat_name
        )
        feature_graphs.append(fg)

    repo_graph = knowledge_service.calculate_repository_knowledge(
        repo_name=repo,
        all_commits=raw_commits,
        feature_breakdown=feature_graphs
    )
    return repo_graph
