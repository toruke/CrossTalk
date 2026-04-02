"use client";

import { Sidebar } from "@/src/components/Sidebar";
import { SessionCard } from "@/src/components/SessionCard";
import { mockSessions } from "@/src/lib/mock-data";
import { Plus } from "lucide-react";
import { useTheme } from "@/src/components/ThemeContext";
import { cn } from "@/src/lib/utils";

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
const HEURES = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

export default function CalendarPage() {
  const { isDark } = useTheme();
  const planifiees = mockSessions.filter((s) => s.statut === "planifiee");
  const realisees = mockSessions.filter((s) => s.statut === "realisee");

  return (
    <div className={cn("flex min-h-screen transition-colors duration-300", isDark ? "bg-slate-950" : "bg-slate-50")}>
      <Sidebar role="eleve" userName="Lucas Dupont" userInitials="LD" />

      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>Calendrier</h1>
            <p className={cn("mt-1", isDark ? "text-slate-400" : "text-slate-500")}>Gérez vos séances et rendez-vous</p>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus size={16} />
            Demander une séance
          </button>
        </div>

        {/* Vue semaine simplifiée */}
        <div className={cn("rounded-2xl border shadow-sm p-6 mb-8", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100")}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>Semaine du 30 mars 2026</h2>
            <div className="flex gap-2">
              <button className={cn("px-3 py-1.5 text-sm border rounded-lg", isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50")}>← Préc.</button>
              <button className={cn("px-3 py-1.5 text-sm border rounded-lg", isDark ? "border-slate-700 text-slate-300 hover:bg-slate-800" : "border-slate-200 hover:bg-slate-50")}>Suiv. →</button>
            </div>
          </div>

          {/* Grille simplifiée */}
          <div className={cn("grid grid-cols-8 gap-px rounded-xl overflow-hidden", isDark ? "bg-slate-800" : "bg-slate-100")}>
            {/* Header heures */}
            <div className={isDark ? "bg-slate-900" : "bg-white"} />
            {JOURS.map((jour) => (
              <div key={jour} className={cn("py-2 text-center", isDark ? "bg-slate-800" : "bg-slate-50")}>
                <span className={cn("text-xs font-semibold", isDark ? "text-slate-400" : "text-slate-500")}>{jour}</span>
              </div>
            ))}

            {/* Lignes horaires */}
            {HEURES.map((heure) => (
              <>
                <div key={`h-${heure}`} className={cn("py-3 px-2 text-right", isDark ? "bg-slate-900" : "bg-white")}>
                  <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>{heure}</span>
                </div>
                {JOURS.map((jour) => (
                  <div key={`${jour}-${heure}`} className={cn("min-h-[40px] relative", isDark ? "bg-slate-900" : "bg-white")}>
                    {jour === "Mer" && heure === "16:00" && (
                      <div className={cn("absolute inset-1 rounded-lg p-1", isDark ? "bg-blue-900/30 border border-blue-800" : "bg-indigo-100 border border-indigo-200")}>
                        <p className={cn("text-xs font-medium leading-tight", isDark ? "text-blue-400" : "text-indigo-700")}>Maths</p>
                        <p className={cn("text-xs", isDark ? "text-blue-500" : "text-indigo-500")}>16h–17h30</p>
                      </div>
                    )}
                    {jour === "Sam" && heure === "10:00" && (
                      <div className={cn("absolute inset-1 rounded-lg p-1", isDark ? "bg-cyan-900/30 border border-cyan-800" : "bg-cyan-100 border border-cyan-200")}>
                        <p className={cn("text-xs font-medium leading-tight", isDark ? "text-cyan-400" : "text-cyan-700")}>Français</p>
                        <p className={cn("text-xs", isDark ? "text-cyan-500" : "text-cyan-500")}>10h–11h</p>
                      </div>
                    )}
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>

        {/* Listes */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <section>
            <h2 className={cn("text-base font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>
              À venir ({planifiees.length})
            </h2>
            <div className="space-y-3">
              {planifiees.map((s) => (
                <SessionCard key={s.id} session={s} />
              ))}
            </div>
          </section>

          <section>
            <h2 className={cn("text-base font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>
              Séances passées ({realisees.length})
            </h2>
            <div className="space-y-3">
              {realisees.map((s) => (
                <SessionCard key={s.id} session={s} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
