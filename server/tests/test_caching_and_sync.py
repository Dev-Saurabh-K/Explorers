from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from datetime import datetime, timezone

from app.main import app
from app.models.user import User
from app.database.database import SessionLocal, Base, engine
from app.core.config import settings
from app.core.security import get_current_user, create_access_token
from app.services.cache_service import CacheService

# Test users
mock_user_1 = User(
    id=101,
    github_id="gh_101",
    username="testuser1",
    name="Test User One",
    email="user1@example.com",
    avatar_url="https://avatars.githubusercontent.com/u/101",
    github_access_token="fake_token_101"
)

mock_user_2 = User(
    id=102,
    github_id="gh_102",
    username="testuser2",
    name="Test User Two",
    email="user2@example.com",
    avatar_url="https://avatars.githubusercontent.com/u/102",
    github_access_token="fake_token_102"
)

# Seed test users into DB
db = SessionLocal()
for u in [mock_user_1, mock_user_2]:
    existing = db.query(User).filter(User.id == u.id).first()
    if not existing:
        db.add(User(
            id=u.id,
            github_id=u.github_id,
            username=u.username,
            name=u.name,
            email=u.email,
            avatar_url=u.avatar_url,
            github_access_token=u.github_access_token
        ))
db.commit()
db.close()

token_1 = create_access_token(user_id=101)
token_2 = create_access_token(user_id=102)
headers_1 = {"Authorization": f"Bearer {token_1}"}
headers_2 = {"Authorization": f"Bearer {token_2}"}

app.dependency_overrides[get_current_user] = lambda: mock_user_1
client = TestClient(app)


def test_cache_service_user_isolation():
    """Verify that cached data is strictly segregated by user_id."""
    test_db = SessionLocal()
    try:
        # User 1 caches repos
        CacheService.set_repositories(test_db, user_id=101, repo_names=["org/repo1", "org/repo2"])
        # User 2 caches different repos
        CacheService.set_repositories(test_db, user_id=102, repo_names=["user2/personal"])

        user1_repos = CacheService.get_repositories(test_db, user_id=101)
        user2_repos = CacheService.get_repositories(test_db, user_id=102)

        assert user1_repos == ["org/repo1", "org/repo2"]
        assert user2_repos == ["user2/personal"]

        # User 1 caches commits
        sample_commits = [
            {
                "sha": "abc1234",
                "message": "feat: cache layer",
                "author": "dev1",
                "avatar_url": None,
                "date": "2026-09-25T12:00:00+00:00"
            }
        ]
        CacheService.set_commits(test_db, user_id=101, repo_name="org/repo1", commits=sample_commits)

        # User 1 should find commits
        u1_commits = CacheService.get_commits(test_db, user_id=101, repo_name="org/repo1")
        assert u1_commits is not None
        assert len(u1_commits) == 1
        assert u1_commits[0]["sha"] == "abc1234"

        # User 2 should NOT see user 1 commits
        u2_commits = CacheService.get_commits(test_db, user_id=102, repo_name="org/repo1")
        assert u2_commits is None
    finally:
        test_db.close()


def test_github_repos_caching_and_refresh():
    """Verify GET /github/repos returns cached results on second call without invoking external functions."""
    call_counter = {"count": 0}

    def fake_get_latest_repos(token):
        call_counter["count"] += 1
        return [f"owner/repo_{call_counter['count']}"]

    with patch("app.routes.github_routes.get_latest_repos", side_effect=fake_get_latest_repos):
        # 1. First call - should call fake_get_latest_repos and cache
        r1 = client.get("/github/repos?refresh=true", headers=headers_1)
        assert r1.status_code == 200
        assert r1.json() == ["owner/repo_1"]
        assert call_counter["count"] == 1

        # 2. Second call without refresh - should serve directly from cache!
        r2 = client.get("/github/repos", headers=headers_1)
        assert r2.status_code == 200
        assert r2.json() == ["owner/repo_1"]
        # Counter must still be 1 (no extra external API call)
        assert call_counter["count"] == 1

        # 3. Third call with refresh=true - should force refresh and increment counter
        r3 = client.get("/github/repos?refresh=true", headers=headers_1)
        assert r3.status_code == 200
        assert r3.json() == ["owner/repo_2"]
        assert call_counter["count"] == 2


