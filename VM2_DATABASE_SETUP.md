# Setup PostgreSQL - VM2 (Datacenter)

Ce guide explique comment installer et configurer PostgreSQL sur la **VM2 (Datacenter)** pour l'application CrossTalk.

## 1. Installation PostgreSQL

```bash
# Mise à jour du système
sudo apt update && sudo apt upgrade -y

# Installation PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Vérifier le statut
sudo systemctl status postgresql
```

## 2. Configuration PostgreSQL

### 2.1 Créer la base de données et l'utilisateur

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Dans le shell PostgreSQL:
CREATE DATABASE crosstalk;
CREATE USER crosstalk WITH ENCRYPTED PASSWORD 'CHANGEZ_MOI_PASSWORD_SECURISE';
GRANT ALL PRIVILEGES ON DATABASE crosstalk TO crosstalk;
\q
```

### 2.2 Configurer l'accès réseau

**Éditer** `/etc/postgresql/*/main/postgresql.conf` :
```bash
sudo nano /etc/postgresql/15/main/postgresql.conf
```

Modifier la ligne :
```conf
listen_addresses = '*'  # ou l'IP interne de VM2 (ex: 192.168.10.50)
```

**Éditer** `/etc/postgresql/*/main/pg_hba.conf` :
```bash
sudo nano /etc/postgresql/15/main/pg_hba.conf
```

Ajouter à la fin :
```conf
# Allow VM1 (DMZ) to connect
host    crosstalk       crosstalk       <VM1_IP>/32            scram-sha-256
# Exemple: host    crosstalk       crosstalk       192.168.10.100/32      scram-sha-256
```

### 2.3 Redémarrer PostgreSQL

```bash
sudo systemctl restart postgresql
```

## 3. Configuration Pare-feu

```bash
# Installer UFW si non présent
sudo apt install ufw

# Autoriser SSH (IMPORTANT !)
sudo ufw allow ssh

# Autoriser PostgreSQL UNIQUEMENT depuis VM1
sudo ufw allow from <VM1_IP> to any port 5432

# Activer le pare-feu
sudo ufw enable

# Vérifier les règles
sudo ufw status
```

## 4. Tester la connexion depuis VM1

Depuis la **VM1 (DMZ)**, testez la connexion :

```bash
# Installer le client PostgreSQL sur VM1
sudo apt install postgresql-client

# Tester la connexion
psql -h <VM2_IP> -U crosstalk -d crosstalk
# Entrer le mot de passe quand demandé

# Si succès, vous devriez voir:
# crosstalk=>
```

## 5. Configuration .env sur VM1

Sur la **VM1**, créez le fichier `.env.production` :

```bash
DATABASE_URL="postgresql://crosstalk:CHANGEZ_MOI_PASSWORD_SECURISE@<VM2_IP>:5432/crosstalk"
```

> [!IMPORTANT]
> Remplacez `<VM2_IP>` par l'adresse IP réelle de votre VM2 (ex: `192.168.10.50`)

## 6. Sécurité

### 6.1 Mot de passe fort
Générez un mot de passe sécurisé :
```bash
openssl rand -base64 32
```

### 6.2 Backups automatiques
Créez un script de backup /usr/local/bin/backup-crosstalk.sh` :
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U crosstalk crosstalk > /var/backups/crosstalk_$DATE.sql
find /var/backups -name "crosstalk_*.sql" -mtime +7 -delete
```

Ajoutez au cron :
```bash
sudo crontab -e
# Ajouter: 0 2 * * * /usr/local/bin/backup-crosstalk.sh
```

## Troubleshooting

### Erreur : "Connection refused"
- Vérifiez que PostgreSQL écoute sur l'IP : `sudo netstat -plnt | grep 5432`
- Vérifiez le pare-feu : `sudo ufw status`

### Erreur : "no pg_hba.conf entry"
- Vérifiez `/etc/postgresql/*/main/pg_hba.conf`
- Assurez-vous d'avoir redémarré PostgreSQL : `sudo systemctl restart postgresql`

### Erreur : "password authentication failed"
- Réinitialisez le mot de passe :
  ```sql
  ALTER USER crosstalk WITH PASSWORD 'nouveau_mot_de_passe';
  ```
