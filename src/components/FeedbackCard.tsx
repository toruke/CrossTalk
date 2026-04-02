"use client";

import { cn } from "@/src/lib/utils";
import { Star, CheckCircle2, AlertCircle } from "lucide-react";
import type { Feedback } from "@/src/lib/mock-data";
import { useTheme } from "./ThemeContext";

interface FeedbackCardProps {
  feedback: Feedback;
  className?: string;
}

function StarRating({ note }: { note: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={cn(
            i < note ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200 dark:text-slate-700 dark:fill-slate-700"
          )}
        />
      ))}
    </div>
  );
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function FeedbackCard({ feedback, className }: FeedbackCardProps) {
  const { isDark } = useTheme();

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all",
        isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>{feedback.matiere}</h3>
          <p className={cn("text-sm mt-0.5", isDark ? "text-slate-400" : "text-slate-500")}>
            {feedback.prof} · {formatDate(feedback.date)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StarRating note={feedback.note} />
          <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>{feedback.note}/5</span>
        </div>
      </div>

      {/* Contenu */}
      <p className={cn("text-sm leading-relaxed mb-4", isDark ? "text-slate-300" : "text-slate-700")}>{feedback.contenu}</p>

      {/* Points forts */}
      {feedback.pointsForts.length > 0 && (
        <div className="mb-3">
          <p className={cn("text-xs font-semibold mb-1.5 flex items-center gap-1", isDark ? "text-emerald-400" : "text-emerald-700")}>
            <CheckCircle2 size={13} />
            Points forts
          </p>
          <ul className="space-y-1">
            {feedback.pointsForts.map((point, i) => (
              <li key={i} className={cn("text-sm flex items-center gap-2", isDark ? "text-slate-300" : "text-slate-600")}>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Points à améliorer */}
      {feedback.pointsAmeliorer.length > 0 && (
        <div>
          <p className={cn("text-xs font-semibold mb-1.5 flex items-center gap-1", isDark ? "text-amber-400" : "text-amber-700")}>
            <AlertCircle size={13} />À améliorer
          </p>
          <ul className="space-y-1">
            {feedback.pointsAmeliorer.map((point, i) => (
              <li key={i} className={cn("text-sm flex items-center gap-2", isDark ? "text-slate-300" : "text-slate-600")}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
