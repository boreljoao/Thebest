# Thebest Monorepo

Este repositório contém um conjunto de projetos para uma loja online.

Estrutura de pastas:

- `backend/` – API e lógica de estoque utilizando MedusaJS
- `admin-frontend/` – painel administrativo da empresa
- `store-frontend/` – site público da loja

## Como rodar localmente

1. Copie cada arquivo `.env.example` para `.env` dentro de suas respectivas pastas e preencha as variáveis.
2. Na pasta `backend/` instale as dependências e inicie o Medusa:
   ```bash
   npm install
   npm run dev
   ```
3. Nos diretórios `admin-frontend/` e `store-frontend/` rode:
   ```bash
   npm install
   npm run dev
   ```

Os arquivos `.env` nunca devem ser versionados. Utilize sempre os exemplos para criar as configurações locais.
