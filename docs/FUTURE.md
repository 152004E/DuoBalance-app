# Future Work — Beyond Current Plan

> Este archivo documenta ideas y features diferidos. Se revisa solo cuando todo lo del plan actual está completo.

## Group Type Conversion

Convertir un grupo de un tipo a otro (e.g., `COUPLE` → `GROUP`, `GROUP` → `COUPLE`, `PERSONAL` → `COUPLE`).

### Consideraciones

- Cambiar el `type` en la DB afecta cómo se calculan splits, cuántos miembros se permiten, y qué UI se muestra.
- Al convertir de `COUPLE` a `GROUP`: permitir agregar más miembros. Los splits existentes (50/50, porcentaje) deben migrar a N-way.
- Al convertir de `GROUP` a `COUPLE`: si hay > 2 miembros, hay que decidir qué pasa con los miembros extra (eliminarlos? dejarlos como invitados sin split?).
- Historial de gastos debe mantenerse intacto — el tipo de grupo al momento de crear el gasto ya quedó registrado en `splitType`.
- UX: debe ser una acción reversible o con confirmación fuerte (alert modal explicando consecuencias).

### Posible approach

1. Agregar endpoint `PATCH /groups/:id/convert` con body `{ type: 'COUPLE' | 'GROUP' }`
2. Backend valida:
   - `COUPLE` → `GROUP`: siempre permitido (abrir membresía)
   - `GROUP` → `COUPLE`: solo si tiene exactamente 2 miembros
   - `PERSONAL` → `COUPLE`: requiere invitar a un segundo miembro
3. Frontend: opción en configuración del grupo, dentro de "Zona de peligro" o sección de tipo
4. Mostrar preview de cambios antes de confirmar

---

## Other Future Ideas

*(Placeholder — agregar aquí cuando surjan)*
