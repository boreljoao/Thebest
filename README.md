# Thebest Monorepo

Este repositório contém um conjunto de projetos para uma loja online.

Estrutura de pastas:

- `backend/` – API Node.js com gerenciamento de estoque e pedidos
- `admin-frontend/` – painel administrativo protegido
- `store-frontend/` – site público da loja

## Como rodar localmente

1. Copie cada arquivo `.env.example` para `.env` dentro de suas respectivas pastas e preencha as variáveis.
2. Na pasta `backend/` instale as dependências e inicie o servidor:
   ```bash
   npm install
   npm start
   ```
3. Nos diretórios `admin-frontend/` e `store-frontend/` rode:
   ```bash
   npm install
   npm run dev
   ```

Configure o `ADMIN_TOKEN` no backend e utilize o mesmo valor em `NEXT_PUBLIC_ADMIN_TOKEN` no admin-frontend para ter acesso às rotas protegidas.

Os arquivos `.env` nunca devem ser versionados. Utilize sempre os exemplos para criar as configurações locais.
