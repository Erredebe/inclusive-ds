# AGENTS Guide - Inclusiv DS

## Contexto

- Monorepo con `pnpm` + `turbo`
- Componentes Stencil en `packages/`
- Documentacion en Storybook (`apps/storybook`)
- Playground unificado (`apps/stencil-playground`)
- Versionado con Changesets
- Deploy docs en Netlify

## Reglas para agentes

- Hacer cambios pequenos y enfocados.
- No introducir refactors ajenos a la tarea.
- Si cambia API/UI, actualizar tests + stories + docs en el mismo cambio.
- No commitear artefactos generados (`packages/*/.stencil`, `packages/*/www`, `storybook-static`).

## Flujo recomendado

1. Implementar cambio en componente/documentacion.
2. Actualizar tests y stories.
3. Validar localmente:
   - `pnpm lint`
   - `pnpm test`
   - `pnpm build:storybook`

## Estrategia de versionado

- Versionado por paquete (`@inclusiv-ds/button`, `@inclusiv-ds/input`, `@inclusiv-ds/tokens`).
- Permitir mezclas por consumidor (ej: `button@2` con `input@1`).
- Para migraciones internas, usar `version="v1|v2"` temporalmente en el mismo tag y consolidar en major.

## Comandos canonicos

- Instalar: `pnpm install`
- Lint: `pnpm lint`
- Test: `pnpm test`
- Storybook: `pnpm storybook`
- Build Storybook: `pnpm build:storybook`
- Playground Stencil: `pnpm run start stencil`

## Convenciones

- TypeScript estricto.
- Tags con prefijo `iv-`.
- CSS encapsulado por componente y tokens reutilizables.
- Conventional Commits: `feat|fix|refactor|docs|test|chore`.

## Netlify

- Build command: `corepack enable && pnpm install --frozen-lockfile && pnpm build:storybook`
- Publish dir: `apps/storybook/storybook-static`
- Node: `20`
