# CLAUDE.md — tecnologia-westminster.github.io

**Cuenta GitHub activa requerida:** `tecnologia-westminster`

Antes de cualquier operación git o gh CLI, cambiar la cuenta activa:

```bash
gh auth switch --user tecnologia-westminster
```

## Contexto

Portal institucional del Colegio Westminster. Documentación y decisiones en el vault S5:
`colegio-westminster/tecnologia-westminster/` → `nicolasTrotvil/s5-vault`

## Archivos

- `index.html` — portal: Inicio · Infraestructura / IT (Solicitudes · Usuario nuevo · Planificación) · Institucional · Alfabetización digital
- `digital-hitos.js` — datos de los hitos 2026 (fuente: `hitos-it-2026.md` en el vault)
- `westminster-identidad.css` — fuente única de identidad visual Westminster

## Identidad visual

Ver `_base/manual-identidad-westminster.md` en el vault S5 para tokens de color, tipografía y componentes.

## Reglas

- Responder siempre en español
- HTML minimalista: sin emojis, sin cards con íconos; solo tablas, recuadros simples y tabs
- Al terminar la sesión, hacer push a `tecnologia-westminster` y registrar la acción en `decisiones.md` del vault
