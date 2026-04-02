// =============================================
// MOCK DATA — Atena (données fictives)
// =============================================

export type Role = "prof" | "eleve" | "parent" | "admin";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: Role;
  email: string;
  avatar?: string;
}

export interface Session {
  id: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  prof: string;
  eleve: string;
  matiere: string;
  type: "presentiel" | "en ligne";
  statut: "planifiee" | "realisee" | "annulee";
}

export interface Feedback {
  id: string;
  sessionId: string;
  date: string;
  prof: string;
  matiere: string;
  contenu: string;
  pointsForts: string[];
  pointsAmeliorer: string[];
  note: number; // sur 5
}

export interface QCMResult {
  id: string;
  titre: string;
  matiere: string;
  date: string;
  score: number;
  total: number;
  duree: string;
  statut: "reussi" | "echoue" | "en_cours";
}

export interface Message {
  id: string;
  expediteur: string;
  expediteurRole: Role;
  destinataire: string;
  contenu: string;
  date: string;
  lu: boolean;
}

export interface Module {
  id: string;
  titre: string;
  matiere: string;
  description: string;
  prof: string;
  type: "pdf" | "video" | "exercice";
  duree?: string;
  pages?: number;
  niveau: string;
}

// --- Utilisateurs ---
export const mockCurrentUser: User = {
  id: "u1",
  firstName: "Lucas",
  lastName: "Dupont",
  role: "eleve",
  email: "lucas.dupont@example.com",
};

export const mockUsers: User[] = [
  { id: "u1", firstName: "Lucas", lastName: "Dupont", role: "eleve", email: "lucas.dupont@example.com" },
  { id: "u2", firstName: "Marie", lastName: "Lambert", role: "prof", email: "marie.lambert@example.com" },
  { id: "u3", firstName: "Sophie", lastName: "Dupont", role: "parent", email: "sophie.dupont@example.com" },
  { id: "u4", firstName: "Thomas", lastName: "Martin", role: "eleve", email: "thomas.martin@example.com" },
  { id: "u5", firstName: "Jean", lastName: "Renard", role: "prof", email: "jean.renard@example.com" },
  { id: "u6", firstName: "Admin", lastName: "Atena", role: "admin", email: "admin@atena.be" },
];

// --- Sessions ---
export const mockSessions: Session[] = [
  {
    id: "s1",
    date: "2026-04-02",
    heureDebut: "16:00",
    heureFin: "17:30",
    prof: "Marie Lambert",
    eleve: "Lucas Dupont",
    matiere: "Mathématiques",
    type: "presentiel",
    statut: "planifiee",
  },
  {
    id: "s2",
    date: "2026-04-05",
    heureDebut: "10:00",
    heureFin: "11:00",
    prof: "Jean Renard",
    eleve: "Lucas Dupont",
    matiere: "Français",
    type: "en ligne",
    statut: "planifiee",
  },
  {
    id: "s3",
    date: "2026-03-26",
    heureDebut: "16:00",
    heureFin: "17:30",
    prof: "Marie Lambert",
    eleve: "Lucas Dupont",
    matiere: "Mathématiques",
    type: "presentiel",
    statut: "realisee",
  },
  {
    id: "s4",
    date: "2026-03-19",
    heureDebut: "16:00",
    heureFin: "17:30",
    prof: "Marie Lambert",
    eleve: "Lucas Dupont",
    matiere: "Mathématiques",
    type: "presentiel",
    statut: "realisee",
  },
];

// --- Feedbacks ---
export const mockFeedbacks: Feedback[] = [
  {
    id: "f1",
    sessionId: "s3",
    date: "2026-03-26",
    prof: "Marie Lambert",
    matiere: "Mathématiques",
    contenu:
      "Très bonne séance aujourd'hui ! Lucas a bien progressé sur les équations du second degré. Il comprend bien la méthode du discriminant et commence à l'appliquer avec autonomie.",
    pointsForts: ["Bonne concentration", "Méthode du discriminant maîtrisée", "Questions pertinentes"],
    pointsAmeliorer: ["Revoir les systèmes d'équations", "Travailler la rapidité de calcul"],
    note: 4,
  },
  {
    id: "f2",
    sessionId: "s4",
    date: "2026-03-19",
    prof: "Marie Lambert",
    matiere: "Mathématiques",
    contenu:
      "Séance axée sur la trigonométrie. Lucas montre des difficultés sur le cercle trigonométrique mais s'accroche bien. Des exercices supplémentaires ont été donnés à faire à la maison.",
    pointsForts: ["Persévérance", "Participation active"],
    pointsAmeliorer: ["Cercle trigonométrique", "Formules sin/cos/tan"],
    note: 3,
  },
];

