# Setup PostgreSQL - VM2 (Datacenter) avec Docker

Guide d'installation de PostgreSQL **via Docker** sur VM2.

## 1. Installation Docker sur VM2

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-v2 git
sudo systemctl enable docker --now
```

## 2. Récupération des fichiers

```bash
git clone https://github.com/toruke/CrossTalk.git
cd CrossTalk
```

## 3. Configuration

```bash
cp .env.db.example .env.db
nano .env.db
```

Éditez le mot de passe :
```bash
POSTGRES_PASSWORD=VOTRE_MOT_DE_PASSE_FORT
```

## 4. Lancement

```bash
docker compose -f docker-compose.db.yml --env-file .env.db up -d
docker ps  # Vérifier
```

## 5. Pare-feu

```bash
sudo apt install ufw
sudo ufw allow ssh
sudo ufw allow from <VM1_IP> to any port 5432
sudo ufw enable
```

## 6. Test depuis VM1

```bash
sudo apt install postgresql-client
psql -h <VM2_IP> -U crosstalk -d crosstalk
```

## 7. Configuration VM1

Dans `.env.production` sur VM1 :
```bash
DATABASE_URL="postgresql://crosstalk:VOTRE_MOT_DE_PASSE@<VM2_IP>:5432/crosstalk"
```

## Backups

```bash
# Manuel
docker exec -t crosstalk-db pg_dump -U crosstalk crosstalk > backup.sql

# Auto (cron)
echo '0 2 * * * docker exec -t crosstalk-db pg_dump -U crosstalk crosstalk > /var/backups/db_$(date +\%Y\%m\%d).sql' | sudo crontab -
```

## Commandes utiles

```bash
docker compose -f docker-compose.db.yml logs -f    # Logs
docker compose -f docker-compose.db.yml restart    # Redémarrer
docker exec -it crosstalk-db psql -U crosstalk -d crosstalk  # Shell SQL
```
