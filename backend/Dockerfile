FROM node:20-alpine AS base
WORKDIR /app

COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable && corepack prepare pnpm@latest --activate && pnpm i; \
  elif [ -f yarn.lock ]; then yarn install; \
  else npm ci; fi

COPY . .
EXPOSE 9000
CMD [ "npm", "run", "start" ]
