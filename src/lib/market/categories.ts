import type { CategoryId } from "./types";

export interface Category {
  id: CategoryId;
  label: string;
  /** CSS custom property holding the accent colour for this category. */
  dotVar: string;
}

export const CATEGORIES: Category[] = [
  { id: "produce", label: "Produce", dotVar: "var(--cat-produce)" },
  { id: "pantry", label: "Pantry", dotVar: "var(--cat-pantry)" },
  { id: "toiletries", label: "Toiletries", dotVar: "var(--cat-toiletries)" },
  { id: "household", label: "Household", dotVar: "var(--cat-household)" },
  { id: "other", label: "Other", dotVar: "var(--cat-other)" },
];
