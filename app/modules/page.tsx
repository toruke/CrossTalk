"use client";

import { Sidebar } from "@/src/components/Sidebar";
import { mockModules } from "@/src/lib/mock-data";
import { FileText, Video, PenLine, Download, ExternalLink } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useTheme } from "@/src/components/ThemeContext";

const typeConfig = {
  pdf: {
    icon: FileText,
    label: "PDF",
    light: { color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
    dark: { color: "text-red-400", bg: "bg-red-900/20", border: "border-red-800" },
  },
  video: {
    icon: Video,
    label: "Vidéo",
    light: { color: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" },
    dark: { color: "text-violet-400", bg: "bg-violet-900/20", border: "border-violet-800" },
  },
  exercice: {
    icon: PenLine,
    label: "Exercice",
    light: { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    dark: { color: "text-emerald-400", bg: "bg-emerald-900/20", border: "border-emerald-800" },
  },
};

export default function ModulesPage() {
  const { isDark } = useTheme();
  const matieres = [...new Set(mockModules.map((m) => m.matiere))];

  return (
    <div className={cn("flex min-h-screen transition-colors duration-300", isDark ? "bg-slate-950" : "bg-slate-50")}>
      <Sidebar role="eleve" userName="Lucas Dupont" userInitials="LD" />

      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>Modules de cours</h1>
          <p className={cn("mt-1", isDark ? "text-slate-400" : "text-slate-500")}>
            Accédez à vos supports pédagogiques (PDF, vidéos, exercices)
          </p>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <button className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium">
            Tout
          </button>
          {matieres.map((m) => (
            <button
              key={m}
              className={cn(
                "px-4 py-2 text-sm border rounded-lg transition-colors",
                isDark 
                  ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800" 
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              )}
            >
              {m}
            </button>
          ))}
          <button className={cn(
            "px-4 py-2 text-sm border rounded-lg transition-colors",
            isDark 
              ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800" 
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          )}>
            PDF
          </button>
          <button className={cn(
            "px-4 py-2 text-sm border rounded-lg transition-colors",
            isDark 
              ? "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800" 
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
          )}>
            Vidéos
          </button>
        </div>

        {/* Grille modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockModules.map((module) => {
            const config = typeConfig[module.type];
            const Icon = config.icon;
            const colors = isDark ? config.dark : config.light;
            return (
              <div
                key={module.id}
                className={cn(
                  "rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow group",
                  isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
                )}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", colors.bg)}>
                    <Icon size={18} className={colors.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={cn("font-semibold text-sm leading-snug", isDark ? "text-white" : "text-slate-900")}>
                      {module.titre}
                    </h3>
                    <p className={cn("text-xs mt-0.5", isDark ? "text-slate-500" : "text-slate-400")}>{module.matiere} · {module.niveau}</p>
                  </div>
                </div>

                <p className={cn("text-sm mb-3 leading-relaxed", isDark ? "text-slate-300" : "text-slate-600")}>{module.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full border", colors.bg, colors.color, colors.border)}>
                      {config.label}
                    </span>
                    {module.pages && (
                      <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>{module.pages} pages</span>
                    )}
                    {module.duree && (
                      <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>{module.duree}</span>
                    )}
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className={cn("p-1.5 rounded-lg", isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500")}>
                      <ExternalLink size={14} />
                    </button>
                    <button className={cn("p-1.5 rounded-lg", isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-100 text-slate-500")}>
                      <Download size={14} />
                    </button>
                  </div>
                </div>

                <p className={cn("text-xs mt-3 pt-3 border-t", isDark ? "text-slate-500 border-slate-800" : "text-slate-400 border-slate-50")}>
                  Par {module.prof}
                </p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
