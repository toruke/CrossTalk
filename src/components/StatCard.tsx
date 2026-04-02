"use client";

import { cn } from "@/src/lib/utils";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "./ThemeContext";

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: "indigo" | "cyan" | "emerald" | "amber";
  className?: string;
}

const colorMap = {
  indigo: {
    bg: "bg-indigo-50 dark:bg-indigo-900/20",
    icon: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
    trend: "text-indigo-600 dark:text-indigo-400",
  },
  cyan: {
    bg: "bg-cyan-50 dark:bg-cyan-900/20",
    icon: "text-cyan-600 dark:text-cyan-400",
    iconBg: "bg-cyan-100 dark:bg-cyan-900/40",
    trend: "text-cyan-600 dark:text-cyan-400",
  },
  emerald: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    icon: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    trend: "text-emerald-600 dark:text-emerald-400",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    icon: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-900/40",
    trend: "text-amber-600 dark:text-amber-400",
  },
};

export function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  color = "indigo",
  className,
}: StatCardProps) {
  const { isDark } = useTheme();
  const colors = colorMap[color];

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all",
        isDark 
          ? "bg-slate-900 border-slate-800" 
          : "bg-white border-slate-100",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className={cn("text-sm font-medium mb-1", isDark ? "text-slate-400" : "text-slate-500")}>{label}</p>
          <div className="flex items-baseline gap-1">
            <span className={cn("text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>{value}</span>
            {unit && <span className={cn("text-sm font-medium", isDark ? "text-slate-500" : "text-slate-400")}>{unit}</span>}
          </div>
          {trend && (
            <p className={cn("text-xs font-medium mt-1.5", colors.trend)}>
              +{trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colors.iconBg)}>
          <Icon className={cn("w-5 h-5", colors.icon)} />
        </div>
      </div>
    </div>
  );
}
