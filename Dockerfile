# --- Base ---
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .

# --- Build (prod) ---
FROM base AS build
RUN pnpm run build

# --- Runtime (dev & prod) ---
FROM node:20-alpine AS runtime
WORKDIR /app
RUN npm install -g pnpm
COPY --from=base /app /app
# Pour la prod, on copie le build
COPY --from=build /app/.output ./.output

# Un seul entrypoint, qui choisit le mode
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
CMD ["/entrypoint.sh"] 