def test_sync_endpoints():
    """Verify POST /sync, POST /sync/repos, POST /sync/repo, and GET /sync/status."""
    test_repo = "synctest/myrepo"
    mock_repos = [test_repo]
    mock_commits = [
        {"sha": "sha_111", "message": "feat: initial commit", "author": "alice", "avatar_url": None, "date": "2026-09-20T10:00:00Z"},
        {"sha": "sha_222", "message": "feat: auth routes", "author": "bob", "avatar_url": None, "date": "2026-09-21T10:00:00Z"},
    ]
    mock_contributors = [
        {"username": "alice", "avatar_url": None},
        {"username": "bob", "avatar_url": None},
    ]

    with patch("app.services.sync_service.get_latest_repos", return_value=mock_repos), \
         patch("app.services.sync_service.get_repo_commits", return_value=mock_commits), \
         patch("app.services.sync_service.get_commit_authors", return_value=mock_contributors):

        # 1. Sync Repos
        r_repos = client.post("/sync/repos", headers=headers_1)
        assert r_repos.status_code == 200
        data_repos = r_repos.json()
        assert data_repos["success"] is True
        assert data_repos["details"]["count"] == 1

        # 2. Sync Repo Details (commits, contributors, knowledge graphs)
        r_repo = client.post(f"/sync/repo?repo={test_repo}", headers=headers_1)
        assert r_repo.status_code == 200
        data_repo = r_repo.json()
        assert data_repo["success"] is True
        assert data_repo["details"]["commits_count"] == 2
        assert data_repo["details"]["contributors_count"] == 2
        assert data_repo["details"]["knowledge_graphs_synced"] is True

        # 3. Check Sync Status
        r_status = client.get(f"/sync/status?repo={test_repo}", headers=headers_1)
        assert r_status.status_code == 200
        status_data = r_status.json()
        assert status_data["user_id"] == 101
        assert status_data["status"]["repositories"]["count"] == 1
        assert status_data["status"]["commits"]["count"] == 2
        assert status_data["status"]["contributors"]["count"] == 2
        assert status_data["status"]["repo_knowledge_graphs"]["count"] >= 1

        # 4. Check unified POST /sync with action="all"
        r_all = client.post(
            "/sync",
            json={"action": "all", "repo": test_repo},
            headers=headers_1
        )
        assert r_all.status_code == 200
        assert r_all.json()["success"] is True


def test_ai_routes_caching():
    """Verify that AI routes cache results and avoid repeat LLM invocations."""
    test_db = SessionLocal()
    try:
        # Pre-seed cached categorization
        CacheService.set_feature_categorization(
            db=test_db,
            user_id=101,
            repo_name="org/ai-repo",
            total_commits=5,
            features_data=[
                {
                    "feature_id": "test-ai-feature",
                    "feature_name": "Test AI Feature",
                    "summary": "Cached AI summary",
                    "category": "AI Pipeline",
                    "commit_shas": ["sha1"],
                    "commit_count": 1,
                    "primary_files_hint": []
                }
            ]
        )

        # Pre-seed cached doc
        CacheService.set_feature_doc(
            db=test_db,
            user_id=101,
            repo_name="org/ai-repo",
            feature_id="test-ai-feature",
            feature_name="Test AI Feature",
            filename="test-ai-feature.md",
            markdown_content="# Pre-cached Documentation"
        )
    finally:
        test_db.close()

    # Call /ai/features/categorize - should hit DB cache and return pre-seeded without calling GitHub or Gemini
    cat_res = client.post(
        "/ai/features/categorize",
        json={"repo": "org/ai-repo", "max_commits": 10},
        headers=headers_1
    )
    assert cat_res.status_code == 200
    cat_data = cat_res.json()
    assert cat_data["repo"] == "org/ai-repo"
    assert cat_data["features"][0]["feature_id"] == "test-ai-feature"
    assert cat_data["features"][0]["summary"] == "Cached AI summary"

    # Call /ai/features/generate-doc - should hit DB cache and return pre-seeded doc
    doc_res = client.post(
        "/ai/features/generate-doc",
        json={
            "repo": "org/ai-repo",
            "feature_id": "test-ai-feature",
            "feature_name": "Test AI Feature",
            "commit_shas": ["sha1"]
        },
        headers=headers_1
    )
    assert doc_res.status_code == 200
    doc_data = doc_res.json()
    assert doc_data["feature_id"] == "test-ai-feature"
    assert doc_data["markdown_content"] == "# Pre-cached Documentation"


if __name__ == "__main__":
    test_cache_service_user_isolation()
    test_github_repos_caching_and_refresh()
    test_sync_endpoints()
    test_ai_routes_caching()
    print("All Caching and Sync tests passed successfully!")
