Je développe une plateforme web appelée Atena, une application de gestion de cours particuliers à domicile ciblant la région du Brabant Wallon (Belgique).
La plateforme a 4 rôles utilisateurs : Administrateur, Professeur, Élève et Parent.
Les fonctionnalités principales sont :

Calendrier et prise de RDV
Cours et modules (PDF, vidéos)
QCM avec correction automatique
Feedback de séance (rempli par le prof, visible par élève et parent)
Profil élève avec statistiques de progression
Messagerie prof ↔ élève et prof ↔ parent
Rapport PDF mensuel envoyé aux parents
Dashboard admin

La stack technique est Next.js 14 (App Router), TypeScript, déploiement sur Railway. La base de données sera PostgreSQL dans un conteneur Docker mais on ne s'en occupe pas encore.
Je pars d'un ancien projet appelé CrossTalk qui est déjà en Next.js 14. Il faut nettoyer ce projet, supprimer tout ce qui est lié à l'ancienne base de données et au backend de CrossTalk, et reconstruire l'interface pour Atena.
Pour l'instant on travaille uniquement sur le frontend avec des données statiques fictives (mock data). Pas d'appels API, pas de base de données. L'objectif est de valider l'interface avant d'attaquer le backend.
Le design doit être professionnel, épuré et moderne, adapté à des parents, des élèves du secondaire et des professeurs.