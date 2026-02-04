# Guide de Configuration Docker pour CrossTalk

## Architecture à 3 Containers

```
┌─────────────────┐
│  Container 1    │
│  PostgreSQL DB  │  Port 5432
│  (db)           │
└────────┬────────┘
         │
         │ Prisma
         ▼
┌─────────────────┐
│  Container 2    │
│  Express API    │  Port 4000
│  (api)          │
└────────┬────────┘
         │
         │ HTTP
         ▼
┌─────────────────┐
│  Container 3    │
│  Next.js        │  Port 3000
│  (frontend)     │
└─────────────────┘
```

## Règles de Communication

- **DB** : Muet, attend les connexions sur le port 5432
- **API** : Seul à parler à la DB, expose des routes HTTP sur le port 4000
- **Frontend** : Appelle uniquement l'API, jamais la DB directement

## Installation et Démarrage

### 1. Démarrer tous les containers

```bash
docker compose up -d
```

Ceci va :
- Créer et démarrer le container PostgreSQL
- Créer et démarrer le container API Express
- Créer et démarrer le container Next.js

### 2. Vérifier que tout tourne

```bash
docker compose ps
```

Vous devriez voir 3 containers en status "running".

### 3. Créer les tables dans la DB

```bash
docker compose exec api npx prisma migrate dev --name init
```

Cette commande :
- Entre dans le container API
- Lance Prisma pour créer les tables définies dans le schema

### 4. Peupler la DB avec des données de test (Seed)

```bash
docker compose exec api npx prisma db seed
```

Ceci va insérer :
- 1 Prof (prof@school.com / password123)
- 1 Élève (eleve@school.com / password123)
- 1 Cours d'Anglais niveau B2
- 1 Message de test

### 5. Accéder à l'application

- **Frontend** : http://localhost:3000
- **API** : http://localhost:4000
- **DB** : localhost:5432 (avec un client SQL comme pgAdmin)

## Commandes Utiles

### Voir les logs

```bash
# Tous les containers
docker compose logs -f

# Un seul container
docker compose logs -f api
docker compose logs -f frontend
docker compose logs -f db
```

### Redémarrer un container

```bash
docker compose restart api
docker compose restart frontend
```

### Arrêter tout

```bash
docker compose down
```

### Arrêter et supprimer les volumes (⚠️ Perte de données)

```bash
docker compose down -v
```

### Reconstruire les images

```bash
docker compose build
docker compose up -d
```

### Exécuter des commandes dans un container

```bash
# Shell dans le container API
docker compose exec api sh

# Shell dans le container Frontend
docker compose exec frontend sh

# Commande Prisma Studio (Interface graphique DB)
docker compose exec api npx prisma studio
```

## Routes API Disponibles

| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/login` | Connexion utilisateur |
| GET | `/my-courses/:userId` | Cours d'un utilisateur |
| GET | `/courses` | Tous les cours disponibles |
| GET | `/messages/:userId/:contactId` | Messages entre 2 utilisateurs |
| POST | `/messages` | Envoyer un message |

## Variables d'Environnement

### Backend ([backend/.env](backend/.env))
```env
DATABASE_URL="postgresql://postgres:password@db:5432/crosstalk"
```

### Frontend (si besoin)
```env
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

## Dépannage

### La DB ne se connecte pas
```bash
# Vérifier que le container DB est bien démarré
docker compose ps db

# Voir les logs
docker compose logs db
```

### L'API ne démarre pas
```bash
# Vérifier que Prisma est bien généré
docker compose exec api npx prisma generate

# Relancer les migrations
docker compose exec api npx prisma migrate deploy
```

### Le Frontend ne trouve pas l'API
Vérifier que vous utilisez bien `http://localhost:4000` dans votre code client-side (useEffect, fetch depuis le navigateur).

⚠️ **Important** : Si vous faites du Server-Side Rendering (getServerSideProps), utilisez `http://api:4000` à la place.

## Structure des Fichiers

```
CrossTalk/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma    # Schéma de la DB
│   │   └── seed.ts          # Données de test
│   ├── src/
│   │   └── index.ts         # Serveur Express
│   ├── .env                 # Variables d'environnement
│   ├── Dockerfile           # Image Docker du backend
│   ├── package.json         # Dépendances backend
│   └── tsconfig.json        # Config TypeScript
├── app/                     # Pages Next.js
├── docker-compose.yml       # Orchestration des 3 containers
├── Dockerfile.frontend      # Image Docker du frontend
└── package.json             # Dépendances frontend
```

## Workflow de Développement

1. **Modifier le code backend** : Les changements sont automatiquement rechargés (hot reload)
2. **Modifier le code frontend** : Idem, Next.js recharge automatiquement
3. **Modifier le schéma Prisma** :
   ```bash
   docker compose exec api npx prisma migrate dev --name nom_migration
   docker compose exec api npx prisma generate
   ```
4. **Ajouter des dépendances** :
   ```bash
   # Backend
   docker compose exec api npm install nom-package

   # Frontend
   docker compose exec frontend npm install nom-package
   ```

## Production

Pour le déploiement en production, modifiez :
- Les mots de passe DB (pas "password" !)
- Les URLs CORS dans l'API
- Les commandes CMD dans les Dockerfiles (utiliser `npm start` au lieu de `npm run dev`)
