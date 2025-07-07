# ----------------------------
# 🏗️ STAGE 1 : Build
# ----------------------------

FROM node:24-alpine AS build
WORKDIR /app

# Active corepack (pnpm / yarn support)
RUN corepack enable

# Copie uniquement les fichiers nécessaires pour installer
COPY ./package*.json ./
COPY ./prisma ./prisma

# Installation
RUN npm install

# Copie tout le projet
COPY ./ .

# Build Nuxt en mode node-server
RUN npm run build

# ----------------------------
# 🚀 STAGE 2 : Runtime
# ----------------------------
FROM node:24-alpine AS production
WORKDIR /app

# Copie uniquement ce qui est nécessaire à l'exécution
COPY --from=build /app/.output ./.output
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/prisma ./prisma

# Port exposé par Nuxt
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
