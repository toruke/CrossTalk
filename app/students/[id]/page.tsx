"use client";

import { Sidebar } from "@/src/components/Sidebar";
import { FeedbackCard } from "@/src/components/FeedbackCard";
import { QCMCard } from "@/src/components/QCMCard";
import { StatCard } from "@/src/components/StatCard";
import {
  mockFeedbacks,
  mockQCMResults,
  mockStudentStats,
} from "@/src/lib/mock-data";
import { Clock, Target, CalendarCheck, TrendingUp } from "lucide-react";
import { useTheme } from "@/src/components/ThemeContext";
import { cn } from "@/src/lib/utils";

export default function StudentProfilePage() {
  const { isDark } = useTheme();

  return (
    <div className={cn("flex min-h-screen transition-colors duration-300", isDark ? "bg-slate-950" : "bg-slate-50")}>
      <Sidebar role="eleve" userName="Lucas Dupont" userInitials="LD" />

      <main className="flex-1 p-8 overflow-auto">
        {/* Profil header */}
        <div className={cn("rounded-2xl border shadow-sm p-6 mb-8 flex items-center gap-6", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100")}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl font-bold">LD</span>
          </div>
          <div>
            <h1 className={cn("text-xl font-bold", isDark ? "text-white" : "text-slate-900")}>Lucas Dupont</h1>
            <p className={cn("text-sm mt-0.5", isDark ? "text-slate-400" : "text-slate-500")}>5e secondaire · Brabant Wallon</p>
            <div className="flex gap-2 mt-2">
              <span className={cn("text-xs px-2.5 py-0.5 rounded-full font-medium border", isDark ? "bg-blue-900/30 text-blue-400 border-blue-800" : "bg-indigo-50 text-indigo-700 border-indigo-100")}>
                Élève
              </span>
              <span className={cn("text-xs px-2.5 py-0.5 rounded-full font-medium border", isDark ? "bg-slate-800 text-slate-400 border-slate-700" : "bg-slate-50 text-slate-600 border-slate-100")}>
                Depuis septembre 2025
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Heures de cours"
            value={mockStudentStats.heuresTotales}
            unit="h"
            icon={Clock}
            color="indigo"
          />
          <StatCard
            label="Assiduité"
            value={mockStudentStats.assiduite}
            unit="%"
            icon={CalendarCheck}
            color="emerald"
          />
          <StatCard
            label="Score moyen QCM"
            value={mockStudentStats.scoreMoyenQCM}
            unit="%"
            icon={Target}
            color="amber"
          />
          <StatCard
            label="Séances réalisées"
            value={mockStudentStats.sessionsRealisees}
            icon={TrendingUp}
            color="cyan"
          />
        </div>

        {/* Progression */}
        <div className={cn("rounded-2xl border shadow-sm p-6 mb-8", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100")}>
          <h2 className={cn("font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>Progression — Score QCM mensuel</h2>
          <div className="flex items-end gap-4 h-28">
            {mockStudentStats.progression.map((p) => (
              <div key={p.mois} className="flex-1 flex flex-col items-center gap-2">
                <span className={cn("text-xs font-semibold", isDark ? "text-slate-300" : "text-slate-700")}>{p.score}%</span>
                <div
                  className="w-full bg-blue-500 rounded-t-md"
                  style={{ height: `${p.score}%` }}
                />
                <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>{p.mois}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Feedbacks */}
          <section>
            <h2 className={cn("text-base font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>
              Feedbacks de séances
            </h2>
            <div className="space-y-4">
              {mockFeedbacks.map((fb) => (
                <FeedbackCard key={fb.id} feedback={fb} />
              ))}
            </div>
          </section>

          {/* QCM récents */}
          <section>
            <h2 className={cn("text-base font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>
              Résultats QCM récents
            </h2>
            <div className="space-y-3">
              {mockQCMResults.map((qcm) => (
                <QCMCard key={qcm.id} result={qcm} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
