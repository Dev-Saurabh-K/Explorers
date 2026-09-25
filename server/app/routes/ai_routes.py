from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import User
from app.core.security import get_current_user
from app.schemas.ai_schemas import (
    CategorizeFeaturesRequest,
    CategorizeFeaturesResponse,
    GenerateDocRequest,
    GenerateDocResponse
)
from app.services.github_functions import get_repo_commits, get_feature_diff_context
from app.services.ai_feature_service import LLMFeatureCategorizer
from app.services.ai_doc_service import LLMDocGenerator

router = APIRouter(prefix="/ai", tags=["AI Documentation"])

# Initialize service singletons lazily or on module load
categorizer = LLMFeatureCategorizer()
doc_generator = LLMDocGenerator()


@router.post(
    "/features/categorize",
    response_model=CategorizeFeaturesResponse,
    summary="Analyze repository commits in bulk and cluster them into product features"
)
async def categorize_repo_features(
    req: CategorizeFeaturesRequest,
    current_user: User = Depends(get_current_user)
):
    token = current_user.github_access_token
    if not token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authenticated user does not have a linked GitHub access token"
        )

    try:
        raw_commits = get_repo_commits(token, req.repo)
    except Exception as e:
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
            include_knowledge_graph=include_kg
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI commit clustering failed: {str(e)}"
        )

    return CategorizeFeaturesResponse(
        repo=req.repo,
        total_commits=len(scoped_commits),
        features=features
    )


@router.post(
    "/features/generate-doc",
    response_model=GenerateDocResponse,
    summary="Extract diffs and touched files for feature commits and synthesize <feature_name>.md"
)
async def generate_feature_documentation(
    req: GenerateDocRequest,
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
            diff_context=diff_context
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI documentation generation failed: {str(e)}"
        )

    clean_id = req.feature_id.strip().lower().replace(" ", "-")
    filename = f"{clean_id}.md"

    return GenerateDocResponse(
        repo=req.repo,
        feature_id=req.feature_id,
        feature_name=req.feature_name,
        filename=filename,
        markdown_content=markdown_doc
    )
