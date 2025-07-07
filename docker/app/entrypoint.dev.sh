#!/bin/sh
set -e

npm install

echo "[Entrypoint] Mode développement : hot reload Nuxt"
exec npm run dev --host 0.0.0.0 --port 3000