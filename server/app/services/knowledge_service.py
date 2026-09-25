import math
from typing import List, Dict, Any, Optional
from app.schemas.knowledge_schemas import (
    DeveloperConcentration,
    PieChartItem,
    PieChartData,
    BarChartData,
    StackedBarDataset,
    StackedBarChartData,
    RadarChartDataset,
    RadarChartData,
    FeatureChartData,
    RepoChartData,
    FeatureKnowledgeGraph,
    RepositoryKnowledgeGraph,
)

# Retro-cyberpunk palette matching Commitology aesthetic
RETRO_PALETTE = [
    "#00ff66",  # Phosphor green
    "#ffb000",  # Amber CRT
    "#00e5ff",  # Cyan telemetry
    "#ff3366",  # Glitch neon red
    "#a855f7",  # Cyber purple
    "#3b82f6",  # Electric blue
    "#ec4899",  # Neon pink
    "#eab308",  # Radiant yellow
    "#14b8a6",  # Teal terminal
    "#f97316",  # Plasma orange
]


class KnowledgeConcentrationService:
    def __init__(self):
        self._color_map: Dict[str, str] = {}

    def get_color_for_developer(self, developer: str) -> str:
        """Assign a consistent, unique retro color to each developer."""
        dev_key = developer.strip().lower()
        if dev_key not in self._color_map:
            idx = len(self._color_map) % len(RETRO_PALETTE)
            self._color_map[dev_key] = RETRO_PALETTE[idx]
        return self._color_map[dev_key]

    def calculate_feature_knowledge(
        self,
        commits: List[Dict[str, Any]],
        feature_id: str,
        feature_name: str,
        diff_context: Optional[Dict[str, Any]] = None
    ) -> FeatureKnowledgeGraph:
        """
        Calculate knowledge concentration, bus factor, and graphical representation
        for a specific feature cluster based on its mapped commits and optional diff stats.
        """
        total_commits = len(commits)
        if total_commits == 0:
            return FeatureKnowledgeGraph(
                feature_id=feature_id,
                feature_name=feature_name,
                total_commits=0,
                total_lines_changed=0,
                bus_factor=0,
                risk_level="LOW",
                risk_summary="No commits found for this feature.",
                dominant_developer=None,
                developers=[],
                chart_data=FeatureChartData(
                    pie_chart=PieChartData(labels=[], datasets=[], items=[]),
                    bar_chart=BarChartData(labels=[], datasets=[])
                )
            )

        # Aggregate author statistics
        # Map author login/name -> stats
        dev_stats: Dict[str, Dict[str, Any]] = {}
        for c in commits:
            author = (c.get("author") or c.get("author_name") or "Unknown").strip()
            avatar = c.get("avatar_url") or c.get("author_avatar")

            if author not in dev_stats:
                dev_stats[author] = {
                    "developer": author,
                    "avatar_url": avatar,
                    "commit_count": 0,
                    "lines_added": 0,
                    "lines_deleted": 0,
                    "lines_changed": 0,
                }
            dev_stats[author]["commit_count"] += 1
            if avatar and not dev_stats[author]["avatar_url"]:
                dev_stats[author]["avatar_url"] = avatar

        # Incorporate diff/churn statistics if available
        total_lines_changed = 0
        if diff_context and "files" in diff_context:
            for file_info in diff_context.get("files", []):
                additions = file_info.get("additions", 0)
                deletions = file_info.get("deletions", 0)
                total_lines_changed += (additions + deletions)

        # Compute percentages for each developer
        developer_list: List[DeveloperConcentration] = []
        for dev_name, stats in dev_stats.items():
            commit_count = stats["commit_count"]
            commit_pct = round((commit_count / total_commits) * 100.0, 2)

            lines_added = stats["lines_added"]
            lines_deleted = stats["lines_deleted"]
            lines_changed = stats["lines_changed"]

            if total_lines_changed > 0:
                lines_pct = round((lines_changed / total_lines_changed) * 100.0, 2)
                # Weighted composite score: 60% commit frequency + 40% code churn
                knowledge_pct = round(0.6 * commit_pct + 0.4 * lines_pct, 2)
            else:
                lines_pct = 0.0
                knowledge_pct = commit_pct

            developer_list.append(DeveloperConcentration(
                developer=dev_name,
                avatar_url=stats["avatar_url"],
                commit_count=commit_count,
                commit_percentage=commit_pct,
                lines_added=lines_added,
                lines_deleted=lines_deleted,
                lines_changed=lines_changed,
                lines_percentage=lines_pct,
                knowledge_percentage=knowledge_pct,
                risk_level="LOW",  # Will classify below
                is_dominant=False,
                color=self.get_color_for_developer(dev_name)
            ))

        # Sort developers by knowledge_percentage descending
        developer_list.sort(key=lambda d: d.knowledge_percentage, reverse=True)

        # Normalization adjustment so total percentage sums to 100%
        sum_pct = sum(d.knowledge_percentage for d in developer_list)
        if sum_pct > 0 and abs(sum_pct - 100.0) > 0.01:
            for d in developer_list:
                d.knowledge_percentage = round((d.knowledge_percentage / sum_pct) * 100.0, 2)

        # Calculate Bus Factor and Risk Classification
        top_dev = developer_list[0] if developer_list else None
        dominant_developer = None
        bus_factor = 1

        if top_dev:
            # Mark dominant contributor if >= 50%
            if top_dev.knowledge_percentage >= 50.0:
                top_dev.is_dominant = True
                dominant_developer = top_dev.developer

            # Calculate bus factor: how many devs to reach >= 50% cumulative knowledge
            cumulative = 0.0
            bus_count = 0
            for d in developer_list:
                cumulative += d.knowledge_percentage
                bus_count += 1
                if cumulative >= 50.0:
                    break
            bus_factor = max(1, bus_count)

            # Assign risk level based on top developer concentration
            top_pct = top_dev.knowledge_percentage
            if top_pct >= 80.0:
                feature_risk = "CRITICAL"
                top_dev.risk_level = "CRITICAL"
                risk_summary = (
                    f"CRITICAL RISK: @{top_dev.developer} holds {top_pct}% of knowledge for '{feature_name}'. "
                    f"Bus factor is 1. If this developer leaves, severe knowledge loss will occur."
                )
            elif top_pct >= 60.0:
                feature_risk = "HIGH"
                top_dev.risk_level = "HIGH"
                risk_summary = (
                    f"HIGH RISK: @{top_dev.developer} holds {top_pct}% of knowledge for '{feature_name}'. "
                    f"Bus factor is 1. Proactive pairing or code walk-throughs recommended."
                )
            elif top_pct >= 40.0:
                feature_risk = "MEDIUM"
                top_dev.risk_level = "MEDIUM"
                risk_summary = (
                    f"MODERATE RISK: @{top_dev.developer} is the primary author ({top_pct}%), "
                    f"with contributions from {len(developer_list) - 1} other developer(s)."
                )
            else:
                feature_risk = "LOW"
                risk_summary = (
                    f"HEALTHY: Knowledge for '{feature_name}' is well distributed across "
                    f"{len(developer_list)} contributors. Bus factor is {bus_factor}."
                )
        else:
            feature_risk = "LOW"
            risk_summary = "No contributors identified."

        # Assign risk levels to remaining developers
        for d in developer_list:
            if d != top_dev:
                d.risk_level = "LOW"

        # Build Chart Payloads for Frontend Graphical Representation
        pie_labels = [d.developer for d in developer_list]
        pie_values = [d.knowledge_percentage for d in developer_list]
        pie_colors = [d.color for d in developer_list]

        pie_items = [
            PieChartItem(
                label=d.developer,
                value=d.knowledge_percentage,
                count=d.commit_count,
                color=d.color,
                avatar_url=d.avatar_url
            )
            for d in developer_list
        ]

        pie_chart = PieChartData(
            labels=pie_labels,
            datasets=[
                {
                    "data": pie_values,
                    "backgroundColor": pie_colors,
                    "borderColor": "#0c0d12",
                    "borderWidth": 2,
                    "hoverOffset": 4
                }
            ],
            items=pie_items
        )

        bar_chart = BarChartData(
            labels=pie_labels,
            datasets=[
                {
                    "label": "Knowledge Concentration (%)",
                    "data": pie_values,
                    "backgroundColor": pie_colors,
                    "borderColor": pie_colors,
                    "borderWidth": 1
                },
                {
                    "label": "Commit Count",
                    "data": [d.commit_count for d in developer_list],
                    "backgroundColor": "rgba(255, 255, 255, 0.15)",
                    "borderColor": "rgba(255, 255, 255, 0.4)",
                    "borderWidth": 1
                }
            ]
        )

        return FeatureKnowledgeGraph(
            feature_id=feature_id,
            feature_name=feature_name,
            total_commits=total_commits,
            total_lines_changed=total_lines_changed,
            bus_factor=bus_factor,
            risk_level=feature_risk,
            risk_summary=risk_summary,
            dominant_developer=dominant_developer,
            developers=developer_list,
            chart_data=FeatureChartData(
                pie_chart=pie_chart,
                bar_chart=bar_chart
            )
        )

    def calculate_repository_knowledge(
        self,
        repo_name: str,
        all_commits: List[Dict[str, Any]],
        feature_breakdown: List[FeatureKnowledgeGraph]
    ) -> RepositoryKnowledgeGraph:
        """
        Calculate overall repository-level knowledge distribution and generate
        cross-feature stacked bar charts, radar charts, and risk summaries.
        """
        total_commits = len(all_commits)
        if total_commits == 0:
            return RepositoryKnowledgeGraph(
                repository=repo_name,
                total_commits_analyzed=0,
                total_contributors=0,
                repo_bus_factor=0,
                repo_risk_level="LOW",
                repo_summary=f"No commits found for repository '{repo_name}'.",
                dominant_contributor=None,
                high_risk_features_count=0,
                overall_developers=[],
                feature_breakdown=[],
                chart_data=RepoChartData(
                    overall_pie_chart=PieChartData(labels=[], datasets=[], items=[]),
                    features_stacked_bar=StackedBarChartData(features=[], datasets=[])
                )
            )

        # Aggregate overall repository contributors
        dev_map: Dict[str, Dict[str, Any]] = {}
        for c in all_commits:
            author = (c.get("author") or c.get("author_name") or "Unknown").strip()
            avatar = c.get("avatar_url") or c.get("author_avatar")

            if author not in dev_map:
                dev_map[author] = {
                    "developer": author,
                    "avatar_url": avatar,
                    "commit_count": 0,
                    "color": self.get_color_for_developer(author)
                }
            dev_map[author]["commit_count"] += 1
            if avatar and not dev_map[author]["avatar_url"]:
                dev_map[author]["avatar_url"] = avatar

        overall_developers: List[DeveloperConcentration] = []
        for dev_name, info in dev_map.items():
            commits_count = info["commit_count"]
            pct = round((commits_count / total_commits) * 100.0, 2)
            overall_developers.append(DeveloperConcentration(
                developer=dev_name,
                avatar_url=info["avatar_url"],
                commit_count=commits_count,
                commit_percentage=pct,
                lines_added=0,
                lines_deleted=0,
                lines_changed=0,
                lines_percentage=0.0,
                knowledge_percentage=pct,
                risk_level="LOW",
                is_dominant=False,
                color=info["color"]
            ))

        overall_developers.sort(key=lambda d: d.knowledge_percentage, reverse=True)

        # Normalize overall percentages to 100.0
        sum_pct = sum(d.knowledge_percentage for d in overall_developers)
        if sum_pct > 0 and abs(sum_pct - 100.0) > 0.01:
            for d in overall_developers:
                d.knowledge_percentage = round((d.knowledge_percentage / sum_pct) * 100.0, 2)

        # Overall repository bus factor
        top_overall = overall_developers[0] if overall_developers else None
        dominant_contributor = None
        repo_bus_factor = 1

        if top_overall:
            if top_overall.knowledge_percentage >= 50.0:
                top_overall.is_dominant = True
                dominant_contributor = top_overall.developer

            cumulative = 0.0
            bus_count = 0
            for d in overall_developers:
                cumulative += d.knowledge_percentage
                bus_count += 1
                if cumulative >= 50.0:
                    break
            repo_bus_factor = max(1, bus_count)

            top_pct = top_overall.knowledge_percentage
            if top_pct >= 75.0:
                repo_risk = "CRITICAL"
            elif top_pct >= 55.0:
                repo_risk = "HIGH"
            elif top_pct >= 35.0:
                repo_risk = "MEDIUM"
            else:
                repo_risk = "LOW"
        else:
            repo_risk = "LOW"

        # Count high-risk features
        high_risk_features = [
            f for f in feature_breakdown
            if f.risk_level in ("HIGH", "CRITICAL")
        ]
        high_risk_count = len(high_risk_features)

        repo_summary = (
            f"Repository '{repo_name}' has {len(overall_developers)} active contributor(s) across "
            f"{total_commits} analyzed commits. Overall Bus Factor is {repo_bus_factor}. "
            f"{high_risk_count} feature(s) exhibit high single-developer knowledge concentration."
        )

        # 1. Overall Pie Chart
        overall_pie_items = [
            PieChartItem(
                label=d.developer,
                value=d.knowledge_percentage,
                count=d.commit_count,
                color=d.color,
                avatar_url=d.avatar_url
            )
            for d in overall_developers
        ]

        overall_pie = PieChartData(
            labels=[d.developer for d in overall_developers],
            datasets=[
                {
                    "data": [d.knowledge_percentage for d in overall_developers],
                    "backgroundColor": [d.color for d in overall_developers],
                    "borderColor": "#0c0d12",
                    "borderWidth": 2
                }
            ],
            items=overall_pie_items
        )

        # 2. Cross-Feature Stacked Bar Chart
        # X-axis: Features
        # Datasets: Each developer's knowledge % in each feature
        feature_names = [f.feature_name for f in feature_breakdown]
        all_feature_devs = sorted(list({d.developer for f in feature_breakdown for d in f.developers}))

        stacked_datasets: List[StackedBarDataset] = []
        for dev_name in all_feature_devs:
            dev_color = self.get_color_for_developer(dev_name)
            data_points: List[float] = []
            for feat in feature_breakdown:
                dev_entry = next((d for d in feat.developers if d.developer == dev_name), None)
                data_points.append(dev_entry.knowledge_percentage if dev_entry else 0.0)

            stacked_datasets.append(StackedBarDataset(
                label=dev_name,
                data=data_points,
                backgroundColor=dev_color
            ))

        stacked_bar = StackedBarChartData(
            features=feature_names,
            datasets=stacked_datasets
        )

        # 3. Radar Chart (if multiple features)
        radar_chart = None
        if len(feature_names) >= 3:
            radar_datasets: List[RadarChartDataset] = []
            # Include top 5 developers
            for dev in overall_developers[:5]:
                radar_data: List[float] = []
                for feat in feature_breakdown:
                    dev_entry = next((d for d in feat.developers if d.developer == dev.developer), None)
                    radar_data.append(dev_entry.knowledge_percentage if dev_entry else 0.0)

                radar_datasets.append(RadarChartDataset(
                    developer=dev.developer,
                    data=radar_data,
                    borderColor=dev.color,
                    backgroundColor=dev.color + "33"  # Add transparency
                ))

            radar_chart = RadarChartData(
                categories=feature_names,
                datasets=radar_datasets
            )

        return RepositoryKnowledgeGraph(
            repository=repo_name,
            total_commits_analyzed=total_commits,
            total_contributors=len(overall_developers),
            repo_bus_factor=repo_bus_factor,
            repo_risk_level=repo_risk,
            repo_summary=repo_summary,
            dominant_contributor=dominant_contributor,
            high_risk_features_count=high_risk_count,
            overall_developers=overall_developers,
            feature_breakdown=feature_breakdown,
            chart_data=RepoChartData(
                overall_pie_chart=overall_pie,
                features_stacked_bar=stacked_bar,
                radar_chart=radar_chart
            )
        )
