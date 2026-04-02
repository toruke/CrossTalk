"use client";

import { Sidebar } from "@/src/components/Sidebar";
import { mockUsers } from "@/src/lib/mock-data";
import { Users, GraduationCap, BookOpen, TrendingUp, MoreVertical, Search } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { useTheme } from "@/src/components/ThemeContext";

const roleLabel: Record<string, string> = {
  prof: "Professeur",
  eleve: "Élève",
  parent: "Parent",
  admin: "Admin",
};

const roleColorLight: Record<string, string> = {
  prof: "bg-violet-50 text-violet-700 border-violet-100",
  eleve: "bg-indigo-50 text-indigo-700 border-indigo-100",
  parent: "bg-cyan-50 text-cyan-700 border-cyan-100",
  admin: "bg-rose-50 text-rose-700 border-rose-100",
};

const roleColorDark: Record<string, string> = {
  prof: "bg-violet-900/30 text-violet-400 border-violet-800",
  eleve: "bg-indigo-900/30 text-indigo-400 border-indigo-800",
  parent: "bg-cyan-900/30 text-cyan-400 border-cyan-800",
  admin: "bg-rose-900/30 text-rose-400 border-rose-800",
};

const adminStats = [
  { label: "Utilisateurs", value: 6, icon: Users, color: "indigo" as const },
  { label: "Élèves actifs", value: 2, icon: GraduationCap, color: "emerald" as const },
  { label: "Cours ce mois", value: 16, icon: BookOpen, color: "amber" as const },
  { label: "Taux assiduité", value: "91%", icon: TrendingUp, color: "cyan" as const },
];

export default function AdminPage() {
  const { isDark } = useTheme();

  return (
    <div className={cn("flex min-h-screen transition-colors duration-300", isDark ? "bg-slate-950" : "bg-slate-50")}>
      <Sidebar role="admin" userName="Admin Atena" userInitials="AA" />

      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className={cn("text-2xl font-bold", isDark ? "text-white" : "text-slate-900")}>Administration</h1>
          <p className={cn("mt-1", isDark ? "text-slate-400" : "text-slate-500")}>Vue d'ensemble de la plateforme Atena</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {adminStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={cn(
                  "rounded-2xl border p-5 shadow-sm",
                  isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className={cn("text-sm font-medium", isDark ? "text-slate-400" : "text-slate-500")}>{stat.label}</p>
                    <p className={cn("text-3xl font-bold mt-1", isDark ? "text-white" : "text-slate-900")}>{stat.value}</p>
                  </div>
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", isDark ? "bg-blue-900/30" : "bg-indigo-50")}>
                    <Icon size={18} className={isDark ? "text-blue-400" : "text-indigo-600"} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Gestion utilisateurs */}
        <div className={cn("rounded-2xl border shadow-sm", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100")}>
          <div className={cn("flex items-center justify-between px-6 py-4 border-b", isDark ? "border-slate-800" : "border-slate-100")}>
            <h2 className={cn("font-semibold", isDark ? "text-white" : "text-slate-900")}>Gestion des utilisateurs</h2>
            <div className="flex gap-3">
              <div className="relative">
                <Search size={15} className={cn("absolute left-3 top-1/2 -translate-y-1/2", isDark ? "text-slate-500" : "text-slate-400")} />
                <input
                  type="text"
                  placeholder="Rechercher…"
                  className={cn(
                    "pl-9 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2",
                    isDark 
                      ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:ring-blue-500" 
                      : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:ring-indigo-300"
                  )}
                />
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                + Ajouter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn("border-b", isDark ? "border-slate-800" : "border-slate-100")}>
                  <th className={cn("text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide", isDark ? "text-slate-500" : "text-slate-500")}>
                    Utilisateur
                  </th>
                  <th className={cn("text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide", isDark ? "text-slate-500" : "text-slate-500")}>
                    Email
                  </th>
                  <th className={cn("text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide", isDark ? "text-slate-500" : "text-slate-500")}>
                    Rôle
                  </th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr key={user.id} className={cn("border-b transition-colors", isDark ? "border-slate-800 hover:bg-slate-800/50" : "border-slate-50 hover:bg-slate-50")}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", isDark ? "bg-blue-900/30" : "bg-indigo-100")}>
                          <span className={cn("text-xs font-semibold", isDark ? "text-blue-400" : "text-indigo-700")}>
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <span className={cn("text-sm font-medium", isDark ? "text-white" : "text-slate-900")}>
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>
                    <td className={cn("px-6 py-4 text-sm", isDark ? "text-slate-400" : "text-slate-600")}>{user.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "text-xs font-medium px-2.5 py-1 rounded-full border",
                          isDark ? roleColorDark[user.role] : roleColorLight[user.role]
                        )}
                      >
                        {roleLabel[user.role]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className={cn("p-1.5 rounded-lg transition-colors", isDark ? "hover:bg-slate-800 text-slate-500 hover:text-slate-300" : "hover:bg-slate-100 text-slate-400 hover:text-slate-600")}>
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
