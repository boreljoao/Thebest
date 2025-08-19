# ---------- base ----------
FROM node:20-alpine AS base
WORKDIR /app

# ---------- dev ----------
FROM base AS dev
ENV NODE_ENV=development
# Instala deps e mantém cache de layers
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable && corepack prepare pnpm@latest --activate && pnpm i; \
  elif [ -f yarn.lock ]; then yarn install; \
  else npm ci; fi
COPY . .
EXPOSE 3000
CMD [ "npm", "run", "dev" ]

# ---------- build ----------
FROM base AS build
ENV NODE_ENV=production
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable && corepack prepare pnpm@latest --activate && pnpm i --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  else npm ci --omit=dev; fi
COPY . .
RUN npm run build

# ---------- prod ----------
FROM node:20-alpine AS prod
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/package.json ./
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
# apenas deps necessárias para runtime
COPY package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable && corepack prepare pnpm@latest --activate && pnpm i --prod --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn install --production --frozen-lockfile; \
  else npm ci --omit=dev; fi
EXPOSE 3000
CMD [ "npm", "run", "start" ]
