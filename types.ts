export interface RepoMetric {
  category: string;
  score: number; // 0-100
  feedback: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  category: 'Structure' | 'Testing' | 'Documentation' | 'Code Quality' | 'CI/CD' | 'Skills';
}

export enum RepoLevel {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
  ProductionReady = "Production-Ready"
}

export interface Skill {
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface ReadmeAudit {
  overview: boolean;
  installation: boolean;
  usage: boolean;
  visuals: boolean; // Screenshots or diagrams
}

export interface AnalysisResult {
  repoName: string;
  totalScore: number;
  level: RepoLevel;
  summary: string;
  metrics: RepoMetric[];
  roadmap: RoadmapItem[];
  // Role & Skills
  targetRole: string;
  roleCompatibilityScore: number;
  detectedSkills: Skill[]; // Enhanced from string[]
  roleAnalysis: string;
  // Deep Dives
  readmeAudit: ReadmeAudit;
  commitAnalysis: string; // Brief feedback on git practices
}

export interface GitHubRepoData {
  owner: string;
  repo: string;
  description: string | null;
  stars: number;
  language: string | null;
  readmeContent: string;
  fileTree: string[];
  recentCommits: { message: string; date: string }[]; // New field
}
