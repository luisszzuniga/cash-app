#!/bin/sh
set -e

# Installer les dépendances si nécessaire
npm install

echo "[Entrypoint] Mode développement : hot reload Nuxt"
echo "[Entrypoint] Démarrage sur http://0.0.0.0:3000"

# Démarrer Nuxt en mode développement avec hot reload
exec npm run dev -- --host 0.0.0.0 --port 3000