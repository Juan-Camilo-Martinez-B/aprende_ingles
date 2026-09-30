# Aprende Inglés (Inglés desde cero)

App amigable para aprender inglés paso a paso: lecciones con audio, vocabulario por categorías y práctica con quiz. Progreso local en `localStorage`.

**Autor:** Nicolás

## Run & Operate

- `pnpm --filter @workspace/ingles-desde-cero run dev` — frontend de aprendizaje (Vite)
- `pnpm --filter @workspace/api-server run dev` — API (puerto 5000), si lo usas
- `pnpm run typecheck` — typecheck en todo el workspace
- `pnpm run build` — typecheck + build de paquetes
- `pnpm --filter @workspace/api-spec run codegen` — regenerar hooks OpenAPI / Zod
- `pnpm --filter @workspace/db run push` — push de schema DB (solo dev)
- Env opcional API: `DATABASE_URL` — Postgres

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React, Vite, Tailwind, Framer Motion
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validación: Zod (`zod/v4`), `drizzle-zod`
- Codegen: Orval (OpenAPI)

## Where things live

- UI principal: `artifacts/ingles-desde-cero/src/pages/home.tsx`
- Contenido de lecciones: `artifacts/ingles-desde-cero/src/data/content.ts`
- Estilos globales: `artifacts/ingles-desde-cero/src/index.css`
- OpenAPI: `lib/api-spec/openapi.yaml`
- Schema DB: `lib/db/src/schema/`

## Product

- Hero y ruta de 5 lecciones (abecedario, números, vocabulario, to be, práctica)
- Text-to-speech en tarjetas (Web Speech API)
- Quiz con puntuación máxima persistida
- Navegación con scroll spy y barra lateral de progreso (desktop)

## User preferences

- Nicolás prefiere iterar directo en código; mantener la UI clara, moderna y funcional.

## Pointers

- Ver skill `pnpm-workspace` para estructura del monorepo y paquetes.
