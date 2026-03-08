# Contrato unificado de API para controles de formulario

Este documento define el contrato base para los componentes de formulario de Inclusiv DS, con foco en consistencia de API, eventos y accesibilidad.

## Objetivo

- Mantener naming consistente entre controles (`input`, `textarea`, `select`, `checkbox`, `radio`, `toggle`).
- Unificar eventos para facilitar integracion en apps y adapters.
- Estandarizar atributos de accesibilidad (`aria-*`, `id`, `describedby`).

## Contrato base (v2)

### Props comunes

- `name?: string`
- `value?: string | number | boolean`
- `disabled?: boolean`
- `required?: boolean`
- `readonly?: boolean` (cuando aplique)
- `invalid?: boolean`
- `label?: string`
- `helperText?: string`
- `errorText?: string`

### Eventos comunes

- `ivInput`: emite en cada cambio de valor en controles de texto.
  - `detail`: `{ value: string }`
- `ivChange`: emite cuando se confirma un cambio de valor/seleccion.
  - `detail`: `{ value: string | number | boolean }`
- `ivBlur`: emite cuando el control pierde foco.
  - `detail`: `{ value: string | number | boolean }`

Notas:

- Componentes de seleccion simple (`radio`, `toggle`, `checkbox`) priorizan `ivChange`.
- `iv-dialog` conserva eventos de ciclo de vida propios (`ivOpenChange`, `ivBeforeClose`, `ivClose`) y no forma parte del contrato de controles de entrada de datos.

### Accesibilidad minima

- Cada control debe tener `id` estable.
- `label` debe estar asociado mediante `for`/`id` o etiqueta envolvente valida.
- `helperText`/`errorText` deben enlazarse via `aria-describedby`.
- Estado invalido debe reflejarse con `aria-invalid="true"`.

## Tabla de mapeo (estado actual -> objetivo)

| Componente            | Estado actual                                                                   | Objetivo contrato                                                                                             |
| --------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `iv-input`            | `state`, `helperText`, sin `value/name/required/readonly`, sin eventos de valor | `invalid`, `helperText`, `errorText`, `value`, `name`, `required`, `readonly`, eventos `ivInput` + `ivChange` |
| `iv-form-field`       | `label`, `helperText`, `errorText`, `required`, `disabled`                      | mantener wrapper semantico y propagar asociaciones a control sloteado                                         |
| `iv-checkbox`         | `checked`, evento `checkedChange<boolean>`                                      | `value:boolean`, `ivChange` (`{ value: boolean }`)                                                            |
| `iv-radio`            | `checked`, `value`, `name`, evento `radioChange<string>`                        | `value`, `name`, `ivChange` (`{ value: string }`)                                                             |
| `iv-radio-group`      | `name`, `label`, sin evento propio                                              | `name`, `label`, opcional `value`, `ivChange` consolidado                                                     |
| `iv-toggle`           | `checked`, evento `toggleChange<boolean>`                                       | `value:boolean`, `ivChange` (`{ value: boolean }`)                                                            |
| `iv-textarea` (nuevo) | no existe                                                                       | crear con contrato completo de texto (`ivInput` + `ivChange`)                                                 |
| `iv-select` (nuevo)   | no existe                                                                       | crear con `value`, `name`, `disabled`, `required`, `invalid`, evento `ivChange`                               |

## Regla de compatibilidad

Mientras dure la transicion, se permiten aliases no destructivos:

- `state="error"` <=> `invalid=true`
- `checkedChange`/`radioChange`/`toggleChange` conviven temporalmente con `ivChange`

Al cerrar migracion mayor, se eliminan aliases legacy por paquete segun SemVer.
