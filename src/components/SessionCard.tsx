"use client";

import { cn } from "@/src/lib/utils";
import { CalendarDays, Clock, MapPin, Video, User } from "lucide-react";
import type { Session } from "@/src/lib/mock-data";
import { useTheme } from "./ThemeContext";

interface SessionCardProps {
  session: Session;
  className?: string;
}

const statutConfig = {
  planifiee: { 
    label: "Planifiée", 
    light: "bg-blue-50 text-blue-700 border-blue-100",
    dark: "bg-blue-900/30 text-blue-400 border-blue-800"
  },
  realisee: { 
    label: "Réalisée", 
    light: "bg-emerald-50 text-emerald-700 border-emerald-100",
    dark: "bg-emerald-900/30 text-emerald-400 border-emerald-800"
  },
  annulee: { 
    label: "Annulée", 
    light: "bg-red-50 text-red-600 border-red-100",
    dark: "bg-red-900/30 text-red-400 border-red-800"
  },
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-BE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function SessionCard({ session, className }: SessionCardProps) {
  const { isDark } = useTheme();
  const statut = statutConfig[session.statut];

  return (
    <div
      className={cn(
        "rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all",
        isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100",
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className={cn("font-semibold text-base", isDark ? "text-white" : "text-slate-900")}>{session.matiere}</h3>
          <p className={cn("text-sm mt-0.5", isDark ? "text-slate-400" : "text-slate-500")}>avec {session.prof}</p>
        </div>
        <span
          className={cn(
            "text-xs font-medium px-2.5 py-1 rounded-full border",
            isDark ? statut.dark : statut.light
          )}
        >
          {statut.label}
        </span>
      </div>

      <div className="space-y-1.5">
        <div className={cn("flex items-center gap-2 text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
          <CalendarDays size={14} className={isDark ? "text-slate-500" : "text-slate-400"} />
          <span className="capitalize">{formatDate(session.date)}</span>
        </div>
        <div className={cn("flex items-center gap-2 text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
          <Clock size={14} className={isDark ? "text-slate-500" : "text-slate-400"} />
          <span>
            {session.heureDebut} – {session.heureFin}
          </span>
        </div>
        <div className={cn("flex items-center gap-2 text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
          {session.type === "presentiel" ? (
            <>
              <MapPin size={14} className={isDark ? "text-slate-500" : "text-slate-400"} />
              <span>Présentiel</span>
            </>
          ) : (
            <>
              <Video size={14} className={isDark ? "text-slate-500" : "text-slate-400"} />
              <span>En ligne</span>
            </>
          )}
        </div>
        <div className={cn("flex items-center gap-2 text-sm", isDark ? "text-slate-300" : "text-slate-600")}>
          <User size={14} className={isDark ? "text-slate-500" : "text-slate-400"} />
          <span>{session.eleve}</span>
        </div>
      </div>
    </div>
  );
}
