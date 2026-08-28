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

---

## Innovation Ideas — Post-MVP Differentiators

> Ideas para hacer DuoBalance único, no solo "otra app de gastos". Prioridad por impacto/valor vs esfuerzo.

### 1. Smart Balance Insights (Predictive + Behavioral)

**Problema**: El usuario ve números, pero no *qué significan* ni *qué hacer*.

**Features**:
- **Predicción de cierre de mes**: "A este ritmo, terminarás debiendo $X / te deberán $Y" (basado en gasto diario promedio × días restantes)
- **Detección de anomalías**: "Gastaste 2.3x más en Comida vs tu promedio" → alerta suave en Dashboard
- **Patrones recurrentes**: "Los domingos gastas 40% más en Entretenimiento" → insight semanal
- **Nudges contextuales**: "Tu suscripción a Netflix subió $5k este mes" (detecta cambios en gastos recurrentes)
- **Health score financiero**: Score 0-100 basado en: % meses saldados, variabilidad gasto, ratio deuda/ingreso (estimado)

**Backend**: Nuevo módulo `InsightsModule` + endpoint `GET /insights/dashboard?groupId=` (agrega `Expenses` + `Balances` + heurísticas)
**Frontend**: Tarjeta "Insights" en Dashboard (collapsible), chips accionables ("Ver detalle", "Ajustar presupuesto")

---

### 2. Settlement Intelligence (Proactive + Batch)

**Problema**: Liquidar es reactivo — el usuario debe acordarse de abrir la app y pagar.

**Features**:
- **Auto-sugerencias push/in-app**: "Andrea te debe $50k desde hace 5 días → ¿Registrar pago?" (usa `GET /settlements/suggestions` + threshold días)
- **Liquidación en lote (Batch Settle)**: Un botón "Saldar todo" que crea múltiples `Payments` en una transacción (backend: `POST /payments/batch`)
- **Liquidación programada**: "Cada día 1, liquidar automáticamente lo que debo" (configurable por grupo, usa cron + `PaymentsService`)
- **Recordatorios suaves**: In-app banner "Tienes 3 liquidaciones pendientes" + deep-link a `LiquidacionesSheet`

**Backend**: `PaymentsService.createBatch()`, cron job `@nestjs/schedule` para auto-settle
**Frontend**: `BatchSettleSheet` (bottom sheet con lista de sugerencias + checkboxes + "Confirmar todo")

---

### 3. Receipts OCR + Auto-Categorization (Phase 6 Backend Ready)

**Problema**: Registrar gasto es fricción alta (campos manuales).

**Features**:
- **Scan & Extract**: Foto → { amount, merchant, date, category, items[] } (OpenAI Vision / Google Vision API / ML Kit on-device)
- **Auto-categorización aprendida**: Usuario corrige 2-3 veces → modelo aprende sus patrones (ej: "Uber" → siempre TRANSPORT)
- **Detección de duplicados**: Hash perceptual de imagen + monto/fecha → "¿Ya registraste este ticket?"
- **Comprobante fiscal (Colombia)**: Extraer NIT, CUFE, validar DIAN → export listo para contabilidad

**Backend**: `ReceiptsModule` (Phase 6) + `OCRProvider` interface (Resend-style: pluggable providers)
**Frontend**: `CreateExpenseSheet` ya tiene ImagePicker → añadir botón "Escanear" → prefill form + confianza %

---

### 4. Light Financial Gamification (Retention + Habit)

**Problema**: Registrar gastos es aburrido; se abandona a las 2 semanas.

**Features**:
- **Rachas (Streaks)**: "7 días seguidos registrando 🔥" → badge en perfil + toast celebratorio
- **Metas compartidas**: "Ahorrar $500k para viaje 🏝️" → barra progreso conjunta en Dashboard/Group Detail (usa `Balances` + target)
- **Logros desbloqueables**:
  - "Primer mes saldado" 🏁
  - "100 gastos registrados" 📝
  - "Cero deudas 3 meses seguidos" 💚
  - "Scanner pro: 10 receipts OCR" 📷
- **Nivel de pareja/grupo**: XP por gasto registrado, pago confirmado, mes saldado → desbloquea temas visuales

**Backend**: `GamificationModule` (events-driven: `ExpenseCreated`, `PaymentConfirmed`, `MonthSettled` → actualiza stats)
**Frontend**: `AchievementToast`, `StreakBadge` en `ProfileCard`, `SharedGoalCard` en Dashboard

