# Ecommerce Medusa

Front-end built with Next.js connecting to a Medusa backend.

## Execução

Use o Docker Compose da raiz do projeto para iniciar apenas o frontend ou todo o stack:

```bash
docker compose -f ../docker-compose.dev.yml up frontend
```

Copie `.env.example` para `.env` caso precise ajustar `NEXT_PUBLIC_MEDUSA_BACKEND_URL`.
