from fastapi.testclient import TestClient
from unittest.mock import patch
from app.main import app
from app.models.user import User
from app.core.config import settings
from app.core.security import get_current_user, create_access_token

settings.jwt_secret = "test_jwt_secret_key_for_testing_12345678"

# Mock authenticated user dependency
mock_user = User(
    id=1,
    github_id="12345",
    username="testdev",
    name="Test Developer",
    email="test@example.com",
    avatar_url="https://avatars.githubusercontent.com/u/12345",
    github_access_token="fake_gh_token_123"
)

app.dependency_overrides[get_current_user] = lambda: mock_user
auth_token = create_access_token(user_id=1)
auth_headers = {"Authorization": f"Bearer {auth_token}"}
client = TestClient(app)


def test_get_repository_knowledge_concentration():
    mock_commits = [
        {"sha": "c1", "message": "feat: login", "author": "alice", "avatar_url": "https://avatars/alice"},
        {"sha": "c2", "message": "feat: oauth", "author": "alice", "avatar_url": "https://avatars/alice"},
        {"sha": "c3", "message": "fix: bug", "author": "bob", "avatar_url": "https://avatars/bob"},
    ]

    with patch("app.routes.knowledge_routes.get_repo_commits", return_value=mock_commits):
        response = client.get("/github/repo/knowledge-concentration?repo=testowner/testrepo", headers=auth_headers)
        assert response.status_code == 200, response.text
        data = response.json()

        assert data["repository"] == "testowner/testrepo"
        assert data["total_commits_analyzed"] == 3
        assert data["total_contributors"] == 2
        assert data["dominant_contributor"] == "alice"
        assert data["repo_bus_factor"] == 1
        assert len(data["overall_developers"]) == 2
        assert data["overall_developers"][0]["developer"] == "alice"
        assert data["overall_developers"][0]["commit_count"] == 2

        # Check chart data payloads
        pie = data["chart_data"]["overall_pie_chart"]
        assert "alice" in pie["labels"]
        assert len(pie["items"]) == 2


def test_post_feature_knowledge():
    mock_commits = [
        {"sha": "f1", "message": "feat: auth routes", "author": "alice", "avatar_url": "https://avatars/alice"},
        {"sha": "f2", "message": "feat: jwt generator", "author": "alice", "avatar_url": "https://avatars/alice"},
    ]

    with patch("app.routes.knowledge_routes.get_commits_by_shas", return_value=mock_commits):
        payload = {
            "repo": "testowner/testrepo",
            "feature_id": "auth-flow",
            "feature_name": "Authentication Flow",
            "commit_shas": ["f1", "f2"]
        }
        response = client.post("/github/repo/feature-knowledge", json=payload, headers=auth_headers)
        assert response.status_code == 200, response.text
        data = response.json()

        assert data["feature_id"] == "auth-flow"
        assert data["feature_name"] == "Authentication Flow"
        assert data["total_commits"] == 2
        assert data["bus_factor"] == 1
        assert data["risk_level"] == "CRITICAL"
        assert data["dominant_developer"] == "alice"
        assert len(data["developers"]) == 1
        assert data["developers"][0]["knowledge_percentage"] == 100.0


def test_post_batch_features_knowledge():
    mock_commits = [
        {"sha": "b1", "message": "feat: login", "author": "alice", "avatar_url": None},
        {"sha": "b2", "message": "feat: db table", "author": "bob", "avatar_url": None},
    ]

    with patch("app.routes.knowledge_routes.get_commits_by_shas", return_value=mock_commits):
        payload = {
            "repo": "testowner/testrepo",
            "features": [
                {
                    "feature_id": "auth",
                    "feature_name": "Auth Feature",
                    "category": "Authentication",
                    "commit_shas": ["b1"]
                },
                {
                    "feature_id": "db",
                    "feature_name": "DB Feature",
                    "category": "Database",
                    "commit_shas": ["b2"]
                }
            ]
        }
        response = client.post("/github/repo/features-knowledge-batch", json=payload, headers=auth_headers)
        assert response.status_code == 200, response.text
        data = response.json()

        assert len(data["feature_breakdown"]) == 2
        assert data["chart_data"]["features_stacked_bar"] is not None
        assert data["chart_data"]["features_stacked_bar"]["features"] == ["Auth Feature", "DB Feature"]


def test_get_repository_knowledge_graph():
    mock_commits = [
        {"sha": "k1", "message": "feat(auth): login with oauth", "author": "alice", "avatar_url": None},
        {"sha": "k2", "message": "fix(db): add users table migration", "author": "bob", "avatar_url": None},
        {"sha": "k3", "message": "feat(ui): retro crt scanline theme", "author": "alice", "avatar_url": None},
    ]

    with patch("app.routes.knowledge_routes.get_repo_commits", return_value=mock_commits):
        response = client.get("/github/repo/knowledge-graph?repo=testowner/testrepo", headers=auth_headers)
        assert response.status_code == 200, response.text
        data = response.json()

        assert data["repository"] == "testowner/testrepo"
        assert len(data["feature_breakdown"]) >= 2
        assert data["chart_data"]["overall_pie_chart"] is not None
        assert data["chart_data"]["features_stacked_bar"] is not None

    print("All Knowledge Routes tests passed successfully!")


if __name__ == "__main__":
    test_get_repository_knowledge_concentration()
    test_post_feature_knowledge()
    test_post_batch_features_knowledge()
    test_get_repository_knowledge_graph()