---

### 5. Multi-Actor v2.0 (Groups 3+ + Item Splits + Subgroups)

**Ya en FUTURE.md como "Group Type Conversion" — expandir**:

- **Grupos 3+ (Roommates, Viajes, Familia)**: N-way equal / percentage / custom por ítem
- **Split por ítem (Item-level splits)**: "Yo pagué la cena ($120k), tú el Uber ($30k)" → un gasto, splits desiguales por concepto
- **Sub-grupos**: "Viaje a Cartagena 🏖️" dentro de grupo "Amigos 👥" → balances aislados + roll-up al padre
- **Invitaciones por correo**: `mailService.sendInvitation()` (MailModule ya listo) → link mágico `duobalance://join?code=XYZ`

**Backend**: `GroupType.GROUP` ya existe → extender `ExpenseSplit` con `itemId?` + `SubGroup` model
**Frontend**: `CreateGroupSheet` tipo selector, `ItemSplitSheet` (nuevo), `SubGroupCard` en Group Detail

---

### 6. Export & Tax Ready (Professional / LatAm)

**Problema**: Usuarios necesitan exportar para contabilidad / impuestos.

**Features**:
- **PDF mensual profesional**: Portada + resumen por categoría + tabla gastos + comprobantes (thumbnails) + totales
- **Excel/CSV contable**: Columnas estándar (Fecha, Concepto, Categoría, Monto, Pagado por, Split, Comprobante URL)
- **Facturación DIAN (Colombia)**: Exportar gastos con NIT/CUFE válidos → formato compatible software contable
- **Backup automático**: Export mensual a Google Drive / OneDrive / email (configurable)

**Backend**: `ExportModule` + `PDFService` (pdfkit/puppeteer) + `ExcelService` (exceljs)
**Frontend**: `ExportSheet` en Reportes/Perfil → selector período + formato + destino

---

### 7. Web-First PWA + Offline-First (Post-MVP)

**Problema**: Web es prioridad, pero offline nativo gana en móvil.

**Features**:
- **Service Worker (Workbox)**: Cache app shell + API responses (GET /expenses, /groups, /balances)
- **Background Sync**: Mutaciones offline (crear gasto, pago) → cola IndexedDB → sync al recuperar conexión
- **Optimistic UI**: Gasto aparece instantáneo → badge "Sincronizando..." → check verde al confirmar
- **Instalable (A2HS)**: Manifest + icons + splash → "Instalar DuoBalance" en Chrome/Safari
- **Push Notifications Web**: VAPID + `web-push` → recordatorios liquidación, insights semanales

**Backend**: Headers `Cache-Control` + `ETag` en GET endpoints + idempotency keys en POST
**Frontend**: `workbox-precaching` + `workbox-background-sync` + `idb` para cola mutaciones

---

### 8. Shared Budgeting (Presupuestos Colaborativos)

**Extensión natural de balances**: No solo "qué debemos", sino "cuánto podemos gastar".

**Features**:
- **Presupuesto por categoría/grupo**: "Máx $800k/mes en Comida 🍔" → barra progreso en Dashboard/Gastos
- **Alertas suaves**: "Llevas 85% del presupuesto de Transporte" (amarillo) / "Excedido" (rojo)
- **Rollover**: "Sobraron $50k de Comida → ¿Sumar a Entretenimiento o Ahorro?"
- **Presupuesto compartido**: Ambos editan, cambios notificados → consenso

**Backend**: `BudgetModule` (model `Budget { groupId, category, amount, period, rolloverEnabled }`)
**Frontend**: `BudgetCard` en Dashboard, `BudgetSetupSheet` en Group Settings, alertas en `CreateExpenseSheet`

---

## Prioritization Matrix (Impacto vs Esfuerzo)

