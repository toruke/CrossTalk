"use client";

import { cn } from "@/src/lib/utils";
import { ClipboardList, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import type { QCMResult } from "@/src/lib/mock-data";
import { useTheme } from "./ThemeContext";

interface QCMCardProps {
  result: QCMResult;
  className?: string;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-BE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function QCMCard({ result, className }: QCMCardProps) {
  const { isDark } = useTheme();
  const pourcentage = Math.round((result.score / result.total) * 100);

  const statutConfig = {
    reussi: {
      label: "Réussi",
      icon: CheckCircle2,
      light: "bg-emerald-50 text-emerald-700 border-emerald-100",
      dark: "bg-emerald-900/30 text-emerald-400 border-emerald-800",
      barClass: "bg-emerald-500",
    },
    echoue: {
      label: "Échoué",
      icon: XCircle,
      light: "bg-red-50 text-red-600 border-red-100",
      dark: "bg-red-900/30 text-red-400 border-red-800",
      barClass: "bg-red-400",
    },
    en_cours: {
      label: "En cours",
      icon: Loader2,
      light: "bg-blue-50 text-blue-600 border-blue-100",
      dark: "bg-blue-900/30 text-blue-400 border-blue-800",
      barClass: "bg-blue-400",
    },
  };

  const config = statutConfig[result.statut];
  const StatusIcon = config.icon;

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all",
        isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
            isDark ? "bg-blue-900/30" : "bg-indigo-50"
          )}>
            <ClipboardList size={17} className={isDark ? "text-blue-400" : "text-indigo-600"} />
          </div>
          <div>
            <h3 className={cn("font-semibold text-sm leading-snug", isDark ? "text-white" : "text-slate-900")}>{result.titre}</h3>
            <p className={cn("text-xs mt-0.5", isDark ? "text-slate-500" : "text-slate-400")}>{result.matiere}</p>
          </div>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border flex-shrink-0",
            isDark ? config.dark : config.light
          )}
        >
          <StatusIcon size={11} />
          {config.label}
        </span>
      </div>

      {/* Score */}
      <div className="mb-3">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>
            {result.score}
            <span className={cn("text-base font-normal", isDark ? "text-slate-500" : "text-slate-400")}>/{result.total}</span>
          </span>
          <span className={cn("text-lg font-semibold", isDark ? "text-slate-300" : "text-slate-700")}>{pourcentage}%</span>
        </div>
        <div className={cn("w-full h-2 rounded-full overflow-hidden", isDark ? "bg-slate-800" : "bg-slate-100")}>
          <div
            className={cn("h-full rounded-full transition-all duration-500", config.barClass)}
            style={{ width: `${pourcentage}%` }}
          />
        </div>
      </div>

      {/* Méta */}
      <div className={cn("flex items-center justify-between text-xs", isDark ? "text-slate-500" : "text-slate-400")}>
        <span>{formatDate(result.date)}</span>
        <span className="flex items-center gap-1">
          <Clock size={11} />
          {result.duree}
        </span>
      </div>
    </div>
  );
}
