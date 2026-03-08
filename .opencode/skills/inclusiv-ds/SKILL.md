---
name: inclusiv-ds
description: Contribution guide for inclusiv-ds monorepo (Stencil design system)
---

# SKILL.md — Inclusiv DS

## Objetivo de este skill
Guía operativa para contribuir al monorepo de design system `inclusiv-ds` con cambios pequeños, seguros y publicables por paquete.

## Contexto del proyecto
- Monorepo con `pnpm` + `turbo`.
- Componentes base en Stencil: `@inclusiv-ds/button`, `@inclusiv-ds/input`.
- Tokens de diseño en `@inclusiv-ds/tokens`.
- Paquete agregador: `@inclusiv-ds/ui`.
- Wrappers/bridges: `@inclusiv-ds/react`, `@inclusiv-ds/vue`, `@inclusiv-ds/angular`.
- Documentación y demos:
  - Storybook: `apps/storybook`
  - Playground: `apps/stencil-playground`
- Versionado y releases con Changesets.

## Estructura clave
- `packages/button`: web component `iv-button` (Stencil)
- `packages/input`: web component `iv-input` (Stencil)
- `packages/tokens`: tokens TS + CSS (`src/tokens.css`)
- `packages/ui`: exports agregados
- `apps/storybook`: historias y smoke e2e
- `apps/stencil-playground`: demo manual local
- `scripts/build-netlify.mjs`: build combinado para Netlify
- `.changeset/config.json`: estrategia de versionado

## Principios de contribución
- Cambios pequeños y enfocados, sin refactors ajenos.
- Si cambia API/UI de un componente:
  - actualizar spec del componente
  - actualizar stories en Storybook
  - actualizar docs/ejemplos necesarios
- Mantener tags con prefijo `iv-`.
- Mantener TypeScript estricto y estilos consistentes.
- No commitear artefactos generados (`dist`, `storybook-static`, `.stencil`, `netlify-dist`).

## Flujo de trabajo recomendado
1. Implementar cambio en paquete objetivo.
2. Ajustar tests y stories relacionadas.
3. Validar localmente:
   - `pnpm lint`
   - `pnpm test`
   - `pnpm build:storybook`
4. Si aplica release: crear changeset.

## Comandos canónicos (root)
- Instalar: `pnpm install`
- Desarrollo monorepo: `pnpm dev`
- Lint: `pnpm lint`
- Tests: `pnpm test`
- E2E Storybook: `pnpm test:e2e`
- Storybook: `pnpm storybook`
- Build Storybook: `pnpm build:storybook`
- Build general: `pnpm build`
- Inicio guiado:
  - `pnpm start` (storybook por defecto)
  - `pnpm run start stencil`
  - `pnpm run start storybook`

## Reglas por tipo de cambio
### 1) Cambio en componente Stencil (`button`/`input`)
- Tocar solo archivos del componente y su estilo/spec.
- Verificar compatibilidad de `version="v1|v2"` cuando aplique.
- Mantener naming y API consistentes (`variant`, `appearance`, `size`, etc).

### 2) Cambio en tokens
- Actualizar `packages/tokens/src/index.ts` y/o `packages/tokens/src/tokens.css`.
- Agregar/actualizar tests en `packages/tokens/src/tokens.test.ts`.
- Revisar impacto visual en Storybook/Playground.

### 3) Cambio en documentación
- Actualizar stories en `apps/storybook/stories/*.stories.ts`.
- Mantener registro/definición de custom elements en `.storybook/preview.ts` si se agregan componentes nuevos.

### 4) Cambio en wrappers (`react/vue/angular/ui`)
- Evitar introducir lógica de UI del componente base aquí.
- Alinear tipos/exports con contratos de `button`, `input` y `tokens`.

## Estándares de calidad
- Lint obligatorio (hook pre-commit ejecuta `pnpm lint`).
- Tests obligatorios (hook pre-commit ejecuta `pnpm test`).
- Formato Prettier:
  - `singleQuote: true`
  - `semi: true`
  - `trailingComma: all`
  - `printWidth: 100`

## Versionado y publicación
- Usar Changesets para cambios publicables.
- Versionado por paquete (independiente).
- Para cambios de API en componentes, seguir SemVer por paquete.
- Base branch de changesets: `main`.

## Checklist de PR
- [ ] Alcance acotado al objetivo.
- [ ] Tests/specs actualizados.
- [ ] Stories/documentación actualizadas si hubo cambio visual/API.
- [ ] `pnpm lint` y `pnpm test` en verde.
- [ ] `pnpm build:storybook` en verde para cambios UI/docs.
- [ ] Changeset agregado si requiere release.

## Definición de "Done"
Un cambio está listo cuando:
1) cumple el comportamiento esperado,
2) mantiene coherencia de API y versionado,
3) pasa validaciones locales,
4) deja documentación/historias alineadas con la implementación.
