"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  ClipboardList,
  Users,
  MessageSquare,
  Settings,
  ShieldCheck,
  GraduationCap,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import type { Role } from "@/src/lib/mock-data";
import { useTheme } from "./ThemeContext";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: Role[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["prof", "eleve", "parent", "admin"],
  },
  {
    label: "Calendrier",
    href: "/calendar",
    icon: CalendarDays,
    roles: ["prof", "eleve", "parent"],
  },
  {
    label: "Modules",
    href: "/modules",
    icon: BookOpen,
    roles: ["prof", "eleve"],
  },
  {
    label: "QCM",
    href: "/qcm",
    icon: ClipboardList,
    roles: ["prof", "eleve"],
  },
  {
    label: "Mes élèves",
    href: "/students",
    icon: Users,
    roles: ["prof"],
  },
  {
    label: "Mon profil",
    href: "/students/me",
    icon: GraduationCap,
    roles: ["eleve"],
  },
  {
    label: "Profil de mon enfant",
    href: "/students/me",
    icon: GraduationCap,
    roles: ["parent"],
  },
  {
    label: "Messages",
    href: "/messages",
    icon: MessageSquare,
    roles: ["prof", "eleve", "parent"],
  },
  {
    label: "Administration",
    href: "/admin",
    icon: ShieldCheck,
    roles: ["admin"],
  },
];

interface SidebarProps {
  role?: Role;
  userName?: string;
  userInitials?: string;
}

export function Sidebar({ role = "eleve", userName = "Lucas Dupont", userInitials = "LD" }: SidebarProps) {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();

  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  const roleLabel: Record<Role, string> = {
    prof: "Professeur",
    eleve: "Élève",
    parent: "Parent",
    admin: "Administrateur",
  };

  const roleColor: Record<Role, string> = {
    prof: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    eleve: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    parent: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    admin: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  };

  return (
    <aside className={cn(
      "flex flex-col w-64 min-h-screen border-r shadow-sm transition-colors duration-300",
      isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
    )}>
      {/* Logo */}
      <div className={cn(
        "flex items-center gap-3 px-6 py-5 border-b",
        isDark ? "border-slate-800" : "border-slate-100"
      )}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <span className={cn(
          "text-lg font-bold tracking-tight",
          isDark ? "text-white" : "text-slate-900"
        )}>Atena</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? isDark 
                    ? "bg-blue-500/10 text-blue-400" 
                    : "bg-blue-50 text-blue-700"
                  : isDark
                    ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon
                className={cn(
                  "w-4.5 h-4.5 flex-shrink-0", 
                  isActive 
                    ? isDark ? "text-blue-400" : "text-blue-600" 
                    : isDark ? "text-slate-500" : "text-slate-400"
                )}
                size={18}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle */}
      <div className={cn("px-3 border-t", isDark ? "border-slate-800" : "border-slate-100")}>
        <button
          onClick={toggleTheme}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-3 mt-2 rounded-lg text-sm font-medium transition-colors",
            isDark
              ? "text-slate-400 hover:bg-slate-800 hover:text-white"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          {isDark ? "Mode clair" : "Mode sombre"}
        </button>
      </div>

      {/* Profil utilisateur */}
      <div className={cn("px-3 py-4 border-t", isDark ? "border-slate-800" : "border-slate-100")}>
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">{userInitials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-sm font-medium truncate",
              isDark ? "text-white" : "text-slate-900"
            )}>{userName}</p>
            <span
              className={cn(
                "inline-block text-xs px-1.5 py-0.5 rounded font-medium",
                roleColor[role]
              )}
            >
              {roleLabel[role]}
            </span>
          </div>
        </div>
        <button className={cn(
          "mt-1 flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition-colors",
          isDark 
            ? "text-slate-500 hover:text-white hover:bg-slate-800" 
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
        )}>
          <LogOut size={15} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
