"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Calendar,
  BookOpen,
  MessageCircle,
  TrendingUp,
  ClipboardCheck,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  Users,
  Play,
  Sparkles,
  ChevronRight,
  Check,
  Zap,
} from "lucide-react";

const sf = "font-serif-display";

// ============================================================================
// DATA
// ============================================================================

const features = [
  {
    icon: Calendar,
    title: "Calendrier & réservation",
    desc: "Réservez une séance en quelques clics. Rappels automatiques par mail pour ne rien oublier.",
    gradient: "from-blue-500 to-indigo-600",
    iconBg: "bg-blue-500",
  },
  {
    icon: BookOpen,
    title: "Cours & ressources",
    desc: "PDF, vidéos, exercices interactifs — tout est centralisé et accessible à tout moment, partout.",
    gradient: "from-violet-500 to-purple-600",
    iconBg: "bg-violet-500",
  },
  {
    icon: ClipboardCheck,
    title: "QCM auto-corrigés",
    desc: "Évaluations avec correction instantanée, scores détaillés et analyse des points faibles.",
    gradient: "from-amber-500 to-orange-600",
    iconBg: "bg-amber-500",
  },
  {
    icon: MessageCircle,
    title: "Messagerie intégrée",
    desc: "Prof ↔ élève, prof ↔ parent. Échangez facilement, tout le monde reste dans la boucle.",
    gradient: "from-emerald-500 to-teal-600",
    iconBg: "bg-emerald-500",
  },
];

const steps = [
  {
    num: "01",
    title: "Recevez vos accès",
    desc: "On crée votre espace. Vous recevez un mail avec vos identifiants personnalisés.",
    icon: Sparkles,
  },
  {
    num: "02",
    title: "Réservez une séance",
    desc: "Consultez le calendrier, choisissez un créneau, confirmez. C'est tout.",
    icon: Calendar,
  },
  {
    num: "03",
    title: "Suivez les progrès",
    desc: "QCM, rapports, messagerie : visualisez la progression en temps réel.",
    icon: TrendingUp,
  },
];

const stats = [
  { value: "120+", label: "Familles" },
  { value: "15", label: "Professeurs" },
  { value: "4.9", label: "/ 5 satisfaction" },
  { value: "2k+", label: "Séances" },
];

const roles = [
  {
    title: "Parents",
    desc: "Suivez la progression, recevez les rapports mensuels, échangez avec le prof. Tout est transparent.",
    items: ["Rapports PDF mensuels", "Messagerie directe avec le prof", "Suivi de progression détaillé"],
    gradient: "from-blue-600 to-indigo-700",
  },
  {
    title: "Élèves",
    desc: "Accédez à vos cours, passez vos QCM, échangez avec votre prof. Tout est là.",
    items: ["Cours, PDF et vidéos", "QCM avec correction immédiate", "Suivi de progression"],
    gradient: "from-violet-600 to-purple-700",
  },
  {
    title: "Professeurs",
    desc: "Gérez votre planning, partagez vos ressources, communiquez avec les familles.",
    items: ["Gestion du calendrier", "Partage de ressources", "Tableau de bord complet"],
    gradient: "from-emerald-600 to-teal-700",
  },
];

// ============================================================================
// UTILITIES
// ============================================================================

