import os
import sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient

from app.main import app
from app.models.user import User
from app.database.database import SessionLocal
from app.core.security import get_current_user, create_access_token
from app.models.team_models import DeveloperStatus, FeatureSuccessionAssignment

# Test user
test_user = User(
    id=201,
    github_id="gh_201",
    username="team_admin",
    name="Team Admin",
    email="admin@company.com",
    avatar_url="https://avatars.githubusercontent.com/u/201",
    github_access_token="test_admin_token"
)

# Seed user in DB
db = SessionLocal()
existing = db.query(User).filter(User.id == test_user.id).first()
if not existing:
    db.add(User(
        id=test_user.id,
        github_id=test_user.github_id,
        username=test_user.username,
        name=test_user.name,
        email=test_user.email,
        avatar_url=test_user.avatar_url,
        github_access_token=test_user.github_access_token
    ))
db.commit()
db.close()

token = create_access_token(user_id=201)
headers = {"Authorization": f"Bearer {token}"}

app.dependency_overrides[get_current_user] = lambda: test_user
client = TestClient(app)


def test_get_team_overview_zero_api_calls():
    """Verify team overview returns all developers with 0 GitHub API calls."""
    res = client.get("/team/overview", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["api_calls_made"] == 0
    assert data["cache_status"] == "DATABASE_ACTIVE"
    assert data["total_developers"] >= 4
    assert any(d["developer_name"] == "Rahul" for d in data["developers"])
    assert any(d["developer_name"] == "Priya" for d in data["developers"])


def test_offboard_developer_auto_reassigns_best_candidate():
    """
    Verify offboarding a developer marks them quitted and automatically
    assigns the best suitable and available candidate using past experience scoring.
    """
    clean_db = SessionLocal()
    clean_db.query(FeatureSuccessionAssignment).filter(FeatureSuccessionAssignment.user_id == 201).delete()
    clean_db.query(DeveloperStatus).filter(DeveloperStatus.user_id == 201).delete()
    clean_db.commit()
    clean_db.close()

    payload = {
        "developer_name": "Rahul",
        "repo": "company/core-repo",
        "reason": "Resigned from company to pursue other opportunities"
    }
    res = client.post("/team/developer/offboard", json=payload, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["developer_name"] == "Rahul"
    assert data["status"] == "quitted"
    assert data["api_calls_made"] == 0
    assert data["affected_features_count"] > 0

    reassignments = data["reassignments"]
    assert len(reassignments) > 0

    # Verify each reassignment has a valid successor and scores
    for r in reassignments:
        assert r["previous_owner"] == "Rahul"
        assert r["assigned_successor"] != "Rahul"
        assert r["successor_score"] > 0
        assert len(r["top_candidates"]) > 0
        # Check top candidate score breakdown
        top_cand = r["top_candidates"][0]
        assert top_cand["total_score"] >= 0 and top_cand["total_score"] <= 100
        assert top_cand["direct_experience_score"] >= 0
        assert top_cand["file_overlap_score"] >= 0
        assert top_cand["domain_affinity_score"] >= 0
        assert top_cand["availability_score"] >= 0
        assert top_cand["match_tier"] in ["EXCELLENT MATCH", "STRONG CANDIDATE", "MODERATE FIT", "BACKUP"]
        assert len(top_cand["rationale"]) > 5

    # Check that Priya was chosen for Payment or Auth where she has experience
    payment_feat = next((r for r in reassignments if "Payment" in r["feature_name"]), None)
    if payment_feat:
        assert payment_feat["assigned_successor"] == "Priya"


def test_reinstate_developer():
    """Verify that a departed developer can be reinstated to active roster."""
    payload = {
        "developer_name": "Rahul",
        "repo": "company/core-repo"
    }
    res = client.post("/team/developer/reinstate", json=payload, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["developer_name"] == "Rahul"
    assert data["status"] == "active"

    # Check overview reflects active status
    overview = client.get("/team/overview", headers=headers).json()
    rahul = next(d for d in overview["developers"] if d["developer_name"] == "Rahul")
    assert rahul["status"] == "active"


def test_simulate_succession_preview():
    """Verify preview simulation computes candidate rankings without changing DB status."""
    payload = {
        "developer_name": "Aman",
        "repo": "company/core-repo"
    }
    res = client.post("/team/succession/simulate", json=payload, headers=headers)
    assert res.status_code == 200
    sim_results = res.json()
    assert len(sim_results) > 0
    for s in sim_results:
        assert s["previous_owner"] == "Aman"
        assert s["assigned_successor"] != "Aman"
        assert len(s["top_candidates"]) > 0

    # Verify Aman is still active in DB
    overview = client.get("/team/overview", headers=headers).json()
    aman = next(d for d in overview["developers"] if d["developer_name"] == "Aman")
    assert aman["status"] == "active"


def test_override_succession_assignment():
    """Verify team lead can manually override a feature successor."""
    payload = {
        "feature_id": "feat-payment",
        "repo": "company/core-repo",
        "new_developer": "Aman",
        "notes": "Assigning Aman to cross-train on Payment gateway"
    }
    res = client.post("/team/succession/override", json=payload, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "success"
    assert data["assigned_developer"] == "Aman"


if __name__ == "__main__":
    test_get_team_overview_zero_api_calls()
    test_offboard_developer_auto_reassigns_best_candidate()
    test_reinstate_developer()
    test_simulate_succession_preview()
    test_override_succession_assignment()
    print("ALL TEAM SUCCESSION TESTS PASSED!")
