// ==========================================
// Authentication & User Types
// ==========================================
export interface UserProfile {
  id: number;
  github_id: string;
  username: string;
  name: string | null;
  email: string | null;
  avatar_url: string | null;
}

export interface AuthLogoutResponse {
  message: string;
}

// ==========================================
// GitHub Raw Data Types
// ==========================================
export interface CommitResponse {
  sha: string;
  message: string;
  author: string;
  date: string; // ISO 8601 string
}

export interface ContributorResponse {
  username: string;
  avatar_url: string | null;
}

export interface CommitByContributorResponse {
  sha: string;
  message: string;
  date: string; // ISO 8601 string
}

// ==========================================
// AI Documentation Types
// ==========================================
export interface FeatureClusterItem {
  feature_id: string;
  feature_name: string;
  summary: string;
  category: string;
  commit_shas: string[];
  commit_count: number;
  primary_files_hint?: string[];
  knowledge_graph?: FeatureKnowledgeGraph | null;
}

export interface CategorizeFeaturesRequest {
  repo: string; // "owner/repo"
  max_commits?: number; // default: 50
  include_knowledge_graph?: boolean; // default: true
}

export interface CategorizeFeaturesResponse {
  repo: string;
  total_commits: number;
  features: FeatureClusterItem[];
}

export interface GenerateDocRequest {
  repo: string; // "owner/repo"
  feature_id: string;
  feature_name: string;
  feature_summary?: string;
  commit_shas: string[];
}

export interface GenerateDocResponse {
  repo: string;
  feature_id: string;
  feature_name: string;
  filename: string; // e.g. "github-oauth-authentication.md"
  markdown_content: string; // Raw Markdown output
}

// ==========================================
// Knowledge Concentration & Graph Types
// ==========================================
export type RiskLevel = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface DeveloperConcentration {
  developer: string;
  avatar_url: string | null;
  commit_count: number;
  commit_percentage: number;
  lines_added: number;
  lines_deleted: number;
  lines_changed: number;
  lines_percentage: number;
  knowledge_percentage: number;
  risk_level: RiskLevel;
  is_dominant: boolean;
  color: string; // Hex color (e.g. "#00ff66")
}

export interface PieChartItem {
  label: string;
  value: number; // percentage
  count: number;
  color: string;
  avatar_url?: string | null;
}

export interface PieChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
    borderColor?: string[];
  }>;
  items: PieChartItem[];
}

export interface BarChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor: string | string[];
  }>;
}

export interface StackedBarDataset {
  label: string;
  data: number[];
  backgroundColor: string;
}

export interface StackedBarChartData {
  features: string[];
  datasets: StackedBarDataset[];
}

export interface RadarChartDataset {
  developer: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
}

export interface RadarChartData {
  categories: string[];
  datasets: RadarChartDataset[];
}

export interface FeatureKnowledgeGraph {
  feature_id: string;
  feature_name: string;
  total_commits: number;
  total_lines_changed: number;
  bus_factor: number;
  risk_level: RiskLevel;
  risk_summary: string;
  dominant_developer: string | null;
  developers: DeveloperConcentration[];
  chart_data: {
    pie_chart: PieChartData;
    bar_chart: BarChartData;
  };
}

export interface RepositoryKnowledgeGraph {
  repository: string;
  total_commits_analyzed: number;
  total_contributors: number;
  repo_bus_factor: number;
  repo_risk_level: RiskLevel;
  repo_summary: string;
  dominant_contributor: string | null;
  high_risk_features_count: number;
  overall_developers: DeveloperConcentration[];
  feature_breakdown: FeatureKnowledgeGraph[];
  chart_data: {
    overall_pie_chart: PieChartData;
    features_stacked_bar: StackedBarChartData;
    radar_chart?: RadarChartData | null;
  };
}
