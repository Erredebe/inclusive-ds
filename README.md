# Inclusiv DS

Design system en Stencil con versionado por paquete para poder usar:

- Instalacion completa: `@inclusiv-ds/ui`
- Instalacion selectiva: `@inclusiv-ds/button`, `@inclusiv-ds/input`, etc.
- Tokens versionados de forma independiente: `@inclusiv-ds/tokens`

## Versionado de componentes (v1 y v2)

- Tag publico estable: `iv-button` y `iv-input`
- Diferenciacion temporal por `version="v1" | "v2"` para migraciones
- Publicacion final por paquete con SemVer (ejemplo: `@inclusiv-ds/button@2` y `@inclusiv-ds/input@1`)

Ejemplo:

```html
<iv-button version="v1" variant="primary">Guardar</iv-button>
<iv-button version="v2" appearance="danger" size="lg">Eliminar</iv-button>

<iv-input version="v1" placeholder="Email"></iv-input>
<iv-input version="v2" label="Email" helper-text="Obligatorio"></iv-input>
```

## Stack

- Stencil
- Storybook
- Turborepo
- Changesets
- Vitest + Playwright
- ESLint + Prettier + Husky

## Scripts principales

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm test`
- `pnpm storybook`
- `pnpm build:storybook`

## Publicar Storybook en Netlify

Este repo incluye `netlify.toml` con:

- build command: `corepack enable && pnpm install --frozen-lockfile && pnpm build:storybook`
- publish dir: `apps/storybook/storybook-static`
- Node: `20`
