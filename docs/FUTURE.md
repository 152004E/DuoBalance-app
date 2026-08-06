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

### In-App Notifications

Feed global dentro de la app para solicitudes de pago pendientes, badges de confirmaciones, y eventualmente reemplazar por push notifications reales.

- Centro de notificaciones (icono de campana en header) que agrupa:
  - Solicitudes de pago recibidas (PENDING donde soy receptor)
  - Confirmaciones/rechazos de pagos que envié
  - Alertas de liquidaciones completadas
- Badge con contador de no leídas
- Al tocar una notificación → navega al grupo correspondiente y abre Liquidaciones sheet en tab "Por confirmar"
- Cuando haya push notifications reales → este feed sirve de fallback/historial

### Super Admin

Panel de analítica global para administradores de la plataforma (no dueños de grupo).

- Vista de métricas agregadas:
  - Total de usuarios registrados
  - Total de grupos/parejas activos
  - Total de gastos registrados
  - Volumen total de pagos/liquidaciones
  - Grupos más activos / usuarios más activos
- Filtros por rango de fechas
- No permite modificar datos — solo lectura/analítica
- Acceso restringido a cuentas con rol `SUPER_ADMIN` (nuevo campo en User o tabla aparte)

---

## Group Type Conversion
