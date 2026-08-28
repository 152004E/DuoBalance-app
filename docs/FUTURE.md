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

## Dual Balance Tracking (Mes Actual + Total Histórico) con Corte Configurable

### Problema
Hoy el balance es un solo número agregado. Con abonos parciales es difícil ver:
- Qué se debe **este período** (gastos desde último corte - pagos desde último corte)
- Qué se debe **en total** (histórico acumulado)

El usuario necesita trazabilidad: ver primero la deuda del período actual, y debajo la total.

### Solución: Dual Balance con Corte Mensual Configurable (1–28)

#### Modelo de datos
```prisma
model Group {
  // ... campos existentes
  balanceCutoffDay Int @default(1)  // 1-28 (evita problemas feb/30-31)
}

model User {
  // ... campos existentes
  balanceCutoffDay Int? @default(1)  // override personal si no hay grupo
}
```
- Rango válido: **1–28** (día 29/30/31 no existe en todos los meses)
- Si el usuario está en múltiples grupos con distintos cortes → cada grupo usa su propio corte
- Fallback: `User.balanceCutoffDay` → `Group.balanceCutoffDay` → default `1`

#### Backend
1. **Nuevo endpoint** `PATCH /groups/:id/cutoff` `{ cutoffDay: number }` (validación 1-28)
2. **Endpoint dual balance** `GET /balances/dual?groupId=optional`:
   - Calcula `cutoffDate` = último `cutoffDay` ≤ `now()` (ej: hoy 27 ago, corte 25 → 25 ago; corte 1 → 1 ago)
   - `currentPeriod` = gastos/pagos desde `cutoffDate` hasta ahora
   - `historical` = antes de `cutoffDate`
   - Misma fórmula `paid - share - received + sent` por período
3. **Cron opcional**: job diario que detecta grupos cuyo `cutoffDay` == hoy y snapshottea (si se persiste auditoría)

#### Frontend
1. **API service** `src/services/api/balances.ts` → `getDualBalance(groupId?)`
2. **Hook** `useDualBalance(groupId?)` → usa `getDualBalance` + `useFocusEffect` para refetch
3. **Group Settings** (`grupos/[id]/configuracion.tsx`):
   - Nuevo campo "Día de corte del balance" (selector 1–28)
   - Tooltip: "Los balances se reinician este día cada mes"
4. **Componente `DualBalanceCard`** (nuevo en `components/dashboard/` o `components/finance/`):
   ```tsx
   // Recibe cutoffDay y muestra etiqueta dinámica:
   // ┌─────────────────────────┐
   // │  📅 Desde el 25 (mes)   │  ← cutoffDay=25
   // │  Te deben $150.000      │
   // ├─────────────────────────┤
   // │  📊 Total histórico     │  ← balance.total
   // │  Te deben $420.000      │
   // └─────────────────────────┘
   ```
   - Dos filas apiladas (o carrusel swipe horizontal)
   - Badge dirección por fila: "Te deben" / "Debes" / "Saldado"
   - Colores: verde (te deben), rojo (debes), gris (saldado)
5. **Integración**:
   - `Dashboard` (`index.tsx`): reemplazar `PartnerBalance` / `BalanceCard` por `DualBalanceCard` (workspace-aware)
   - `Group Detail` (`grupos/[id].tsx`): hero financiero muestra `DualBalanceCard` con `groupId`
   - `Reports`: ya tiene filtros por período, solo documentar que cubre esta necesidad

#### Flujo de pagos (PaySheet)
- Por defecto `createdAt = now()` → cae en período actual (desde último corte)
- El payment reduce `currentPeriod` inmediatamente
- Si `currentPeriod` llega a 0 (SETTLED), el exceso **no** pasa a histórico automáticamente (saldo a favor del período actual)
- Al llegar el día de corte: `currentPeriod` se suma a `historical`

#### Criterios de done
- [ ] Backend: `PATCH /groups/:id/cutoff` + validación 1-28
- [ ] Backend: `GET /balances/dual` responde currentPeriod + historical + total usando cutoff del grupo (o user fallback)
- [ ] Frontend: Selector 1-28 en Group Settings
- [ ] Frontend: `DualBalanceCard` muestra "Desde el X" dinámico + ambas filas con direcciones correctas
- [ ] Dashboard usa `DualBalanceCard` por workspace (personal/couple/group/all)
- [ ] Group Detail usa `DualBalanceCard` con `groupId`
- [ ] Pagos registrados hoy reducen "Período actual" en tiempo real
- [ ] Tests: grupo corte=15, hoy=20 → período actual = 15..20; hoy=10 → período actual = 15 mes anterior..10

---

## Group Type Conversion
