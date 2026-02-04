# CrossTalk - Plateforme d'apprentissage de langues

Application web pour l'apprentissage de langues avec gestion de cours et messagerie entre élèves et professeurs.

## Architecture

L'application utilise une architecture Docker à 3 containers:

- **Container 1 - PostgreSQL** : Base de données (Port 5432)
- **Container 2 - Express API** : Backend Node.js/Express avec Prisma ORM (Port 4000)
- **Container 3 - Next.js** : Frontend React/Next.js (Port 3000)

## Configuration

### 1. Configuration des variables d'environnement

**IMPORTANT**: Les credentials de la base de données sont gérés via des variables d'environnement pour la sécurité.

```bash
# Copier le template de configuration
cp .env.example .env
```

Ensuite, modifier le fichier `.env` avec vos propres credentials:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=votre_mot_de_passe_securise
POSTGRES_DB=crosstalk
DATABASE_URL=postgresql://postgres:votre_mot_de_passe_securise@db:5432/crosstalk
```

**⚠️ ATTENTION**:
- **Ne JAMAIS committer le fichier `.env`** (déjà dans .gitignore)
- Utiliser un mot de passe fort en production
- Le fichier `.env.example` sert de template et peut être versionné

### 2. Démarrer l'application

```bash
# Démarrer tous les containers
docker compose up -d

# Vérifier que tout fonctionne
docker compose ps
```

Tous les containers doivent afficher le status "Up".

### 3. Initialiser la base de données

Les tables sont automatiquement créées au démarrage grâce à `prisma db push`.

Pour peupler avec des données de test:

```bash
docker compose exec api npx prisma db seed
```

Ceci créera:
- 👨‍🏫 Un professeur : `prof@school.com` / `password123`
- 🎓 Un élève : `eleve@school.com` / `password123`
- 📚 Un cours d'Anglais niveau B2
- 💬 Un message de test

## Accès à l'application

- **Frontend**: http://localhost:3000
- **API**: http://localhost:4000
- **Base de données**: localhost:5432

## Routes API disponibles

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/login` | Connexion utilisateur |
| GET | `/my-courses/:userId` | Cours d'un utilisateur |
| GET | `/courses` | Liste de tous les cours |
| GET | `/messages/:userId/:contactId` | Messages entre 2 utilisateurs |
| POST | `/messages` | Envoyer un message |

### Exemples d'utilisation

```bash
# Liste des cours
curl http://localhost:4000/courses

# Login
curl -X POST http://localhost:4000/login \
  -H "Content-Type: application/json" \
  -d '{"email":"prof@school.com","password":"password123"}'

# Messages entre élève (id=2) et prof (id=1)
curl http://localhost:4000/messages/2/1
```

## Commandes utiles

### Gestion des containers

```bash
# Voir les logs
docker compose logs -f

# Logs d'un container spécifique
docker compose logs -f api

# Redémarrer un container
docker compose restart api

# Arrêter tout
docker compose down

# Arrêter et supprimer les volumes (⚠️ Perte de données)
docker compose down -v
```

### Base de données

```bash
# Appliquer le schéma Prisma
docker compose exec api npx prisma db push

# Ouvrir Prisma Studio (interface graphique)
docker compose exec api npx prisma studio

# Re-seed la base de données
docker compose exec api npx prisma db seed
```

## Structure du projet

```
CrossTalk/
├── app/                    # Pages Next.js (Frontend)
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma   # Schéma de base de données
│   │   └── seed.ts         # Données de test
│   ├── src/
│   │   └── index.ts        # Serveur Express
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # Orchestration des 3 containers
├── Dockerfile.frontend
├── .env                    # Variables d'environnement (NON versionné)
├── .env.example            # Template de configuration
└── README.md
```

## Modèle de données

### User
- `id`, `email`, `password`, `name`, `role` (PROF/ELEVE)

### Course
- `id`, `language`, `level`, `teacherId`

### Enrollment
- `id`, `userId`, `courseId`

### Message
- `id`, `content`, `senderId`, `receiverId`, `sentAt`

## Développement

Le projet utilise:
- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Prisma ORM
- **Base de données**: PostgreSQL 16
- **Containerisation**: Docker & Docker Compose

### Hot Reload

Les modifications de code sont automatiquement rechargées:
- Frontend: Next.js Fast Refresh
- Backend: ts-node-dev

### Ajouter une dépendance

```bash
# Backend
docker compose exec api npm install nom-package

# Frontend
docker compose exec frontend npm install nom-package
```

## Sécurité

- ✅ Mots de passe en variables d'environnement
- ✅ `.env` dans .gitignore
- ✅ CORS configuré pour localhost:3000
- ⚠️ Passwords en clair en DB (MVP uniquement - à hasher en production)

## Guide de configuration complet

Pour plus de détails sur l'architecture Docker, consultez [DOCKER_SETUP.md](DOCKER_SETUP.md).

## Licence

Ce projet est développé dans un cadre éducatif.
