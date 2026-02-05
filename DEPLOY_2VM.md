# Guide de Déploiement - Architecture 2 VMs (DMZ + Datacenter)

Ce guide vous permet de déployer CrossTalk sur **2 machines virtuelles Debian** avec séparation DMZ/Datacenter et reverse proxy Nginx.

## Architecture

```
🌐 Internet
    ↓
┌─────────────────── VM1 (DMZ) ─────────────────┐
│  Nginx (80/443) → Frontend (3000)             │
│                → Backend API (4000)           │
└───────────────────────────────────────────────┘
                    ↓ TCP 5432
┌─────────────── VM2 (Datacenter) ──────────────┐
│  PostgreSQL (5432) - Réseau privé uniquement  │
└───────────────────────────────────────────────┘
```

## Prérequis

- **2 VMs Debian 11/12** avec accès réseau interne
- **Nom de domaine** pointant vers l'IP publique de VM1
- **Docker** et **Docker Compose** sur VM1
- **PostgreSQL** sur VM2

---

## Partie 1 : Configuration VM2 (Datacenter) - Base de données

> [!IMPORTANT]
> Commencez PAR LA VM2 pour que la base de données soit prête quand vous configurerez VM1.

Suivez le guide détaillé : **[VM2_DATABASE_SETUP.md](./VM2_DATABASE_SETUP.md)**

**Résumé rapide :**
```bash
# 1. Installer PostgreSQL
sudo apt update && sudo apt install -y postgresql

# 2. Créer la base et l'utilisateur
sudo -u postgres psql
CREATE DATABASE crosstalk;
CREATE USER crosstalk WITH ENCRYPTED PASSWORD 'MOT_DE_PASSE_SECURISE';
GRANT ALL PRIVILEGES ON DATABASE crosstalk TO crosstalk;
\q

# 3. Autoriser VM1 dans pg_hba.conf
sudo nano /etc/postgresql/15/main/pg_hba.conf
# Ajouter: host crosstalk crosstalk <VM1_IP>/32 scram-sha-256

# 4. Redémarrer
sudo systemctl restart postgresql

# 5. Pare-feu
sudo ufw allow from <VM1_IP> to any port 5432
sudo ufw enable
```

**Notez :**
- IP de VM2 : `___________________`
- Mot de passe DB : `___________________`

---

## Partie 2 : Configuration VM1 (DMZ) - Application Web

### 2.1. Installation de Docker

```bash
# Mise à jour système
sudo apt update && sudo apt upgrade -y

# Installation Docker
sudo apt install -y docker.io docker-compose-v2 git

# Démarrer Docker au boot
sudo systemctl enable docker --now

# Vérifier
docker --version
```

### 2.2. Récupération du code

```bash
# Cloner le repository
git clone https://github.com/toruke/CrossTalk.git
cd CrossTalk
```

### 2.3. Configuration des variables d'environnement

```bash
# Copier le template
cp .env.production.example .env.production

# Éditer avec vos vraies valeurs
nano .env.production
```

**Variables à remplir impérativement :**

```bash
# DATABASE (VM2)
DATABASE_URL="postgresql://crosstalk:MOT_DE_PASSE@<IP_VM2>:5432/crosstalk"

# CLERK (Dashboard Clerk → API Keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..."
CLERK_SECRET_KEY="sk_live_..."

# APPLICATION
FRONTEND_URL="https://votre-domaine.com"
NEXT_PUBLIC_API_URL="/api"

# DOMAINE (pour les certificats SSL)
DOMAIN_NAME="votre-domaine.com"
```

### 2.4. Configuration Nginx

Éditez `nginx/nginx.conf` et remplacez **DOMAIN_NAME** par votre vrai domaine :

```bash
nano nginx/nginx.conf
```

Ligne 48 et 49, remplacez :
```nginx
ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;
```

### 2.5. Génération des certificats SSL (Certbot)

**Première étape : Obtenir le certificat initial**

```bash
# Créer les dossiers nécessaires
mkdir -p certbot/www certbot/conf

# Lancer temporairement Nginx en HTTP uniquement
docker compose -f docker-compose.dmz.yml up -d nginx

# Générer le certificat (remplacez votre-domaine.com et votre@email.com)
docker run -it --rm \
  -v $(pwd)/certbot/www:/var/www/certbot \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d votre-domaine.com \
  --email votre@email.com \
  --agree-tos \
  --no-eff-email

# Redémarrer Nginx avec SSL
docker compose -f docker-compose.dmz.yml restart nginx
```

### 2.6. Lancement de l'application

```bash
# Lancer tous les services
docker compose -f docker-compose.dmz.yml up -d --build

# Vérifier que tout tourne
docker ps
```

Vous devriez voir 4 conteneurs :
- `crosstalk-nginx`
- `crosstalk-frontend`
- `crosstalk-api`
- `crosstalk-certbot`

### 2.7. Tester la connexion à la database

```bash
# Depuis VM1, tester l'accès à VM2
docker exec -it crosstalk-api sh
npx prisma db push
# Si succès → la base est accessible !
exit
```

---

## Partie 3 : Vérifications

### 3.1. Depuis votre navigateur

1. **Accédez à** `https://votre-domaine.com`
   - ✅ Le site doit charger en HTTPS (cadenas vert)
   - ✅ Le Frontend s'affiche

2. **Testez l'API** : Ouvrez la console navigateur (F12) et faites :
   ```javascript
   fetch('/api/health').then(r => r.text()).then(console.log)
   ```
   - ✅ Devrait retourner une réponse du backend

### 3.2. Depuis VM1 (SSH)

```bash
# Logs des conteneurs
docker compose -f docker-compose.dmz.yml logs -f

# Vérifier Nginx
docker exec crosstalk-nginx nginx -t

# Tester la DB depuis l'API
docker exec -it crosstalk-api sh
psql $DATABASE_URL -c "SELECT version();"
```

---

## Partie 4 : Maintenance

### Renouvellement SSL automatique

Le conteneur `certbot` renouvelle automatiquement les certificats tous les 12h. Vérifiez son bon fonctionnement :

```bash
docker logs crosstalk-certbot
```

### Backup de la base de données

Connectez-vous à **VM2** et configurez un cron (voir `VM2_DATABASE_SETUP.md` section 6.2).

### Mise à jour du code

```bash
# Sur VM1
cd CrossTalk
git pull
docker compose -f docker-compose.dmz.yml up -d --build
```

---

## Troubleshooting

### Erreur : "Connection to database failed"
- Vérifiez le `DATABASE_URL` dans `.env.production`
- Testez la connexion depuis VM1 : `psql -h <VM2_IP> -U crosstalk -d crosstalk`
- Vérifiez le pare-feu VM2 : `sudo ufw status`

### Erreur : "SSL certificate not found"
- Vérifiez que Certbot a bien généré les certificats : `ls certbot/conf/live/`
- Relancez la génération de certificat (section 2.5)

### Site inaccessible
- Vérifiez que le DNS pointe bien vers l'IP publique de VM1
- Testez `curl http://VM1_IP` depuis un autre serveur
- Vérifiez les logs Nginx : `docker logs crosstalk-nginx`

---

## Récapitulatif : Commandes essentielles

**Lancer l'application :**
```bash
docker compose -f docker-compose.dmz.yml up -d
```

**Arrêter l'application :**
```bash
docker compose -f docker-compose.dmz.yml down
```

**Voir les logs :**
```bash
docker compose -f docker-compose.dmz.yml logs -f
```

**Rebuild après modification code :**
```bash
docker compose -f docker-compose.dmz.yml up -d --build
```
