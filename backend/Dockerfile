FROM node:20-alpine

# Installer OpenSSL pour Prisma
RUN apk add --no-cache openssl libc6-compat

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm install

# Copier le reste du code
COPY . .

# Générer le client Prisma
RUN npx prisma generate

# Exposer le port
EXPOSE 4000

# Commande de démarrage
CMD ["npm", "run", "dev"]
