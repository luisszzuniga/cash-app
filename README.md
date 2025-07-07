# Nuxt Minimal Starter

## Docker (dev & prod)

### Développement local

```bash
# Lancer en mode développement (hot reload, montages de volumes)
docker-compose up --build
# Accès: http://localhost:3000
```

### Production (dokploy)

```bash
# Build et lancement en mode production (avec Nginx en reverse proxy)
docker-compose -f docker-compose.dokploy.yml up --build
# Accès: http://localhost
```

- Le même Dockerfile est utilisé pour les deux contextes.
- Un seul entrypoint (`docker/entrypoint.sh`) gère dev/prod selon la variable d'environnement `NODE_ENV`.
- Nginx n'est utilisé qu'en production (dokploy).

---

## Setup classique (hors Docker)

Installez les dépendances :

```bash
pnpm install
```

### Dev local

```bash
pnpm run dev
```

### Build prod

```bash
pnpm run build
```

### Preview prod

```bash
pnpm run preview
```

---

Pour plus d'infos, voir la [doc Nuxt](https://nuxt.com/docs/getting-started/introduction).
