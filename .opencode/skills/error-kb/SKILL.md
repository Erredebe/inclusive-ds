---
name: error-kb
description: Memoria operativa de errores comunes y soluciones del repo
---

# SKILL.md — Error KB

## Objetivo

Mantener una memoria compartida de errores frecuentes para resolver mas rapido incidencias repetidas.

## Fuente de verdad

- Archivo KB: `docs/ERRORS-KB.md`

## Logica de uso (sin scripts)

### 1) Cuando consultar la KB

Consulta `docs/ERRORS-KB.md` antes de proponer diagnosticos largos en estos casos:

- fallo recurrente de tooling (`lint`, `test`, `build`, `storybook`)
- error de entorno (Windows/path/binarios)
- errores ya vistos en paquetes Stencil

### 2) Cuando guardar un error nuevo

Si aparece un error no documentado y se confirma la solucion:

1. Agregar una entrada nueva en `docs/ERRORS-KB.md`.
2. Usar la plantilla oficial del archivo.
3. Escribir causa raiz y prevencion en una linea clara cada una.
4. Incluir tags para busqueda rapida (ej: `stencil`, `storybook`, `windows`).

### 3) Formato obligatorio por entrada

Cada entrada debe incluir:

- `Contexto`
- `Error`
- `Causa raiz`
- `Solucion aplicada`
- `Prevencion`
- `Tags`

### 4) Criterio de calidad

- No guardar errores sin solucion verificada.
- No duplicar entradas: actualizar la existente si es el mismo caso.
- Mantener redaccion breve y accionable.

## Flujo recomendado para agentes

1. Leer KB al iniciar diagnostico.
2. Intentar solucion basada en KB.
3. Si funciona, continuar y dejar trazabilidad minima en respuesta.
4. Si no existe entrada y se resuelve, registrar nueva entrada en KB.
