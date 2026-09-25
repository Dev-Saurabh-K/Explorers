from app.services.knowledge_service import KnowledgeConcentrationService
from app.schemas.knowledge_schemas import (
    FeatureKnowledgeGraph,
    RepositoryKnowledgeGraph,
)


def test_single_author_critical_risk():
    service = KnowledgeConcentrationService()
    commits = [
        {"sha": "1111111", "message": "feat(auth): initial oauth", "author": "alice", "avatar_url": "https://avatars.githubusercontent.com/u/1"},
        {"sha": "2222222", "message": "feat(auth): add jwt support", "author": "alice", "avatar_url": "https://avatars.githubusercontent.com/u/1"},
        {"sha": "3333333", "message": "fix(auth): handle token expiry", "author": "alice", "avatar_url": "https://avatars.githubusercontent.com/u/1"},
    ]

    result = service.calculate_feature_knowledge(
        commits=commits,
        feature_id="oauth-authentication",
        feature_name="OAuth Authentication"
    )

    assert isinstance(result, FeatureKnowledgeGraph)
    assert result.total_commits == 3
    assert result.bus_factor == 1
    assert result.risk_level == "CRITICAL"
    assert result.dominant_developer == "alice"
    assert len(result.developers) == 1

    top_dev = result.developers[0]
    assert top_dev.developer == "alice"
    assert top_dev.commit_count == 3
    assert top_dev.knowledge_percentage == 100.0
    assert top_dev.is_dominant is True
    assert top_dev.risk_level == "CRITICAL"

    # Verify chart structures
    assert len(result.chart_data.pie_chart.labels) == 1
    assert result.chart_data.pie_chart.labels[0] == "alice"
    assert result.chart_data.pie_chart.datasets[0]["data"][0] == 100.0
    assert len(result.chart_data.pie_chart.items) == 1
    assert result.chart_data.pie_chart.items[0].label == "alice"
    assert result.chart_data.pie_chart.items[0].value == 100.0
    assert len(result.chart_data.bar_chart.labels) == 1


def test_multi_author_balanced_low_risk():
    service = KnowledgeConcentrationService()
    commits = [
        {"sha": "a1", "message": "feat(db): user model", "author": "alice"},
        {"sha": "a2", "message": "feat(db): session model", "author": "bob"},
        {"sha": "a3", "message": "feat(db): migration scripts", "author": "carol"},
    ]

    result = service.calculate_feature_knowledge(
        commits=commits,
        feature_id="database-persistence",
        feature_name="Database Persistence"
    )

    assert result.total_commits == 3
    assert result.bus_factor >= 2
    assert result.risk_level == "LOW"
    assert result.dominant_developer is None
    assert len(result.developers) == 3

    # All developers have ~33.3% share
    for dev in result.developers:
        assert dev.is_dominant is False
        assert dev.risk_level == "LOW"
        assert dev.commit_count == 1

    # Verify chart items
    assert len(result.chart_data.pie_chart.items) == 3


def test_cross_feature_repository_knowledge():
    service = KnowledgeConcentrationService()

    feat1_commits = [
        {"sha": "1a", "message": "feat: login", "author": "alice"},
        {"sha": "1b", "message": "feat: logout", "author": "alice"},
        {"sha": "1c", "message": "feat: refresh", "author": "bob"},
    ]
    feat2_commits = [
        {"sha": "2a", "message": "feat: db setup", "author": "carol"},
        {"sha": "2b", "message": "feat: db tables", "author": "carol"},
    ]
    feat3_commits = [
        {"sha": "3a", "message": "feat: ui navbar", "author": "bob"},
        {"sha": "3b", "message": "feat: ui sidebar", "author": "bob"},
        {"sha": "3c", "message": "feat: ui theme", "author": "alice"},
    ]

    fg1 = service.calculate_feature_knowledge(feat1_commits, "auth", "Authentication")
    fg2 = service.calculate_feature_knowledge(feat2_commits, "db", "Database")
    fg3 = service.calculate_feature_knowledge(feat3_commits, "ui", "Frontend UI")

    all_commits = feat1_commits + feat2_commits + feat3_commits
    repo_graph = service.calculate_repository_knowledge(
        repo_name="org/awesome-repo",
        all_commits=all_commits,
        feature_breakdown=[fg1, fg2, fg3]
    )

    assert isinstance(repo_graph, RepositoryKnowledgeGraph)
    assert repo_graph.total_commits_analyzed == 8
    assert repo_graph.total_contributors == 3
    assert len(repo_graph.feature_breakdown) == 3

    # Check stacked bar chart data
    stacked = repo_graph.chart_data.features_stacked_bar
    assert stacked.features == ["Authentication", "Database", "Frontend UI"]
    assert len(stacked.datasets) == 3  # alice, bob, carol
    for ds in stacked.datasets:
        assert len(ds.data) == 3  # one data point per feature

    # Check radar chart
    assert repo_graph.chart_data.radar_chart is not None
    assert len(repo_graph.chart_data.radar_chart.categories) == 3

    print("All Knowledge Concentration tests passed successfully!")


if __name__ == "__main__":
    test_single_author_critical_risk()
    test_multi_author_balanced_low_risk()
    test_cross_feature_repository_knowledge()
