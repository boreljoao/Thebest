# Ecommerce Medusa

Front-end built with Next.js connecting to a Medusa backend.

## Setup

1. Copy `.env.example` to `.env` and adjust the `NEXT_PUBLIC_MEDUSA_BACKEND_URL` to point to your Medusa server.
2. Run `npm install` and `npm run dev` to start the development server.

## Features

- Storefront listing products from the Medusa API.
- Product page with basic details.
- Admin section with pages for viewing stock (`/admin/estoque`) and orders (`/admin/pedidos`).

The backend is provided in `backend-medusa` with the default Medusa setup.
