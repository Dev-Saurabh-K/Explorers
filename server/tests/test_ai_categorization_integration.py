import json
from unittest.mock import MagicMock
from app.services.ai_feature_service import LLMFeatureCategorizer
from app.schemas.ai_schemas import FeatureClusterItem


def test_categorize_commits_enriches_knowledge_graph():
    categorizer = LLMFeatureCategorizer()

    # Mock the LLM chain invoke response
    mock_llm_json = json.dumps([
        {
            "feature_id": "oauth-authentication",
            "feature_name": "OAuth & JWT Authentication",
            "summary": "Handles user login and JWT session tokens.",
            "category": "Authentication",
            "commit_shas": ["sha0001", "sha0002"],
            "commit_count": 2,
            "primary_files_hint": ["app/routes/auth_routes.py"]
        },
        {
            "feature_id": "database-layer",
            "feature_name": "Database Persistence",
            "summary": "SQLAlchemy models and session handling.",
            "category": "Database",
            "commit_shas": ["sha0003"],
            "commit_count": 1,
            "primary_files_hint": ["app/database/database.py"]
        }
    ])

    mock_llm_response = MagicMock()
    mock_llm_response.content = mock_llm_json

    # Mock chain
    mock_chain = MagicMock()
    mock_chain.invoke.return_value = mock_llm_response

    # Mock LLM get_llm
    categorizer.get_llm = MagicMock(return_value=MagicMock())

    # We patch the prompt | llm invocation inside categorize_commits by patching ChatPromptTemplate.__or__
    # or directly testing with mocked chain
    sample_commits = [
        {"sha": "sha0001abcdef", "message": "feat(auth): initial oauth", "author": "alice", "avatar_url": "https://avatars/alice", "date": "2026-09-01T10:00:00Z"},
        {"sha": "sha0002abcdef", "message": "feat(auth): jwt generation", "author": "alice", "avatar_url": "https://avatars/alice", "date": "2026-09-02T10:00:00Z"},
        {"sha": "sha0003abcdef", "message": "feat(db): user table", "author": "bob", "avatar_url": "https://avatars/bob", "date": "2026-09-03T10:00:00Z"},
    ]

    from unittest.mock import patch
    with patch("langchain_core.prompts.ChatPromptTemplate.__or__", return_value=mock_chain):
        features = categorizer.categorize_commits(
            repo_name="org/repo",
            commits=sample_commits,
            include_knowledge_graph=True
        )

    assert len(features) == 2

    # Check OAuth feature
    oauth_feat = features[0]
    assert oauth_feat.feature_id == "oauth-authentication"
    assert oauth_feat.knowledge_graph is not None
    assert oauth_feat.knowledge_graph.bus_factor == 1
    assert oauth_feat.knowledge_graph.risk_level == "CRITICAL"
    assert oauth_feat.knowledge_graph.dominant_developer == "alice"
    assert len(oauth_feat.knowledge_graph.developers) == 1
    assert oauth_feat.knowledge_graph.developers[0].developer == "alice"
    assert oauth_feat.knowledge_graph.developers[0].knowledge_percentage == 100.0

    # Check DB feature
    db_feat = features[1]
    assert db_feat.feature_id == "database-layer"
    assert db_feat.knowledge_graph is not None
    assert db_feat.knowledge_graph.dominant_developer == "bob"
    assert db_feat.knowledge_graph.developers[0].knowledge_percentage == 100.0

    print("AI Feature Categorization Knowledge Enrichment test passed successfully!")


if __name__ == "__main__":
    test_categorize_commits_enriches_knowledge_graph()
