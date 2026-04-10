export const categoryIconNames = [
  "shopping-bag",
  "house",
  "car",
  "utensils",
  "briefcase",
  "health",
  "entertainment",
  "education",
  "travel",
  "bills",
] as const;

export type CategoryIconName = (typeof categoryIconNames)[number];

export const DEFAULT_CATEGORY_ICON: CategoryIconName = "shopping-bag";

export const categoryColorNames = [
  "slate",
  "red",
  "orange",
  "amber",
  "yellow",
  "green",
  "emerald",
  "teal",
  "cyan",
  "blue",
  "indigo",
  "violet",
  "rose",
] as const;

export type CategoryColorName = (typeof categoryColorNames)[number];

export const DEFAULT_CATEGORY_COLOR: CategoryColorName = "blue";

const colorClasses: Record<
  CategoryColorName,
  {
    swatch: string;
    badge: string;
  }
> = {
  slate: {
    swatch: "bg-slate-500",
    badge:
      "border-slate-300 bg-slate-500/10 text-slate-700 dark:border-slate-700 dark:text-slate-300",
  },
  red: {
    swatch: "bg-red-500",
    badge:
      "border-red-300 bg-red-500/10 text-red-700 dark:border-red-700 dark:text-red-300",
  },
  orange: {
    swatch: "bg-orange-500",
    badge:
      "border-orange-300 bg-orange-500/10 text-orange-700 dark:border-orange-700 dark:text-orange-300",
  },
  amber: {
    swatch: "bg-amber-500",
    badge:
      "border-amber-300 bg-amber-500/10 text-amber-700 dark:border-amber-700 dark:text-amber-300",
  },
  yellow: {
    swatch: "bg-yellow-500",
    badge:
      "border-yellow-300 bg-yellow-500/10 text-yellow-800 dark:border-yellow-700 dark:text-yellow-300",
  },
  green: {
    swatch: "bg-green-500",
    badge:
      "border-green-300 bg-green-500/10 text-green-700 dark:border-green-700 dark:text-green-300",
  },
  emerald: {
    swatch: "bg-emerald-500",
    badge:
      "border-emerald-300 bg-emerald-500/10 text-emerald-700 dark:border-emerald-700 dark:text-emerald-300",
  },
  teal: {
    swatch: "bg-teal-500",
    badge:
      "border-teal-300 bg-teal-500/10 text-teal-700 dark:border-teal-700 dark:text-teal-300",
  },
  cyan: {
    swatch: "bg-cyan-500",
    badge:
      "border-cyan-300 bg-cyan-500/10 text-cyan-700 dark:border-cyan-700 dark:text-cyan-300",
  },
  blue: {
    swatch: "bg-blue-500",
    badge:
      "border-blue-300 bg-blue-500/10 text-blue-700 dark:border-blue-700 dark:text-blue-300",
  },
  indigo: {
    swatch: "bg-indigo-500",
    badge:
      "border-indigo-300 bg-indigo-500/10 text-indigo-700 dark:border-indigo-700 dark:text-indigo-300",
  },
  violet: {
    swatch: "bg-violet-500",
    badge:
      "border-violet-300 bg-violet-500/10 text-violet-700 dark:border-violet-700 dark:text-violet-300",
  },
  rose: {
    swatch: "bg-rose-500",
    badge:
      "border-rose-300 bg-rose-500/10 text-rose-700 dark:border-rose-700 dark:text-rose-300",
  },
};

export const getCategoryColorClasses = (color: CategoryColorName) => {
  return colorClasses[color] ?? colorClasses[DEFAULT_CATEGORY_COLOR];
};
