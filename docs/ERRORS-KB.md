# Errores comunes y soluciones (KB)

Registro vivo de errores recurrentes detectados en este repo y su solucion.

## Plantilla

Usa este formato para nuevas entradas:

```md
## <titulo breve>

- **Contexto:** <comando, paquete o flujo>
- **Error:** <mensaje concreto>
- **Causa raiz:** <explicacion corta>
- **Solucion aplicada:** <pasos concretos>
- **Prevencion:** <que revisar antes para evitarlo>
- **Tags:** <ej: lint,windows,stencil,storybook>
```

## ESLint no reconocido en scripts de paquete

- **Contexto:** `pnpm --filter @inclusiv-ds/<pkg> lint`
- **Error:** `"eslint" no se reconoce como un comando interno o externo`
- **Causa raiz:** Resolucion del binario en entorno Windows no disponible en ese contexto.
- **Solucion aplicada:** Continuar validando con tests de paquetes y dejar constancia del fallo de entorno para no bloquear el avance funcional.
- **Prevencion:** Validar `pnpm lint` a nivel root y revisar instalacion/resolucion de binarios en CI/local.
- **Tags:** lint,windows,tooling