// --- Résultats QCM ---
export const mockQCMResults: QCMResult[] = [
  {
    id: "q1",
    titre: "Équations du second degré",
    matiere: "Mathématiques",
    date: "2026-03-24",
    score: 14,
    total: 20,
    duree: "18 min",
    statut: "reussi",
  },
  {
    id: "q2",
    titre: "Accord du participe passé",
    matiere: "Français",
    date: "2026-03-20",
    score: 11,
    total: 20,
    duree: "22 min",
    statut: "reussi",
  },
  {
    id: "q3",
    titre: "Trigonométrie — niveau 1",
    matiere: "Mathématiques",
    date: "2026-03-15",
    score: 8,
    total: 20,
    duree: "25 min",
    statut: "echoue",
  },
  {
    id: "q4",
    titre: "Les temps du passé",
    matiere: "Français",
    date: "2026-03-10",
    score: 16,
    total: 20,
    duree: "15 min",
    statut: "reussi",
  },
];

// --- Messages ---
export const mockMessages: Message[] = [
  {
    id: "m1",
    expediteur: "Marie Lambert",
    expediteurRole: "prof",
    destinataire: "Lucas Dupont",
    contenu: "Bonjour Lucas, pense à réviser les formules de trigonométrie avant notre prochaine séance !",
    date: "2026-03-28 14:32",
    lu: true,
  },
  {
    id: "m2",
    expediteur: "Lucas Dupont",
    expediteurRole: "eleve",
    destinataire: "Marie Lambert",
    contenu: "Bonjour Madame Lambert, oui je vais réviser ce soir. À mercredi !",
    date: "2026-03-28 15:10",
    lu: true,
  },
  {
    id: "m3",
    expediteur: "Marie Lambert",
    expediteurRole: "prof",
    destinataire: "Sophie Dupont",
    contenu:
      "Bonjour Madame Dupont, je voulais vous informer que Lucas a fait de bons progrès ce mois-ci, notamment en algèbre. Il manque encore un peu de régularité dans ses révisions.",
    date: "2026-03-27 09:15",
    lu: false,
  },
];

// --- Modules ---
export const mockModules: Module[] = [
  {
    id: "mod1",
    titre: "Équations du second degré — Cours complet",
    matiere: "Mathématiques",
    description: "Définition, discriminant, résolution et interprétation graphique.",
    prof: "Marie Lambert",
    type: "pdf",
    pages: 12,
    niveau: "5e secondaire",
  },
  {
    id: "mod2",
    titre: "Introduction à la trigonométrie",
    matiere: "Mathématiques",
    description: "Cercle trigonométrique, sin, cos, tan et leurs propriétés.",
    prof: "Marie Lambert",
    type: "video",
    duree: "24 min",
    niveau: "5e secondaire",
  },
  {
    id: "mod3",
    titre: "Exercices — Équations",
    matiere: "Mathématiques",
    description: "Série d'exercices progressifs sur les équations du 1er et 2e degré.",
    prof: "Marie Lambert",
    type: "exercice",
    niveau: "5e secondaire",
  },
  {
    id: "mod4",
    titre: "L'accord du participe passé",
    matiere: "Français",
    description: "Règles d'accord avec avoir et être, cas particuliers.",
    prof: "Jean Renard",
    type: "pdf",
    pages: 8,
    niveau: "4e secondaire",
  },
];

// --- Stats élève ---
export const mockStudentStats = {
  heuresTotales: 24,
  assiduite: 92,
  scoreMoyenQCM: 72,
  sessionsRealisees: 16,
  progression: [
    { mois: "Jan", score: 58 },
    { mois: "Fév", score: 63 },
    { mois: "Mar", score: 72 },
  ],
};