function Reveal({ children, className = "", delay = 0, direction = "up" }: {
  children: ReactNode; className?: string; delay?: number; direction?: "up" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.unobserve(el); }
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const transforms = {
    up: "translateY(40px)",
    left: "translateX(40px)",
    right: "translateX(-40px)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0)" : transforms[direction],
        transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ============================================================================
// HERO DASHBOARD PREVIEW
// ============================================================================

function HeroVisual() {
  return (
    <div className="relative w-full">
      {/* Glow behind */}
      <div className="absolute -inset-8 bg-gradient-to-br from-indigo-400/20 via-violet-400/10 to-cyan-400/20 rounded-[2rem] blur-2xl" />

      {/* Main card */}
      <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_32px_64px_-16px_rgba(79,70,229,0.2)] border border-white/80 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200/60">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-rose-400/80" />
            <div className="w-3 h-3 rounded-full bg-amber-400/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-400/80" />
          </div>
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-1.5 px-4 py-1 bg-white rounded-lg text-[11px] text-slate-400 border border-slate-200/60 shadow-sm">
              <div className="w-3 h-3 rounded-full bg-emerald-400 flex items-center justify-center">
                <Check className="w-2 h-2 text-white" />
              </div>
              atena.be/dashboard
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Welcome */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[13px] text-slate-400">Bonjour Clara,</p>
              <p className="text-base font-semibold text-slate-800">Votre tableau de bord</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium text-emerald-700">Séance demain 14h</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Prochaine séance", value: "Demain", sub: "14h — Maths", color: "from-blue-500 to-indigo-500" },
              { label: "Dernier QCM", value: "17/20", sub: "Équations", color: "from-violet-500 to-purple-500" },
              { label: "Progression", value: "78%", sub: "Chapitre 4", color: "from-emerald-500 to-teal-500" },
            ].map((card) => (
              <div key={card.label} className="relative overflow-hidden rounded-xl bg-gradient-to-br p-[1px]">
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-[0.07]`} />
                <div className="relative bg-white rounded-xl p-3">
                  <p className="text-[9px] uppercase tracking-wider text-slate-400 font-medium mb-1">{card.label}</p>
                  <p className="text-lg font-bold text-slate-800">{card.value}</p>
                  <p className="text-[10px] text-slate-500">{card.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Calendar strip */}
          <div className="bg-slate-50/80 rounded-xl p-3.5 mb-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">Cette semaine</span>
              <span className="text-[10px] text-indigo-500 font-medium">Mars 2026</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[
                { day: "Lun", num: "24", active: false },
                { day: "Mar", num: "25", active: true },
                { day: "Mer", num: "26", active: false },
                { day: "Jeu", num: "27", active: false },
                { day: "Ven", num: "28", active: true },
              ].map((d) => (
                <div
                  key={d.day}
                  className={`text-center py-2 rounded-xl transition-all ${
                    d.active
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "bg-white text-slate-600 border border-slate-100"
                  }`}
                >
                  <div className={`text-[9px] font-medium ${d.active ? "text-indigo-200" : "text-slate-400"}`}>{d.day}</div>
                  <div className="text-sm font-bold">{d.num}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Message preview */}
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100/60">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shrink-0 shadow-sm">
              <MessageCircle className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-slate-700">Message — Mme. Dupont</div>
              <div className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                &ldquo;Bravo pour les équations ! Continuez les exercices p.42 pour jeudi.&rdquo;
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating notification cards */}
      <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg shadow-slate-200/80 border border-slate-200/60 p-3 flex items-center gap-2.5 animate-float-slow">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center">
          <Check className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-700">QCM terminé</p>
          <p className="text-[9px] text-emerald-600 font-medium">Score : 85%</p>
        </div>
      </div>

      <div className="absolute -bottom-3 -left-4 bg-white rounded-xl shadow-lg shadow-slate-200/80 border border-slate-200/60 p-3 flex items-center gap-2.5 animate-float-delayed">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center">
          <MessageCircle className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-700">Nouveau message</p>
          <p className="text-[9px] text-violet-600 font-medium">Mme. Dupont</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAFF] text-slate-900 overflow-x-hidden">
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(1deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(-1deg); }
        }
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
        .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite 1s; }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 4s ease infinite;
        }
        .glass-card {
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.8);
        }
        .feature-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1px;
          background: linear-gradient(135deg, rgba(255,255,255,0.8), rgba(255,255,255,0.2));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
        }
      `}</style>

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        <div className="mx-auto max-w-7xl px-6 pt-4">
          <div className="flex h-16 items-center justify-between px-6 rounded-2xl glass-card shadow-lg shadow-slate-200/30">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight">Atena</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {[
                { label: "Fonctionnalités", href: "#fonctionnalites" },
                { label: "Comment ça marche", href: "#etapes" },
              ].map((item) => (
                <a key={item.label} href={item.href}
                  className="px-4 py-2 text-sm text-slate-500 hover:text-slate-900 transition-colors rounded-xl hover:bg-white/50">
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="hidden sm:block text-sm text-slate-500 hover:text-slate-900 transition-colors">
                Se connecter
              </Link>
              <Link href="/dashboard"
                className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/50 transition-all hover:-translate-y-0.5">
                Mon espace
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
        {/* Background mesh */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50/80 via-[#FAFAFF] to-violet-50/60" />
          <div
            className="absolute w-[800px] h-[800px] rounded-full blur-[120px] opacity-30 transition-all duration-[2000ms] ease-out"
            style={{
              background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, rgba(139,92,246,0.15) 50%, transparent 70%)",
              left: `${mousePos.x * 20 - 10}%`,
              top: `${mousePos.y * 20}%`,
            }}
          />
          <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-cyan-200/20 blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-violet-200/20 blur-[100px]" />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }} />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Text */}
            <div className="lg:col-span-6">
              <Reveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border border-indigo-100 shadow-sm mb-8">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <span className="text-xs font-medium text-slate-600">
                    Actif en Brabant Wallon
                  </span>
                  <MapPin className="w-3 h-3 text-indigo-400" />
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <h1 className="text-[2.75rem] sm:text-[3.5rem] lg:text-[3.75rem] leading-[1.08] font-bold tracking-tight mb-6">
                  Le suivi scolaire
                  <br />
                  qui{" "}
                  <span className="relative inline-block">
                    <span className={`${sf} italic bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent animate-gradient-x`}>
                      rassure vraiment
                    </span>
                    <svg viewBox="0 0 286 14" className="absolute -bottom-1 left-0 w-full" preserveAspectRatio="none">
                      <path d="M2 10 C 60 4, 100 14, 142 8 S 220 2, 284 10" stroke="url(#hero-line)" strokeWidth="3" fill="none" strokeLinecap="round" />
                      <defs>
                        <linearGradient id="hero-line" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.2}>
                <p className="text-lg text-slate-500 max-w-lg mb-10 leading-relaxed">
                  Parents, élèves et profs réunis sur une plateforme unique.
                  Calendrier, cours, messagerie — tout est clair, tout est simple.
                </p>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <Link href="/dashboard"
                    className="group inline-flex items-center gap-3 px-8 py-4 text-[15px] font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl shadow-xl shadow-indigo-200/50 hover:shadow-2xl hover:shadow-indigo-300/50 transition-all hover:-translate-y-0.5">
                    Accéder à mon espace
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a href="#etapes"
                    className="group inline-flex items-center gap-3 px-6 py-4 text-[15px] font-medium text-slate-600 hover:text-slate-900 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center group-hover:shadow-md group-hover:border-indigo-200 transition-all">
                      <Play className="w-4 h-4 text-indigo-500 ml-0.5" />
                    </div>
                    Voir comment ça marche
                  </a>
                </div>
              </Reveal>

              {/* Stats row */}
              <Reveal delay={0.4}>
                <div className="mt-14 flex items-center gap-8">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <p className={`text-2xl font-bold text-slate-800 ${sf}`}>{s.value}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Visual */}
            <div className="lg:col-span-6">
              <Reveal delay={0.2} direction="left">
                <HeroVisual />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LOGOS / TRUST ===== */}
      <section className="py-10 border-y border-slate-200/60 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            <p className="text-sm text-slate-400 font-medium">Ils nous font confiance :</p>
            {["Familles de Wavre", "Collège St-Étienne", "Écoles d'Ottignies", "Cours privés LLN"].map((name) => (
              <span key={name} className="text-sm font-semibold text-slate-300 tracking-wide uppercase">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="fonctionnalites" className="py-28 lg:py-36 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-100/30 blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
                <Zap className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-xs font-semibold text-indigo-600 tracking-wide uppercase">Fonctionnalités</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
                Tout ce qu&apos;il vous faut.
                <br />
                <span className={`${sf} italic text-slate-300`}>Rien de superflu.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                Six outils pensés pour simplifier le quotidien des familles,
                des élèves et des professeurs.
              </p>
            </Reveal>
          </div>

          {/* === BENTO GRID === */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 auto-rows-auto">

            {/* ---- Card 1: Calendrier (large, spans 2 rows) ---- */}
            <Reveal delay={0} className="lg:row-span-2">
              <div className="group relative h-full bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-300/30 hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl -translate-x-1/4 translate-y-1/4" />

                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center mb-5">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Calendrier & réservation</h3>
                  <p className="text-sm text-blue-100/80 leading-relaxed mb-6">
                    Réservez une séance en quelques clics. Rappels automatiques par mail.
                  </p>
                </div>

                {/* Mini calendar UI */}
                <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-semibold text-white/70 uppercase tracking-wider">Mars 2026</span>
                    <div className="flex gap-1">
                      <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center"><ChevronRight className="w-3 h-3 text-white/50 rotate-180" /></div>
                      <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center"><ChevronRight className="w-3 h-3 text-white/50" /></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 mb-2">
                    {["L", "M", "M", "J", "V"].map((d, idx) => (
                      <div key={idx} className="text-center text-[9px] font-medium text-white/40 py-1">{d}</div>
                    ))}
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[
                      { n: "24", s: false }, { n: "25", s: true }, { n: "26", s: false },
                      { n: "27", s: false }, { n: "28", s: true }, { n: "31", s: false },
                      { n: "1", s: false }, { n: "2", s: true }, { n: "3", s: false }, { n: "4", s: false },
                    ].map((d, idx) => (
                      <div key={idx} className={`py-2 rounded-lg text-center text-[11px] font-medium transition-all ${
                        d.s ? "bg-white text-indigo-700 shadow-lg" : "bg-white/5 text-white/50 hover:bg-white/10"
                      }`}>
                        {d.n}
                        {d.s && <div className="w-1 h-1 rounded-full bg-indigo-400 mx-auto mt-0.5" />}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center gap-2 p-2 rounded-lg bg-white/10">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[10px] text-white/70">Mar 25 — Maths 14h</span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ---- Card 2: Cours & ressources ---- */}
            <Reveal delay={0.08}>
              <div className="group relative bg-white rounded-3xl p-7 overflow-hidden border border-slate-200/60 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-200/30 hover:-translate-y-1 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-50/80 to-purple-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-5 shadow-lg shadow-violet-200/50 group-hover:scale-110 transition-transform duration-500">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Cours & ressources</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-5">PDF, vidéos, exercices — tout centralisé et accessible.</p>

                  {/* File list mini UI */}
                  <div className="space-y-2">
                    {[
                      { name: "Chap4_Equations.pdf", type: "PDF", color: "bg-rose-100 text-rose-600" },
                      { name: "Exercices_Dérivées.pdf", type: "PDF", color: "bg-rose-100 text-rose-600" },
                      { name: "Cours_Vidéo_3.mp4", type: "VID", color: "bg-violet-100 text-violet-600" },
                    ].map((file) => (
                      <div key={file.name} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100/80 group-hover:bg-white group-hover:border-slate-200/80 transition-all">
                        <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${file.color}`}>{file.type}</div>
                        <span className="text-xs text-slate-600 truncate">{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ---- Card 3: QCM ---- */}
            <Reveal delay={0.16}>
              <div className="group relative bg-white rounded-3xl p-7 overflow-hidden border border-slate-200/60 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-200/30 hover:-translate-y-1 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 to-orange-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-5 shadow-lg shadow-amber-200/50 group-hover:scale-110 transition-transform duration-500">
                    <ClipboardCheck className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">QCM auto-corrigés</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-5">Correction instantanée, scores détaillés, analyse des lacunes.</p>

                  {/* QCM mini UI */}
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/60">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>
                        <span className="text-[11px] font-medium text-emerald-700">x = (-b ± √Δ) / 2a</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/60">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 rounded-full bg-rose-400 flex items-center justify-center"><span className="text-[8px] font-bold text-white">✕</span></div>
                        <span className="text-[11px] font-medium text-rose-600">x = -b / 2a</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 px-1">
                      <span className="text-[11px] font-semibold text-slate-600">Score</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full w-[85%] bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" /></div>
                        <span className="text-[11px] font-bold text-amber-600">17/20</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ---- Card 4: Messagerie ---- */}
            <Reveal delay={0.24}>
              <div className="group relative bg-white rounded-3xl p-7 overflow-hidden border border-slate-200/60 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-200/30 hover:-translate-y-1 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/80 to-teal-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-5 shadow-lg shadow-emerald-200/50 group-hover:scale-110 transition-transform duration-500">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">Messagerie intégrée</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-5">Prof ↔ élève, prof ↔ parent. Tout le monde dans la boucle.</p>

                  {/* Chat mini UI */}
                  <div className="space-y-2.5">
                    <div className="flex justify-end">
                      <div className="max-w-[80%] px-3.5 py-2.5 rounded-2xl rounded-br-md bg-indigo-600 text-white text-[11px] leading-relaxed">
                        Bonjour, pouvez-vous m&apos;expliquer l&apos;exercice 3 ?
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[80%] px-3.5 py-2.5 rounded-2xl rounded-bl-md bg-slate-100 text-slate-700 text-[11px] leading-relaxed">
                        Bien sûr ! Commencez par isoler x de chaque côté...
                      </div>
                    </div>
                    <div className="flex justify-start items-end gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <span className="text-[8px] font-bold text-emerald-600">MV</span>
                      </div>
                      <div className="flex gap-1 pt-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "0s" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "0.15s" }} />
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: "0.3s" }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="etapes" className="py-28 lg:py-36 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-200/40 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-6">
          <div className="text-center mb-20">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-6">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-semibold text-emerald-600 tracking-wide uppercase">Simple comme bonjour</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                Trois étapes,{" "}
                <span className={`${sf} italic text-slate-300`}>c&apos;est tout.</span>
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              const gradients = [
                "from-indigo-500 to-blue-600",
                "from-violet-500 to-purple-600",
                "from-emerald-500 to-teal-600",
              ];
              const shadows = [
                "shadow-indigo-200/50",
                "shadow-violet-200/50",
                "shadow-emerald-200/50",
              ];

              return (
                <Reveal key={step.num} delay={i * 0.15}>
                  <div className="group relative">
                    {/* Card */}
                    <div className="relative bg-white rounded-2xl border border-slate-200/60 p-8 text-center hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
                      {/* Large background number */}
                      <div className={`absolute top-3 right-5 text-[5rem] font-bold leading-none text-slate-100/80 ${sf} select-none pointer-events-none`}>
                        {step.num}
                      </div>

                      <div className="relative z-10">
                        {/* Icon */}
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradients[i]} flex items-center justify-center mx-auto mb-6 shadow-xl ${shadows[i]} group-hover:scale-110 transition-transform duration-500`}>
                          <StepIcon className="w-7 h-7 text-white" />
                        </div>

                        <h3 className="text-xl font-bold text-slate-800 mb-3">{step.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed max-w-[260px] mx-auto">{step.desc}</p>
                      </div>
                    </div>

                    {/* Arrow connector */}
                    {i < 2 && (
                      <div className="hidden md:flex absolute top-1/2 -right-5 z-20 w-10 h-10 items-center justify-center">
                        <ChevronRight className="w-5 h-5 text-slate-300" />
                      </div>
                    )}
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== WHO IS IT FOR ===== */}
      <section className="py-28 lg:py-36 relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-100 mb-6">
                <Users className="w-3.5 h-3.5 text-violet-500" />
                <span className="text-xs font-semibold text-violet-600 tracking-wide uppercase">Pour tout le monde</span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
                Conçu pour chaque{" "}
                <span className={`${sf} italic text-violet-500`}>rôle.</span>
              </h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roles.map((role, i) => (
              <Reveal key={role.title} delay={i * 0.12}>
                <div className="group relative h-full">
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl scale-95`} />
                  <div className="relative bg-white rounded-2xl border border-slate-200/60 p-8 h-full transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1 overflow-hidden">
                    {/* Gradient header stripe */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${role.gradient}`} />

                    <h3 className="text-2xl font-bold text-slate-800 mb-3 mt-2">{role.title}</h3>
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">{role.desc}</p>

                    <ul className="space-y-3">
                      {role.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${role.gradient} flex items-center justify-center shrink-0 mt-0.5`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 px-8 py-20 md:px-20 md:py-24">
              {/* Background decorations */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-400/10 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
              <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }} />

              <div className="relative z-10 text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur mb-8">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-medium text-white/80">Vos accès sont déjà prêts</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 tracking-tight">
                  Prêt à simplifier{" "}
                  <span className={`${sf} italic text-indigo-200`}>le suivi scolaire ?</span>
                </h2>
                <p className="text-lg text-indigo-200 mb-10 leading-relaxed">
                  Connectez-vous et découvrez votre espace personnalisé.
                  Calendrier, cours, messagerie — tout est prêt.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/dashboard"
                    className="group inline-flex items-center gap-3 px-8 py-4 text-base font-semibold bg-white text-indigo-700 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5">
                    Ouvrir mon espace
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a href="mailto:contact@atena.be" className="inline-flex items-center gap-2 px-6 py-4 text-base font-medium text-white/80 hover:text-white transition-colors">
                    <Mail className="w-4 h-4" />
                    Nous contacter
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-slate-200/60 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-5">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold tracking-tight">Atena</span>
              </div>
              <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
                Cours particuliers à domicile en Brabant Wallon.
                Une plateforme claire pour les familles, les élèves et les professeurs.
              </p>
              <div className="flex flex-col gap-2.5 text-sm text-slate-400">
                <span className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-300" /> Brabant Wallon, Belgique
                </span>
                <span className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-slate-300" /> contact@atena.be
                </span>
                <span className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-slate-300" /> +32 10 00 00 00
                </span>
              </div>
            </div>

            <div className="md:col-span-3 md:col-start-7">
              <h4 className="text-sm font-semibold text-slate-800 mb-5">Plateforme</h4>
              <ul className="space-y-3">
                {[
                  { label: "Fonctionnalités", href: "#fonctionnalites" },
                  { label: "Comment ça marche", href: "#etapes" },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">{item.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="text-sm font-semibold text-slate-800 mb-5">Légal</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Confidentialité</Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Conditions</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-14 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-slate-400">&copy; 2026 Atena. Tous droits réservés.</p>
            <p className="text-xs text-slate-300">Fait avec soin en Belgique</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
