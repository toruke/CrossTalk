-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'prof', 'eleve', 'parent');

-- CreateEnum
CREATE TYPE "JourSemaine" AS ENUM ('lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('presentiel', 'en_ligne');

-- CreateEnum
CREATE TYPE "SessionStatut" AS ENUM ('demandee', 'confirmee', 'realisee', 'annulee', 'reportee');

-- CreateEnum
CREATE TYPE "EvaluationType" AS ENUM ('qcm', 'qrm', 'vrai_faux', 'reponse_libre', 'papier');

-- CreateEnum
CREATE TYPE "ResultStatut" AS ENUM ('en_cours', 'soumis', 'corrige');

-- CreateEnum
CREATE TYPE "ModuleType" AS ENUM ('pdf', 'video', 'exercice', 'autre');

-- CreateEnum
CREATE TYPE "NotifType" AS ENUM ('nouveau_feedback', 'nouveau_message', 'nouveau_qcm', 'rappel_seance', 'seance_confirmee', 'seance_annulee', 'nouveau_module', 'rapport_disponible');

-- CreateEnum
CREATE TYPE "ObjectifStatut" AS ENUM ('en_cours', 'atteint', 'abandonne');

-- CreateEnum
CREATE TYPE "RapportStatut" AS ENUM ('en_generation', 'genere', 'erreur');

-- CreateEnum
CREATE TYPE "PaiementStatut" AS ENUM ('en_attente', 'paye', 'rembourse');

-- CreateEnum
CREATE TYPE "PaiementMode" AS ENUM ('cash', 'virement', 'autre');

-- CreateTable
CREATE TABLE "Niveau" (
    "id" TEXT NOT NULL,
    "nom" VARCHAR(50) NOT NULL,
    "ordre" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Niveau_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Matiere" (
    "id" TEXT NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Matiere_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "nom" VARCHAR(100) NOT NULL,
    "prenom" VARCHAR(100) NOT NULL,
    "role" "UserRole" NOT NULL,
    "telephone" VARCHAR(20),
    "adresse" TEXT,
    "avatarUrl" TEXT,
    "parentId" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "loginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfEleve" (
    "id" TEXT NOT NULL,
    "profId" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "matiereId" TEXT NOT NULL,
    "niveauId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfEleve_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disponibilite" (
    "id" TEXT NOT NULL,
    "profId" TEXT NOT NULL,
    "jour" "JourSemaine" NOT NULL,
    "heureDebut" TIME NOT NULL,
    "heureFin" TIME NOT NULL,
    "recurrent" BOOLEAN NOT NULL DEFAULT true,
    "dateSpecifique" DATE,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Disponibilite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "profId" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "matiereId" TEXT NOT NULL,
    "niveauId" TEXT,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "type" "SessionType" NOT NULL DEFAULT 'presentiel',
    "statut" "SessionStatut" NOT NULL DEFAULT 'demandee',
    "annulePar" TEXT,
    "motifAnnulation" TEXT,
    "annuleAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "profId" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "themesAbordes" TEXT NOT NULL,
    "pointsPositifs" TEXT NOT NULL,
    "pointsAAmeliorer" TEXT NOT NULL,
    "objectifSuivant" TEXT NOT NULL,
    "noteInterne" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" TEXT NOT NULL,
    "profId" TEXT NOT NULL,
    "matiereId" TEXT NOT NULL,
    "niveauId" TEXT,
    "titre" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type" "EvaluationType" NOT NULL,
    "dureeLimite" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,
    "enonce" TEXT NOT NULL,
    "type" "EvaluationType" NOT NULL,
    "ordre" INTEGER NOT NULL,
    "points" DECIMAL(5,2) NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReponsePossible" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "texte" TEXT NOT NULL,
    "estCorrecte" BOOLEAN NOT NULL DEFAULT false,
    "ordre" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReponsePossible_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationAssignment" (
    "id" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "assignedBy" TEXT NOT NULL,
    "dateLimite" TIMESTAMP(3),
    "availableFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvaluationAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationResult" (
    "id" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "statut" "ResultStatut" NOT NULL DEFAULT 'en_cours',
    "score" DECIMAL(5,2),
    "scoreMax" DECIMAL(5,2),
    "dureePassee" INTEGER,
    "submittedAt" TIMESTAMP(3),
    "corrigeAt" TIMESTAMP(3),
    "corrigePar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvaluationResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReponseEleve" (
    "id" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "reponseTexte" TEXT,
    "fichierUrl" TEXT,
    "fichierIv" TEXT,
    "reponsesChoisies" TEXT[],
    "estCorrecte" BOOLEAN,
    "pointsObtenus" DECIMAL(5,2),
    "commentaireProf" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReponseEleve_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "profId" TEXT NOT NULL,
    "matiereId" TEXT NOT NULL,
    "niveauId" TEXT,
    "titre" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type" "ModuleType" NOT NULL,
    "fileUrl" TEXT,
    "fileType" VARCHAR(50),
    "fileSize" INTEGER,
    "dureeMinutes" INTEGER,
    "nbPages" INTEGER,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ModuleAssignment" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "assignedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModuleAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentEleve" (
    "id" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "profId" TEXT NOT NULL,
    "sessionId" TEXT,
    "titre" VARCHAR(255) NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" VARCHAR(50) NOT NULL,
    "fileSize" INTEGER,
    "commentaireProf" TEXT,
    "commenteAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentEleve_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "participant1Id" TEXT NOT NULL,
    "participant2Id" TEXT NOT NULL,
    "lastMessageAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "contenuChiffre" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "isDelivered" BOOLEAN NOT NULL DEFAULT false,
    "deliveredAt" TIMESTAMP(3),
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "deletedBySender" BOOLEAN NOT NULL DEFAULT false,
    "deletedByReceiver" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotifType" NOT NULL,
    "titre" VARCHAR(255) NOT NULL,
    "contenu" TEXT,
    "entityType" VARCHAR(50),
    "entityId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObjectifPedagogique" (
    "id" TEXT NOT NULL,
    "profId" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "matiereId" TEXT NOT NULL,
    "titre" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "dateCible" DATE,
    "statut" "ObjectifStatut" NOT NULL DEFAULT 'en_cours',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ObjectifPedagogique_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RapportPdf" (
    "id" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "mois" INTEGER NOT NULL,
    "annee" INTEGER NOT NULL,
    "statut" "RapportStatut" NOT NULL DEFAULT 'en_generation',
    "fileUrl" TEXT,
    "fileIv" TEXT,
    "generatedAt" TIMESTAMP(3),
    "envoyeAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RapportPdf_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "eleveId" TEXT NOT NULL,
    "profId" TEXT NOT NULL,
    "montant" DECIMAL(8,2) NOT NULL,
    "statut" "PaiementStatut" NOT NULL DEFAULT 'en_attente',
    "mode" "PaiementMode",
    "paidAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "action" VARCHAR(100) NOT NULL,
    "entityType" VARCHAR(50),
    "entityId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ProfEleve_profId_eleveId_matiereId_key" ON "ProfEleve"("profId", "eleveId", "matiereId");

-- CreateIndex
CREATE UNIQUE INDEX "Feedback_sessionId_key" ON "Feedback"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "EvaluationAssignment_evaluationId_eleveId_key" ON "EvaluationAssignment"("evaluationId", "eleveId");

-- CreateIndex
CREATE UNIQUE INDEX "ModuleAssignment_moduleId_eleveId_key" ON "ModuleAssignment"("moduleId", "eleveId");

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_participant1Id_participant2Id_key" ON "Conversation"("participant1Id", "participant2Id");

-- CreateIndex
CREATE UNIQUE INDEX "RapportPdf_eleveId_mois_annee_key" ON "RapportPdf"("eleveId", "mois", "annee");

-- CreateIndex
CREATE UNIQUE INDEX "Paiement_sessionId_key" ON "Paiement"("sessionId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfEleve" ADD CONSTRAINT "ProfEleve_profId_fkey" FOREIGN KEY ("profId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfEleve" ADD CONSTRAINT "ProfEleve_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfEleve" ADD CONSTRAINT "ProfEleve_matiereId_fkey" FOREIGN KEY ("matiereId") REFERENCES "Matiere"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfEleve" ADD CONSTRAINT "ProfEleve_niveauId_fkey" FOREIGN KEY ("niveauId") REFERENCES "Niveau"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfEleve" ADD CONSTRAINT "ProfEleve_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Disponibilite" ADD CONSTRAINT "Disponibilite_profId_fkey" FOREIGN KEY ("profId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_profId_fkey" FOREIGN KEY ("profId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_matiereId_fkey" FOREIGN KEY ("matiereId") REFERENCES "Matiere"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_niveauId_fkey" FOREIGN KEY ("niveauId") REFERENCES "Niveau"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_annulePar_fkey" FOREIGN KEY ("annulePar") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_profId_fkey" FOREIGN KEY ("profId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_profId_fkey" FOREIGN KEY ("profId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_matiereId_fkey" FOREIGN KEY ("matiereId") REFERENCES "Matiere"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_niveauId_fkey" FOREIGN KEY ("niveauId") REFERENCES "Niveau"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReponsePossible" ADD CONSTRAINT "ReponsePossible_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationAssignment" ADD CONSTRAINT "EvaluationAssignment_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationAssignment" ADD CONSTRAINT "EvaluationAssignment_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationAssignment" ADD CONSTRAINT "EvaluationAssignment_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationResult" ADD CONSTRAINT "EvaluationResult_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationResult" ADD CONSTRAINT "EvaluationResult_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationResult" ADD CONSTRAINT "EvaluationResult_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "EvaluationAssignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationResult" ADD CONSTRAINT "EvaluationResult_corrigePar_fkey" FOREIGN KEY ("corrigePar") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReponseEleve" ADD CONSTRAINT "ReponseEleve_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "EvaluationResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReponseEleve" ADD CONSTRAINT "ReponseEleve_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_profId_fkey" FOREIGN KEY ("profId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_matiereId_fkey" FOREIGN KEY ("matiereId") REFERENCES "Matiere"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_niveauId_fkey" FOREIGN KEY ("niveauId") REFERENCES "Niveau"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAssignment" ADD CONSTRAINT "ModuleAssignment_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAssignment" ADD CONSTRAINT "ModuleAssignment_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAssignment" ADD CONSTRAINT "ModuleAssignment_assignedBy_fkey" FOREIGN KEY ("assignedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentEleve" ADD CONSTRAINT "DocumentEleve_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentEleve" ADD CONSTRAINT "DocumentEleve_profId_fkey" FOREIGN KEY ("profId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentEleve" ADD CONSTRAINT "DocumentEleve_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_participant1Id_fkey" FOREIGN KEY ("participant1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_participant2Id_fkey" FOREIGN KEY ("participant2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectifPedagogique" ADD CONSTRAINT "ObjectifPedagogique_profId_fkey" FOREIGN KEY ("profId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectifPedagogique" ADD CONSTRAINT "ObjectifPedagogique_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObjectifPedagogique" ADD CONSTRAINT "ObjectifPedagogique_matiereId_fkey" FOREIGN KEY ("matiereId") REFERENCES "Matiere"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RapportPdf" ADD CONSTRAINT "RapportPdf_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RapportPdf" ADD CONSTRAINT "RapportPdf_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_eleveId_fkey" FOREIGN KEY ("eleveId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_profId_fkey" FOREIGN KEY ("profId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
