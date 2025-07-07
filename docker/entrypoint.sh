#!/bin/sh
set -e

if [ "$NODE_ENV" = "development" ]; then
  echo "[Entrypoint] Mode développement : hot reload Nuxt"
  exec npm run dev --host 0.0.0.0 --port 3000
else
  echo "[Entrypoint] Mode production : lancement du build Nuxt"
  exec node .output/server/index.mjs
fi 