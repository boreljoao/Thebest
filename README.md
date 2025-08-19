# Execução com Docker

## Desenvolvimento
1. Copie `.env.example` para `.env` e ajuste as variáveis.
2. Suba os containers:
```bash
docker compose -f docker-compose.dev.yml up --build
```
3. Acompanhe os logs do backend:
```bash
docker compose -f docker-compose.dev.yml logs -f backend
```

## Produção
1. Defina `POSTGRES_PASSWORD`, `JWT_SECRET` e `COOKIE_SECRET` em um arquivo `.env`.
2. Execute:
```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Todo o ambiente de desenvolvimento e produção roda dentro de containers. Não é necessário executar `npm` localmente.
