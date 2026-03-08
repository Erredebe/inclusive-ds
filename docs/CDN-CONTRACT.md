# Contrato público de CDN — Inclusiv DS

Este documento define los entrypoints públicos y soportados para consumo vía CDN (jsDelivr, unpkg, esm.sh).

## Rutas públicas por paquete

### @inclusiv-ds/button

| Path público | Uso | Notas |
|---------------|-----|-------|
| `https://esm.sh/@inclusiv-ds/button@<version>/components/iv-button` | Import de defineCustomElement | Entry point recomendado |
| `https://cdn.jsdelivr.net/npm/@inclusiv-ds/button@<version>/components/iv-button.js` | CDN jsDelivr (primario) | |
| `https://unpkg.com/@inclusiv-ds/button@<version>/components/iv-button.js` | Fallback unpkg | |

### @inclusiv-ds/input

| Path público | Uso | Notas |
|---------------|-----|-------|
| `https://esm.sh/@inclusiv-ds/input@<version>/components/iv-input` | Import de defineCustomElement | Entry point recomendado |
| `https://cdn.jsdelivr.net/npm/@inclusiv-ds/input@<version>/components/iv-input.js` | CDN jsDelivr (primario) | |
| `https://unpkg.com/@inclusiv-ds/input@<version>/components/iv-input.js` | Fallback unpkg | |

### @inclusiv-ds/tokens

| Path público | Uso | Notas |
|---------------|-----|-------|
| `https://esm.sh/@inclusiv-ds/tokens@<version>/src/tokens.css` | CSS tokens | Import en `<link>` |
| `https://cdn.jsdelivr.net/npm/@inclusiv-ds/tokens@<version>/src/tokens.css` | jsDelivr | |
| `https://unpkg.com/@inclusiv-ds/tokens@<version>/src/tokens.css` | Fallback | |

## Política de versionado

- **Desarrollo**: usar `@major` (ej. `@2`) para obtener última minor/patch.
- **Producción**: usar versión exacta (ej. `@2.1.3`) para evitar breaking changes inesperados.
- **No usar** `@latest` en producción — no da garantías de estabilidad.

## Ejemplo de uso

### Solo button (v2)

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@inclusiv-ds/tokens@0.1.0/src/tokens.css">
  </head>
  <body>
    <iv-button version="v2" appearance="solid">Click me</iv-button>

    <script type="module">
      import { defineCustomElement as defineIvButton } from "https://cdn.jsdelivr.net/npm/@inclusiv-ds/button@0.1.0/components/iv-button.js";
      if (!customElements.get("iv-button")) defineIvButton();
    </script>
  </body>
</html>
```

### Mezcla de versiones (button@2 + input@1)

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@inclusiv-ds/tokens@0.1.0/src/tokens.css">
  </head>
  <body>
    <iv-button version="v2" appearance="solid">Guardar</iv-button>
    <iv-input version="v1" placeholder="Email"></iv-input>

    <script type="module">
      import { defineCustomElement as defineIvButton } from "https://cdn.jsdelivr.net/npm/@inclusiv-ds/button@0.1.0/components/iv-button.js";
      import { defineCustomElement as defineIvInput } from "https://cdn.jsdelivr.net/npm/@inclusiv-ds/input@0.1.0/components/iv-input.js";

      if (!customElements.get("iv-button")) defineIvButton();
      if (!customElements.get("iv-input")) defineIvInput();
    </script>
  </body>
</html>
```

## Importante: Limitación de Custom Elements

**No es posible registrar dos versiones del mismo tag** (`iv-button` v1 y v2) en la misma página. El segundo `customElements.define()` sobrescribirá el primero.

Si necesitas cambiar de versión:
1. Usa la versión que necesites en producción.
2. Migra gradualmente: actualiza tu código a v2 y luego actualiza el paquete.

## Rutas no soportadas

Las siguientes rutas **no son públicas** y pueden cambiar sin aviso:

- Cualquier path que comece con `./dist/index.js` (entry interno de Stencil)
- `./dist/loader/*` (loader de componentes)
- `./dist/collection/*` (manifiesto de colección)

Solo usar los paths documentados en este documento.
