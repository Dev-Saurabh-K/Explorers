from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.core.security import get_current_user
from app.database.database import get_db
from app.schemas.ai_schemas import (
    CategorizeFeaturesRequest,
    CategorizeFeaturesResponse,
    GenerateDocRequest,
    GenerateDocResponse
)
from app.services.github_functions import get_repo_commits, get_feature_diff_context
from app.services.ai_feature_service import LLMFeatureCategorizer
from app.services.ai_doc_service import LLMDocGenerator
from app.services.cache_service import CacheService

router = APIRouter(prefix="/ai", tags=["AI Documentation & Categorization"])

# Initialize service singletons lazily or on module load
categorizer = LLMFeatureCategorizer()
doc_generator = LLMDocGenerator()


SAMPLE_MOCK_REPOS = {
    "ecommerce-platform",
    "auth-microservice",
    "analytics-pipeline",
    "payment-gateway"
}

SAMPLE_COMMITS = [
    {"sha": "7fd1a60", "message": "feat(payment): integrate stripe checkout gateway", "author": "Rahul", "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150", "date": "2026-09-24T12:00:00Z"},
    {"sha": "4bc912a", "message": "feat(auth): oauth2 authentication session middleware", "author": "Rahul", "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150", "date": "2026-09-23T10:00:00Z"},
    {"sha": "8821dfe", "message": "feat(auth): token verification and rbac roles", "author": "Priya", "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", "date": "2026-09-22T08:00:00Z"},
    {"sha": "2c19a3b", "message": "feat(ui): responsive splitters and dark workstation layout", "author": "Aman", "avatar_url": "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150", "date": "2026-09-21T14:00:00Z"},
    {"sha": "3a92b1f", "message": "feat(core): telemetry and knowledge clustering", "author": "Neha", "avatar_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150", "date": "2026-09-20T16:00:00Z"},
]


@router.post(
    "/features/categorize",
    response_model=CategorizeFeaturesResponse,
    summary="Analyze repository commits in bulk and cluster them into product features (cached)"
)
async def categorize_repo_features(
    req: CategorizeFeaturesRequest,
    refresh: bool = Query(default=False, description="Force re-clustering with Gemini LLM"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not refresh:
        cached = CacheService.get_feature_categorization(db, current_user.id, req.repo)
        if cached:
            return cached

    # Handle demo / sample repositories without GitHub API
    if req.repo in SAMPLE_MOCK_REPOS or "/" not in req.repo:
        raw_commits = SAMPLE_COMMITS
    else:
        token = current_user.github_access_token
        if not token:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Authenticated user does not have a linked GitHub access token"
            )

        try:
            raw_commits = get_repo_commits(token, req.repo)
        except Exception as e:
            if req.repo in SAMPLE_MOCK_REPOS or "/" not in req.repo:
                raw_commits = SAMPLE_COMMITS
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Failed to fetch commits for repository '{req.repo}': {str(e)}"
                )

    if not raw_commits:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No commits found for repository '{req.repo}'"
        )

    scoped_commits = raw_commits[: req.max_commits]

    try:
        include_kg = True if req.include_knowledge_graph is None else req.include_knowledge_graph
        features = categorizer.categorize_commits(
            repo_name=req.repo,
            commits=scoped_commits,
            include_knowledge_graph=include_kg,
            db=db
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI commit clustering failed: {str(e)}"
        )

    features_serialized = [f.model_dump() for f in features]
    CacheService.set_feature_categorization(
        db=db,
        user_id=current_user.id,
        repo_name=req.repo,
        total_commits=len(scoped_commits),
        features_data=features_serialized
    )

    # Cache feature-level knowledge graphs
    for f in features:
        if f.knowledge_graph:
            CacheService.set_feature_knowledge_graph(
                db=db,
                user_id=current_user.id,
                repo_name=req.repo,
                feature_id=f.feature_id,
                data=f.knowledge_graph.model_dump()
            )

    return CategorizeFeaturesResponse(
        repo=req.repo,
        total_commits=len(scoped_commits),
        features=features
    )


@router.post(
    "/features/generate-doc",
    response_model=GenerateDocResponse,
    summary="Extract diffs and touched files for feature commits and synthesize <feature_name>.md (cached)"
)
async def generate_feature_documentation(
    req: GenerateDocRequest,
    refresh: bool = Query(default=False, description="Force re-generation with Gemini LLM"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not refresh:
        cached = CacheService.get_feature_doc(db, current_user.id, req.repo, req.feature_id)
        if cached:
            return cached

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
        diff_context = get_feature_diff_context(token, req.repo, req.commit_shas)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to fetch diff context from GitHub: {str(e)}"
        )

    try:
        markdown_doc = doc_generator.generate_feature_doc(
            feature_name=req.feature_name,
            feature_summary=req.feature_summary or "",
            diff_context=diff_context,
            db=db
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI documentation generation failed: {str(e)}"
        )

    clean_id = req.feature_id.strip().lower().replace(" ", "-")
    filename = f"{clean_id}.md"

    CacheService.set_feature_doc(
        db=db,
        user_id=current_user.id,
        repo_name=req.repo,
        feature_id=req.feature_id,
        feature_name=req.feature_name,
        filename=filename,
        markdown_content=markdown_doc
    )

    return GenerateDocResponse(
        repo=req.repo,
        feature_id=req.feature_id,
        feature_name=req.feature_name,
        filename=filename,
        markdown_content=markdown_doc
    )