| Feature | Impacto | Esfuerzo | Prioridad | Dependencias |
|---------|---------|----------|-----------|--------------|
| **Dual Balance + Corte Config** | ⭐⭐⭐⭐⭐ | 🟢 Bajo | **P0** (ya en plan) | BalancesModule |
| **Smart Insights** | ⭐⭐⭐⭐ | 🟡 Medio | **P1** | DashboardData + ReportsData |
| **Receipts OCR** | ⭐⭐⭐⭐⭐ | 🟡 Medio | **P1** | Phase 6 Backend + CreateExpenseSheet |
| **Settlement Intelligence** | ⭐⭐⭐⭐ | 🟡 Medio | **P1** | SettlementsModule + Push/In-app |
| **Gamification Ligera** | ⭐⭐⭐ | 🟢 Bajo | **P2** | Event system + Profile |
| **Export/Tax Ready** | ⭐⭐⭐⭐ | 🟡 Medio | **P2** | Reports + Receipts |
| **PWA Offline** | ⭐⭐⭐⭐ | 🔴 Alto | **P3** | Service Worker + IndexedDB |
| **Multi-Actor v2.0** | ⭐⭐⭐⭐⭐ | 🔴 Alto | **P3** | Groups + Expenses refactor |
| **Shared Budgeting** | ⭐⭐⭐⭐ | 🟡 Medio | **P2** | Categories + Groups |

---

## Recommended Next Steps (Skills-Driven)

```bash
# 1. Dual Balance (ya especado) → implementar directo
# 2. Smart Insights → brainstorming para definir métricas exactas
/brainstorming "Smart Insights: qué métricas, qué UI, qué umbrales"

# 3. Receipts OCR → design-an-interface para OCRProvider pluggable
/design-an-interface "ReceiptsModule con OCRProvider (OpenAI/Google/MLKit)"

# 4. Settlement Intelligence → prototype para BatchSettleSheet UX
/prototype UI "BatchSettleSheet: lista sugerencias + checkboxes + confirmar todo"

# 5. Multi-Actor v2.0 → decision-mapping (complejo, multi-sesión)
/decision-mapping "v2.0: subgroups, item splits, invitaciones email"
```

---

## Skills para desarrollo futuro

| Skill | Cuándo usarlo |
|-------|---------------|
| `brainstorming` | Inicio de cualquier feature nueva (Insights, Budgets, Gamification) |
| `design-an-interface` | Antes de crear módulos backend (InsightsModule, BudgetModule, GamificationModule) |
| `prototype` | Validar UI compleja (BatchSettleSheet, ItemSplitSheet, ExportSheet) o lógica (cutoffDate, OCR parsing) |
| `decision-mapping` | Features grandes multi-sesión (v2.0 Multi-Actor, PWA Offline) |
| `grill-me` / `grilling` | Stress-testear planes antes de comprometer código |
| `frontend-design` | Rediseño visual distintivo (Dashboard hero, Onboarding, Group Detail) |
| `to-prd` / `to-issues` | Cuando spec aprobado → generar PRD + issues tracer-bullet para tracking |

---

## Comprehensive Improvement Plan (from Codebase Analysis + Competitive Research)

> Análisis completo de ambos codebases (API + App) + investigación competitiva (Splitwise, Tricount, Settle Up, Finanple, Monarch, YNAB, Tandem). Priorizado por impacto vs esfuerzo.

### Current State Summary

| Area | Status | Notes |
|------|--------|-------|
| **Backend (API)** | ✅ **Production-ready core** | All modules complete, 49% test coverage, security-first |
| **Frontend (App)** | ✅ **MVP feature-complete** | All screens implemented, real data, web-first |
| **Architecture** | ✅ **Solid** | Clean modular, TypeScript strict, good patterns |
| **Gaps** | ⚠️ **Infrastructure/Polish** | No React Query, dark mode half-done, no offline, no tests |

---

### P0 - Critical (Do This Sprint)

#### 1. Add React Query / TanStack Query
**Why**: Eliminates 80% of data-fetching boilerplate, adds caching, deduping, background refetch, stale-while-revalidate, optimistic updates
```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools
# Wrap root layout with QueryClientProvider
# Migrate all hooks: useGroups, useDashboardData, useReportsData, useGroupPayments, etc.
```

#### 2. Wire Dark Mode (Tokens already exist in `theme.ts`)
```tsx
// Create ThemeProvider using useColorScheme + AsyncStorage persistence
// Replace hardcoded colors with semantic tokens (already defined)
```

#### 3. Remove Debug Logging (`client.ts` logs ALL requests)
```typescript
// Gate behind __DEV__ or remove entirely
```

#### 4. Extract Shared Filter Logic
```typescript
// Create useExpenseFilters hook (period/category/search)
// Used by: GastosScreen, MovimientosScreen, ReportesScreen
```

