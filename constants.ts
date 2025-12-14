import { RepoLevel } from "./types";

export const METRIC_CATEGORIES = [
  "Code Quality",
  "Project Structure",
  "Documentation",
  "Tests & Maintainability",
  "Real-World Relevance",
  "Git Practices"
];

export const LEVEL_COLORS: Record<RepoLevel, string> = {
  [RepoLevel.Beginner]: "text-amber-600",
  [RepoLevel.Intermediate]: "text-yellow-500",
  [RepoLevel.Advanced]: "text-emerald-500",
  [RepoLevel.ProductionReady]: "text-blue-500"
};

export const LEVEL_BG_COLORS: Record<RepoLevel, string> = {
  [RepoLevel.Beginner]: "bg-amber-600",
  [RepoLevel.Intermediate]: "bg-yellow-500",
  [RepoLevel.Advanced]: "bg-emerald-500",
  [RepoLevel.ProductionReady]: "bg-blue-500"
};
