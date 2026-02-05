# Guide de Déploiement Production (Traefik "Zero Config")

Ce guide explique comment déployer CrossTalk avec **Traefik**.
C'est la méthode la plus moderne : tout est géré par Docker. Traefik détecte automatiquement l'application, génère les certificats SSL et gère le routage.

Rien à installer sur le serveur à part Docker !

## 1. Préparation du Serveur (VM Debian ou Physique)

Sur votre VM Debian toute neuve :

```bash
# 1. Installer Docker et Git
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-v2 git

# 2. Démarrer Docker
sudo systemctl enable docker --now

# 3. Autoriser les ports (Pare-feu)
sudo apt install ufw
sudo ufw default deny incoming
sudo ufw allow ssh             # Port 22
sudo ufw allow 80/tcp          # Port HTTP (Requis par Traefik)
sudo ufw allow 443/tcp         # Port HTTPS (Requis par Traefik)
sudo ufw enable
```

## 2. Installation de l'Application

```bash
# 1. Récupérer le code
git clone <votre-repo> crosstalk
cd crosstalk

# 2. Configurer les variables (Indispensable !)
cp .env.production.example .env.production
nano .env.production
```

> [!IMPORTANT]
> Dans `.env.production`, vous **DEVEZ** remplir :
> - `DOMAIN_NAME` : Votre domaine (ex: `crosstalk.be`) pointant vers l'IP du serveur.
> - `ACME_EMAIL` : Votre email (pour que Let's Encrypt puisse générer le SSL).

## 2b. Configuration DNS (Chez votre hébergeur de nom de domaine)
Assurez-vous d'avoir créé un enregistrement **A** qui pointe `crosstalk.be` vers l'IP publique de votre serveur.
Sans cela, Traefik ne pourra pas générer le certificat SSL.

## 3. Préparation SSL (Traefik)

Créez le dossier pour les certificats avec les bonnes permissions :
```bash
mkdir letsencrypt
touch letsencrypt/acme.json
chmod 600 letsencrypt/acme.json
```

## 4. Lancement

```bash
# Lancer les conteneurs (Traefik, Frontend, Backend, DB)
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
```

Et ... c'est tout ! 🎉

1.  Traefik va démarrer.
2.  Il va demander un certificat SSL pour votre domaine.
3.  En quelques secondes, votre site sera accessible en `https://votre-domaine.com`.
