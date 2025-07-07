FROM node:24-alpine AS base
WORKDIR /app
COPY package.json package-lock.yaml* ./
COPY tailwind.config.js ./
RUN npm install
COPY . .

# --- Build (prod) ---
FROM base AS build
RUN npm run build

# --- Runtime (dev & prod) ---
FROM node:24-alpine AS runtime
WORKDIR /app
COPY --from=base /app /app
# Pour la prod, on copie le build
COPY --from=build /app/.output ./.output

# Un seul entrypoint, qui choisit le mode
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
CMD ["/entrypoint.sh"]