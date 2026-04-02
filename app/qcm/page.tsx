"use client";

import { Sidebar } from "@/src/components/Sidebar";
import { QCMCard } from "@/src/components/QCMCard";
import { mockQCMResults } from "@/src/lib/mock-data";
import { Plus, BarChart2 } from "lucide-react";
import { useTheme } from "@/src/components/ThemeContext";
import { cn } from "@/src/lib/utils";

export default function QCMPage() {
  const { isDark } = useTheme();
  const reussis = mockQCMResults.filter((q) => q.statut === "reussi").length;
  const echoues = mockQCMResults.filter((q) => q.statut === "echoue").length;
  const scoreMoyen = Math.round(
    mockQCMResults.reduce((acc, q) => acc + (q.score / q.total) * 100, 0) /
      mockQCMResults.length
  );

  return (
    <div className={cn("flex min-h-screen transition-colors duration-300", isDark ? "bg-slate-950" : "bg-slate-50")}>
      <Sidebar role="eleve" userName="Lucas Dupont" userInitials="LD" />

      <main className="flex-1 p-8 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>QCM & Évaluations</h1>
            <p className={cn("mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
              Retrouvez vos quiz et résultats d'évaluation
            </p>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus size={16} />
            Nouveau QCM
          </button>
        </div>

        {/* Résumé */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className={cn("rounded-2xl border p-5 shadow-sm text-center", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100")}>
            <p className={cn("text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>{mockQCMResults.length}</p>
            <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>QCM passés</p>
          </div>
          <div className={cn("rounded-2xl border p-5 shadow-sm text-center", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100")}>
            <p className="text-3xl font-bold text-emerald-500">{reussis}</p>
            <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>Réussis</p>
          </div>
          <div className={cn("rounded-2xl border p-5 shadow-sm text-center", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100")}>
            <p className={cn("text-3xl font-bold", isDark ? "text-white" : "text-slate-900")}>{scoreMoyen}%</p>
            <p className={cn("text-sm mt-1", isDark ? "text-slate-400" : "text-slate-500")}>Score moyen</p>
          </div>
        </div>

        {/* Barre de progression globale */}
        <div className={cn("rounded-2xl border p-5 shadow-sm mb-8", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100")}>
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 size={16} className={isDark ? "text-blue-400" : "text-indigo-600"} />
            <h2 className={cn("font-semibold text-sm", isDark ? "text-white" : "text-slate-900")}>Progression par matière</h2>
          </div>
          <div className="space-y-3">
            {["Mathématiques", "Français"].map((matiere) => {
              const items = mockQCMResults.filter((q) => q.matiere === matiere);
              const avg = Math.round(
                items.reduce((acc, q) => acc + (q.score / q.total) * 100, 0) / items.length
              );
              return (
                <div key={matiere}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className={cn("font-medium", isDark ? "text-slate-300" : "text-slate-700")}>{matiere}</span>
                    <span className={isDark ? "text-slate-400" : "text-slate-500"}>{avg}%</span>
                  </div>
                  <div className={cn("h-2 rounded-full overflow-hidden", isDark ? "bg-slate-800" : "bg-slate-100")}>
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${avg}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Liste des QCM */}
        <h2 className={cn("text-base font-semibold mb-4", isDark ? "text-white" : "text-slate-900")}>Historique des QCM</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockQCMResults.map((result) => (
            <QCMCard key={result.id} result={result} />
          ))}
        </div>
      </main>
    </div>
  );
}