---

### P1 - High Impact Features (Next 2-3 Sprints)

#### 5. Generalize `PartnerBalance` → `MemberBalance` (N-members)
- **Competitive gap**: Splitwise/Tricount/Settle Up all handle 3+ members properly
- **Current**: Only works for couples (2 members)
- **Needed for**: Group Detail, Dashboard when workspace = GROUP type

#### 6. Settlement Suggestions Cards (Visual UI)
- **Backend ready**: `GET /settlements/suggestions` returns greedy algorithm output
- **Frontend gap**: Only toast notification exists
- **Competitive parity**: Splitwise/Tricount show "Who pays whom" cards
- **Implementation**: `SettlementSuggestionsCard` component in Dashboard + Group Detail

#### 7. CUSTOM Split Picker for GROUP type
- **Backend supports**: `SplitType.CUSTOM` in enum
- **Frontend missing**: Only EQUAL/PERCENTAGE/PERSONAL
- **Competitive feature**: Settle Up "Default share" per member; Splid custom amounts
- **UX**: Per-member amount inputs with sum validation = expense total

#### 8. Error Boundaries + Graceful Error Handling
```tsx
// Wrap each screen with ErrorBoundary
// Add fallback UI: "Algo salió mal" + "Reintentar" button
// Log to Sentry (when configured)
```

#### 9. Expo Linking for Deep Links
- **Missing**: `duobalance://reset-password?token=...` not handled
- **Needed for**: Password reset emails, group invitations, payment confirmations

---

### P2 - Differentiation Features (v1.0 Polish)

#### 10. Smart Balance Insights (FUTURE.md #1)
- **Prediction**: "A este ritmo, terminarás debiendo $X"
- **Anomaly detection**: "Gastaste 2.3x más en Comida vs promedio"
- **Competitive edge**: No competitor does this well — Splitwise/Tricount are passive trackers

#### 11. Receipts OCR + Auto-categorization (Phase 6 Backend + FUTURE.md #3)
- **Current**: Manual photo only
- **Competitive**: Tricount (bunq) has auto-expense tracking via bank; Splitwise has receipt scan (premium)
- **Differentiation**: Local ML Kit on-device OCR (privacy-first) + learned categorization

#### 12. Settlement Intelligence (FUTURE.md #2)
- **Batch Settle**: One tap "Saldar todo" → creates multiple payments
- **Auto-settle cron**: "Cada día X, liquida automáticamente"
- **Proactive nudges**: "Andrea te debe $50k hace 5 días → ¿Registrar pago?"

#### 13. Shared Budgeting (FUTURE.md #8)
- **Category budgets**: "Máx $800k/mes en Comida" → progress bar in Dashboard/Gastos
- **Alertas**: 80% amarillo, 100%+ rojo
- **Rollover**: "Sobraron $50k → ¿Sumar a Entretenimiento?"
- **Competitive**: Finanple has this; Splitwise/Tricount don't

#### 14. Export & Tax Ready (FUTURE.md #6)
- **PDF mensual profesional**: Cover + category breakdown + receipts thumbnails
- **Excel/CSV contable**: Standard columns for accountants
- **DIAN Colombia**: NIT/CUFE validation for fiscal compliance
- **Competitive**: Splid has treasurer exports; Splitwise premium only

---

### P3 - Platform Excellence (Post-MVP)

#### 15. PWA + Offline-First (FUTURE.md #7)
- **Service Worker** (Workbox): Cache app shell + GET responses
- **Background Sync**: Mutations offline → IndexedDB queue → sync on reconnect
- **Optimistic UI**: Instant feedback + "Sincronizando..." badge
- **A2HS**: Manifest + icons + splash → "Instalar DuoBalance"
- **Web Push**: VAPID for settlement reminders, insights

#### 16. Push Notifications (Expo Notifications)
- Payment request received
- Payment confirmed/rejected
- Monthly settlement reminder
- Weekly insights digest

#### 17. i18n (Spanish/English) — `react-i18next`
- All strings externalized
- RTL support prep

#### 18. EAS Build + App Store Deploy
- Production builds
- TestFlight / Play Console
- Icons, splash, permissions

---

### Architecture Improvements (Ongoing)

