# Aprende Inglés — Inglés desde cero

Plataforma web para aprender inglés desde cero: abecedario con audio, números, vocabulario por temas, verbo *to be* y quiz de práctica con progreso guardado en el navegador.

**Autores:** Nicolás García, Juan Clazada, JUan Martinez

## Frontend (app principal)

```bash
pnpm install
pnpm --filter @workspace/ingles-desde-cero run dev
```

Abre la URL que muestre Vite (por defecto suele ser `http://localhost:5173`).

```bash
pnpm --filter @workspace/ingles-desde-cero run build
```

## Monorepo

- `artifacts/ingles-desde-cero` — UI de aprendizaje (React + Vite + Tailwind)
- `artifacts/api-server` — API Express (opcional para integraciones futuras)
- `lib/*` — cliente API, esquemas Zod, Drizzle

Comandos útiles en la raíz:

- `pnpm run typecheck` — revisión de tipos en todo el workspace
- `pnpm run build` — build de paquetes que lo definan

## Stack

React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, Framer Motion, wouter.
