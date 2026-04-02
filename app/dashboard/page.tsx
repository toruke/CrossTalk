"use client";

import { Sidebar } from "@/src/components/Sidebar";
import { StatCard } from "@/src/components/StatCard";
import { SessionCard } from "@/src/components/SessionCard";
import { FeedbackCard } from "@/src/components/FeedbackCard";
import {
  mockSessions,
  mockFeedbacks,
  mockStudentStats,
} from "@/src/lib/mock-data";
import { Clock, TrendingUp, Target, CalendarCheck } from "lucide-react";
import { useTheme } from "@/src/components/ThemeContext";

export default function DashboardPage() {
  const { isDark } = useTheme();
  const prochaineSessions = mockSessions.filter((s) => s.statut === "planifiee").slice(0, 2);
  const dernierFeedback = mockFeedbacks[0];

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${isDark ? "bg-slate-950" : "bg-slate-50"}`}>
      <Sidebar role="eleve" userName="Lucas Dupont" userInitials="LD" />

      <main className="flex-1 p-8 overflow-auto">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className={`text-2xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
            Bonjour, Lucas 👋
          </h1>
          <p className={`mt-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
            Voici un résumé de ton parcours — mois de mars 2026
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Heures de cours"
            value={mockStudentStats.heuresTotales}
            unit="h"
            icon={Clock}
            color="indigo"
            trend={{ value: 12, label: "vs mois dernier" }}
          />
          <StatCard
            label="Assiduité"
            value={mockStudentStats.assiduite}
            unit="%"
            icon={CalendarCheck}
            color="emerald"
            trend={{ value: 4, label: "vs mois dernier" }}
          />
          <StatCard
            label="Score moyen QCM"
            value={mockStudentStats.scoreMoyenQCM}
            unit="%"
            icon={Target}
            color="amber"
            trend={{ value: 9, label: "vs mois dernier" }}
          />
          <StatCard
            label="Séances réalisées"
            value={mockStudentStats.sessionsRealisees}
            icon={TrendingUp}
            color="cyan"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Prochaines séances */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-base font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Prochaines séances</h2>
              <a href="/calendar" className="text-sm text-blue-600 hover:underline">
                Voir le calendrier →
              </a>
            </div>
            <div className="space-y-3">
              {prochaineSessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          </section>

          {/* Dernier feedback */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className={`text-base font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>Dernier feedback</h2>
              <a href="/students/me" className="text-sm text-blue-600 hover:underline">
                Voir tout →
              </a>
            </div>
            {dernierFeedback && <FeedbackCard feedback={dernierFeedback} />}
          </section>
        </div>
      </main>
    </div>
  );
}