| Issue | Fix |
|-------|-----|
| Large components (`grupos/[id].tsx` 844 lines) | Split into sub-components: `GroupFinancialHero`, `GroupSettlementCard`, `GroupDistributionBar`, `GroupExpenseList` |
| Client-side balance duplication | Create `BalanceEngine` utility used by both `useDashboardData` + Group Detail + backend (shared logic) |
| No API versioning | Add `/v1/` prefix to all routes |
| Mail template loading in prod | Copy templates to `dist/` via `nest-cli.json` assets or build script |
| Rate limiting missing | Add `@nestjs/throttler` on auth endpoints |
| No CI/CD | GitHub Actions: lint → test → build → deploy |

---

### Competitive Feature Matrix

| Feature | DuoBalance | Splitwise | Tricount | Settle Up | Finanple |
|---------|------------|-----------|----------|-----------|----------|
| **Couple-first (50/50 + %)** | ✅ | ❌ Pro only | ❌ | ✅ | ✅ |
| **Group 3+ (N-way)** | ⚠️ Partial | ✅ | ✅ | ✅ | ❌ |
| **CUSTOM split per member** | ❌ Backend only | ❌ | ❌ | ✅ "Default share" | ✅ |
| **Receipt OCR** | ❌ Manual only | Premium | ❌ | ❌ | ❌ |
| **Smart insights/predictions** | ❌ Planned | ❌ | ❌ | ❌ | ⚠️ Basic |
| **Category budgets** | ❌ Planned | ❌ | ❌ | ❌ | ✅ |
| **Savings goals** | ❌ Planned | ❌ | ❌ | ❌ | ✅ |
| **Offline mode** | ❌ Planned | ❌ | ✅ | ❌ | ❌ |
| **Multi-currency** | ❌ | Premium | ✅ | ❌ | ❌ |
| **Bank linking** | ❌ | ❌ | bunq only | ❌ | ❌ |
| **Payment requests** | ✅ (manual) | ❌ | ✅ (bunq) | ❌ | ❌ |
| **Settlement suggestions** | ✅ Backend only | ✅ | ✅ | ✅ | ❌ |
| **Free tier** | ✅ Unlimited | ~3-5/day | ✅ Unlimited | ✅ | ✅ |
| **Dark mode** | ⚠️ Tokens only | ✅ | ✅ | ✅ | ✅ |
| **PWA/Installable** | ❌ Planned | ❌ | ❌ | ❌ | ❌ |

**Key Insight**: DuoBalance's **differentiation opportunity** = Couple-first + Smart Insights + Budgets + OCR + Offline PWA. Competitors are either splitters (no budgets) or budget apps (no splitting). DuoBalance can be **both**.

---

### Recommended Skill Usage for Each Phase

| Phase | Skill | Command |
|-------|-------|---------|
| **P0: React Query Migration** | `brainstorming` | `/brainstorming "Migration plan: manual hooks → React Query"` |
| **P1: MemberBalance (N-members)** | `design-an-interface` | `/design-an-interface "MemberBalance component API for N members"` |
| **P1: CUSTOM Split Picker** | `prototype` | `/prototype UI "CUSTOM split picker: per-member amounts with sum validation"` |
| **P2: Smart Insights** | `brainstorming` | `/brainstorming "Smart Insights: metrics, thresholds, UI placement"` |
| **P2: Receipts OCR** | `design-an-interface` | `/design-an-interface "ReceiptsModule with pluggable OCRProvider (MLKit/OpenAI/Google)"` |
| **P2: Settlement Intelligence** | `prototype` | `/prototype UI "BatchSettleSheet: list suggestions + checkboxes + confirm all"` |
| **P3: Multi-Actor v2.0** | `decision-mapping` | `/decision-mapping "v2.0: subgroups, item splits, email invitations"` |
| **Any major feature** | `grill-me` | `/grill-me "Stress-test [feature] plan before building"` |

---

### Next Steps Decision Framework

1. **Start with P0** (React Query + Dark Mode + Debug removal + Filter hook) — ~1 sprint
2. **Then P1** (MemberBalance + Settlement Cards + CUSTOM Split) — ~2 sprints
3. **Then P2** (pick 1-2 differentiators: Smart Insights OR Receipts OCR OR Budgeting) — ~2-3 sprints each
4. **P3** when ready for production

**Which P0 item do you want to tackle first?** Use `/brainstorming` for migration plan, or `/grill-me` to stress-test any feature before committing.
