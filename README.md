# Inclusiv DS

Design system de componentes web accesibles y reutilizables, construido con Stencil y versionado por paquete para consumo flexible.

## Enlaces

- **Playground**: [https://inclusiv-ds.netlify.app/](https://inclusiv-ds.netlify.app/)
- **Storybook**: [https://inclusiv-ds.netlify.app/storybook](https://inclusiv-ds.netlify.app/storybook)
- **Repositorio**: [https://github.com/Erredebe/inclusive-ds](https://github.com/Erredebe/inclusive-ds)

---

## Qué es Inclusiv DS

Inclusiv DS es un design system basado en Web Components generado con Stencil. Su objetivo principal es proporcionar componentes de interfaz accesibles, mantenibles y fáciles de integrar en cualquier proyecto frontend.

El sistema permite dos modos de instalación:

- **Instalación completa**: `@inclusiv-ds/ui` (agrega todos los componentes y tokens)
- **Instalación selectiva**: `@inclusiv-ds/button`, `@inclusiv-ds/input`, `@inclusiv-ds/tokens` (por componente)

Esta flexibilidad permite adoptar el design system de forma gradual sin instalar dependencias innecesarias.

---

## Componentes disponibles

| Paquete | Descripción |
|---------|-------------|
| `@inclusiv-ds/button` | Componente `iv-button` con versiones v1 y v2 |
| `@inclusiv-ds/input` | Componente `iv-input` con versiones v1 y v2 |
| `@inclusiv-ds/tokens` | Tokens de diseño (colores, spacing, radii) |
| `@inclusiv-ds/ui` | Paquete agregador con todos los componentes |
| `@inclusiv-ds/react` | Wrapper React |
| `@inclusiv-ds/vue` | Wrapper Vue |
| `@inclusiv-ds/angular` | Wrapper Angular |

### Ejemplo de uso

```html
<iv-button version="v1" variant="primary">Guardar</iv-button>
<iv-button version="v2" appearance="danger" size="lg">Eliminar</iv-button>

<iv-input version="v1" placeholder="Email"></iv-input>
<iv-input version="v2" label="Correo" placeholder="tu@email.com" helper-text="Obligatorio"></iv-input>
```

---

## Arquitectura del monorepo

```
inclusiv-ds/
├── apps/
│   ├── stencil-playground/   # Demo local/playground con Vite
│   └── storybook/            # Documentación interactiva
├── packages/
│   ├── button/               # Web component iv-button (Stencil)
│   ├── input/                # Web component iv-input (Stencil)
│   ├── tokens/              # Tokens de diseño (TS + CSS)
│   ├── ui/                   # Paquete agregador
│   ├── react/                # Wrapper React
│   ├── vue/                  # Wrapper Vue
│   └── angular/              # Wrapper Angular
├── scripts/
│   ├── build-netlify.mjs    # Build combinado para Netlify
│   └── start.mjs            # Script de inicio (stencil/storybook)
├── .changeset/              # Configuración de versionado
├── turbo.json               # Configuración de Turbo
└── pnpm-workspace.yaml     # Workspaces pnpm
```

### Stack tecnológico

- **Stencil**: generación de Web Components
- **Storybook**: documentación y desarrollo de componentes
- **Vite**: bundler del playground y builds de frameworks
- **Turbo**: orchestración de builds en monorepo
- **Changesets**: versionado y publicación de paquetes
- **Vitest + Playwright**: testing unitario y e2e
- **ESLint + Prettier + Husky**: calidad de código y git hooks

---

## Inicio rápido

### Requisitos

- Node.js >= 18
- pnpm >= 9

### Instalación

```bash
pnpm install
```

### Comandos disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Inicia todos los paquetes en modo desarrollo (parallel) |
| `pnpm start` | Inicia el servidor por defecto (Storybook) |
| `pnpm run start stencil` | Inicia el playground Stencil |
| `pnpm run start storybook` | Inicia Storybook en desarrollo |
| `pnpm build` | Build de todos los paquetes |
| `pnpm lint` | Lint de todo el proyecto |
| `pnpm test` | Ejecuta tests unitarios |
| `pnpm test:e2e` | Ejecuta tests e2e de Storybook |
| `pnpm storybook` | Inicia Storybook en desarrollo |
| `pnpm build:storybook` | Build de Storybook para producción |
| `pnpm build:netlify` | Build completo para despliegue en Netlify |

---

## Estrategia de versionado

Inclusiv DS utiliza un sistema de versionado por paquete que permite una adopción gradual y controladas.

### Versionado por paquete

Cada paquete (`button`, `input`, `tokens`) tiene su propia versión semántica. Esto permite:

- Consumir `@inclusiv-ds/button@2` con `@inclusiv-ds/input@1` en el mismo proyecto
- Actualizar componentes de forma independiente
- Migrar gradualmente entre versiones mayores

### Convivencia v1 / v2 en el mismo tag

Durante el período de migración, los componentes mantienen el mismo tag HTML (`iv-button`, `iv-input`) pero soportan dos contratos visuales mediante el atributo `version`:

```html
<iv-button version="v1" variant="primary">V1</iv-button>
<iv-button version="v2" appearance="solid">V2</iv-button>
```

Una vez que v2 es estable, se publica como **major** del paquete y se elimina v1 internamente.

### Publicación

Las releases se gestionan con Changesets. Para publicar:

```bash
pnpm changeset
pnpm version:packages
pnpm release
```

---

## Contribución

### Flujo de trabajo

1. **Crea una rama** para tu cambio (`feat/nombre`, `fix/descripcion`).
2. **Implementa** el cambio en el paquete correspondiente.
3. **Actualiza tests y stories** si modificas la API o el aspecto visual.
4. **Valida localmente**:
   ```bash
   pnpm lint
   pnpm test
   pnpm build:storybook
   ```
5. **Crea un changeset** si el cambio debe publicarse:
   ```bash
   pnpm changeset
   ```
6. **Abre un PR** con los cambios.

### Estándares de código

- TypeScript estricto
- Tags con prefijo `iv-` (iv-button, iv-input)
- CSS encapsulado por componente con tokens reutilizables
- Conventional Commits: `feat|fix|refactor|docs|test|chore`

### Hooks pre-commit

El proyecto incluye Husky con:

- `pnpm lint` — validación de código
- `pnpm test` — ejecución de tests

Ambos se ejecutan automáticamente antes de cada commit.

### Archivos generados (no versionar)

Los siguientes directorios y archivos están excluidos de git y no deben incluirse en commits:

- `dist/`
- `node_modules/`
- `coverage/`
- `storybook-static/`
- `netlify-dist/`
- `packages/*/.stencil/`
- `packages/*/www/`
- `.turbo/`
- `playwright-report/`
- `test-results/`

---

## Despliegue

### Netlify

El proyecto está configurado para desplegarse automáticamente en Netlify:

- **Build command**: `corepack enable && pnpm install --frozen-lockfile && pnpm build:netlify`
- **Publish directory**: `netlify-dist`
- **Node version**: 20

### Rutas publicadas

- `/` — Playground con demos de componentes
- `/storybook` — Documentación Storybook

El script `pnpm build:netlify` genera ambos conteni

---

## Troubleshooting

### Los componentes no se renderizan en Storybook

Asegúrate de haber hecho build de los componentes Stencil antes de iniciar Storybook:

```bash
pnpm build
pnpm storybook
```

### Error al importar tokens en Storybook

Los tokens CSS deben estar importados en `.storybook/preview.ts`. Verifica que la línea siguiente exista:

```ts
import '@inclusiv-ds/tokens/src/tokens.css';
```

### Playwright no encuentra Storybook

El test e2e espera que Storybook esté disponible en `http://localhost:6006`. Asegúrate de que el puerto no esté ocupado o de que el servidor esté corriendo.

### Errores de TypeScript en paquetes

Los paquetes Stencil usan su propia compilación. Si ves errores de tipos, ejecuta `pnpm build` desde el paquete afectado:

```bash
pnpm --filter @inclusiv-ds/button build
```

---

## Licencia

MIT
