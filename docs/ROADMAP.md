# Roadmap — Mobile App Release Phases

## Phase 0: Foundation (v0.1) — Done
**Goal**: Bootstrapped Expo project with routing, styling, and tooling
- [✅] Expo project init (SDK 56)
- [✅] Expo Router file-based routing
- [✅] NativeWind + Tailwind CSS config
- [✅] TypeScript strict mode
- [✅] ESLint + Prettier config
- [✅] Import aliases
- [✅] Environment variables setup
- [✅] Axios API client with request interceptor
- [✅] Secure token storage (expo-secure-store)
- [✅] Full backend API types

**Estimated**: Complete

---

## Phase 1: Auth (v0.2) — Done
**Goal**: Users can register and log in
- [✅] Auth context + secure token storage
- [✅] useAuth hook (with token persistence)
- [✅] Login screen (UI + full API integration)
- [✅] Register screen (UI + full API integration with auto-login + AlertModal)
- [🔄] Forgot password screen (UI complete, pending backend connection)
- [✅] Reusable auth components (AuthHeader, AuthDivider, SocialLoginButton, AuthFooter)
- [✅] Enhanced Input component (iconLeft, iconRight, onIconRightPress, secureTextEntry toggle, focus border with instant green + blur transition)
- [✅] Custom AlertModal with BlurView backdrop (success/error/warning/info)
- [✅] Toast notifications (react-native-toast-message)
- [✅] Protected route guard
- [✅] Conditional routing (index.tsx → WelcomeScreen or Dashboard)
- [✅] Change password screen — full implementation (PATCH /auth/password, validation, AlertModal)
- [✅] Edit profile screen — name/email update + avatar upload
- [❌] Response interceptor (401 handling)

**Estimated**: Complete

---

## Phase 2: UI Components & Layout (v0.3) — Done
**Goal**: Reusable component library and navigation layout
- [✅] BottomSheet (backdrop, drag indicator, spring animations)
  - **⚠️ Known coupling**: `heightRatio` and `headerFinalTranslateY` must be adjusted together. Changing one without the other causes header/sheet overlap or visual gaps. Formula used in some sheets: `headerFinalTranslateY = Math.max(0.01, 0.37 - heightRatio * 0.75)`. Common pairs: `{0.45, 0.27}`, `{0.55, 0.27}`, `{0.65, 0.17}`, `{0.75, 0.10}`, `{0.95, 0.01}`.
- [✅] PercentageSlider (gradient fill, min/max caps)
- [✅] DistributionBar (stacked bar with legends)
- [✅] Button (5 variants: primary/secondary/outline/danger/link)
- [✅] Card, Loading, EmptyState
- [✅] BottomTab (5 tabs: Inicio, Gastos, Grupos, Reportes, Perfil)
- [✅] ScreenHeader, SplashScreen, HeroSection (unified dashboard/page variants)
- [✅] Staggered entrance animations

**Estimated**: Complete

---

## Phase 3: Dashboard & Reports (v0.3) — Done
**Goal**: See balances, spending breakdown, and reports
*(Frontend mostly complete; remaining items are backend concerns)*
- [✅] Dashboard screen (HeroSection, GroupSection from API, MemberBalance, RecentTransactions, TopCategory, FloatingAddButton)
- [✅] Reports screen (bar chart, donut chart, stats cards)
- [✅] Balance visualization (MemberBalance)
- [✅] Category breakdown chart (DonutChart)
- [🔄] Backend API integration for dashboard/balances (mock data remains)
- [❌] Settlement suggestions

**Estimated**: 1-2 weeks (API integration)

---

## Phase 4: Group Management (v0.3) — Done
**Goal**: Users can create and manage groups (couples for now, multi-type later)
*(Frontend complete with API integration)*
- [✅] Group list screen (`grupos/index.tsx`) — GroupSection, group filter, FloatingAddMenu, CoupleMenuSheet, InviteMemberSheet, JoinGroupSheet — API connected
- [✅] Create group (`CreateCoupleSheet` — bottom sheet with type selector, split config — API connected)
- [✅] Group detail screen (`grupos/[id].tsx`) — financial hero, settlement status, distribution, expenses, group menu, invite member — API connected
- [✅] Group settings screen (`grupos/[id]/configuracion.tsx`) — name, split %, members, invite code, regenerate code, type, notifications, danger zone — API connected
- [✅] Join group via invite code (`JoinGroupSheet` — enter code form + QR scanner placeholder — API connected)
- [✅] Per-group expense list (`grupos/[id]/gastos.tsx`) — date/category filters, RecentExpensesCard, CreateExpenseSheet
- [✅] Groups API service (`src/services/api/groups.ts`) — full CRUD + invite + members + archive
- [✅] useGroups hook — loads groups from API, classifies by type, refetch
- [❌] Balance real del backend en GroupCard (pendiente endpoint)

**Estimated**: Complete

---

## 🔴 URGENTE — Movement Hub (v0.4) — Partial
**Prioridad Máxima — Implementar Inmediatamente Después de Vistas Actuales**

### Objetivo
Unificar la creación de movimientos financieros desde una única entrada tipo Bottom Sheet. Actualmente se ha implementado `CreateExpenseSheet` para gastos compartidos, pero el hub completo (con type selector + DebtPaymentForm + IncomeForm + lista plana cronológica) está pendiente.

### Estado actual de la implementación
Se tomó un **enfoque simplificado**: en lugar de la arquitectura paso a paso original (Step 1 → type selector → Step 2 → form dinámico), se construyó **`CreateExpenseSheet`**, un formulario unificado con todos los campos del gasto compartido en una sola vista Bottom Sheet.

### Arquitectura actual
```
gastos/index.tsx (Vista resumen por pareja — per-couple summary, NO flat chronological list)
  └── FAB → /gastos/add (pantalla standalone — aún no convertida a bottom sheet)

grupos/[id]/gastos.tsx (Gastos por grupo individual)
  └── FAB → CreateExpenseSheet (Bottom Sheet unificado con todos los campos inline)
```

### Archivos ya implementados
| Archivo | Propósito |
|---|---|
| `src/components/movements/create-expense-sheet.tsx` | Formulario unificado de gasto compartido (amount, description, category, date, paid-by, participants, split type EQUAL/PERCENTAGE, comprobante placeholder) |
| `src/app/(protected)/gastos/detalle/[id].tsx` | Detalle de gasto con 7 componentes (hero, info, participants, split, receipt, timeline, actions) |
| `src/components/expenses/expense-hero-card.tsx` | Hero card del detalle de gasto |
| `src/components/expenses/expense-information.tsx` | Información del gasto (monto, categoría, fecha) |
| `src/components/expenses/expense-participants.tsx` | Participantes del gasto |
| `src/components/expenses/expense-split.tsx` | Desglose del split |
| `src/components/expenses/expense-receipt.tsx` | Sección de comprobante |
| `src/components/expenses/expense-timeline.tsx` | Línea de tiempo del gasto |
| `src/components/expenses/expense-actions.tsx` | Acciones (editar/eliminar) |

### Archivos pendientes (por implementar)
| Archivo | Propósito |
|---|---|
| `src/components/movements/create-movement-sheet.tsx` | Orchestrador step 1 + step 2 (cuando existan los demás tipos) |
| `src/components/movements/movement-type-selector.tsx` | 3 tarjetas visuales (🛒/💸/💰) con icono, título, descripción |
| `src/components/movements/debt-payment-form.tsx` | Formulario pago de deuda |
| `src/components/movements/income-form.tsx` | Formulario ingreso/abono |
| `src/components/movements/movement-list.tsx` | FlatList unificada de todos los movimientos |

### Archivos a modificar (pendiente)
| Archivo | Cambio |
|---|---|
| `src/app/(protected)/gastos/index.tsx` | Convertir a lista plana cronológica + FAB abre CreateMovementSheet |
| `src/app/(protected)/gastos/_layout.tsx` | Eliminar Stack.Screen "add" |

### Archivos a eliminar (pendiente)
| Archivo | Razón |
|---|---|
| `src/app/(protected)/gastos/add.tsx` | Reemplazado por Bottom Sheet cuando esté completo |

### Diseño del MovementTypeSelector (pendiente)
Selector visual con tarjetas (NO dropdown/picker):
- Cada tarjeta: icono + título + descripción + ejemplos
- Estado normal: borde `#E2E8F0`, fondo blanco
- Estado selected: borde `#10B981`, fondo `#F0FDF4`
- 3 opciones: Gasto compartido / Pago de deuda / Ingreso

### Dependencias
- Reutiliza: `BottomSheet`, `BottomSheetHeader`, `Input`, `Button`, `useBottomSheet`
- Mock data inicial (mismo patrón que el resto de la app)

**Estimated**: INMEDIATA (próximo sprint)

---

## Phase 5: Expense Tracking (v0.5) — Partial
**Goal**: Add, view, edit, and delete expenses
- [✅] Expense detail screen (`gastos/detalle/[id].tsx`) with 7 components: ExpenseHeroCard, ExpenseInformation, ExpenseParticipants, ExpenseSplit, ExpenseReceipt, ExpenseTimeline, ExpenseActions
- [✅] CreateExpenseSheet (bottom sheet: amount, description, category, date, paid-by, participants, split type, receipt placeholder)
- [✅] Expense list screen (`gastos/index.tsx`) with filters
- [❌] Edit expense UI
- [❌] Delete expense UI
- [❌] Backend API integration (expenses.ts service pending)

**Estimated**: 1-2 weeks (edit/delete UI + API integration)

---

## Phase 5b: Backend API Integration (v0.5) — Partial
**Goal**: All screens connected to real backend API

### Status:
1. ✅ **Groups API service** — `src/services/api/groups.ts` (POST /groups, GET /groups, GET /groups/:id, PATCH /groups/:id, DELETE /groups/:id, POST /groups/join, POST /groups/:id/regenerate-invite, POST /groups/:id/archive, DELETE /groups/:id/leave, DELETE /groups/:id/members/:memberId, PATCH /groups/:id/members/:memberId/split)
2. ✅ **Connect Group list** — useGroups hook replaces MOCK_COUPLES with API data
3. ✅ **Connect CreateCoupleSheet** — POST /groups on form submit
4. ✅ **Connect JoinGroupSheet** — POST /groups/join with invite code
5. ✅ **Connect Group settings** — PATCH /groups/:id for name/split
6. ❌ **Expenses API service** — create `src/services/api/expenses.ts`
7. ❌ **Connect expense screens** — replace mock data with real API
8. ❌ **Balances API** — connect group detail balance data
9. ❌ **Dashboard API** — create service + connect dashboard
10. ❌ **Payments/Settlements API** — create service + connect

**Estimated**: 1-2 weeks for remaining items

---

---

## Phase 6: Receipt Capture (v0.5)
**Goal**: Take photos of receipts and auto-fill expenses
- Camera/gallery integration
- Upload + progress UI
- Extracted data confirmation

**Estimated**: 2-3 weeks

---

## Phase 7: Payments (v0.6)
**Goal**: Record payments and settle up
- Pay screen
- Payment history
- Settlement suggestions

**Estimated**: 1-2 weeks

---

## Phase 8: Backend Integration (v0.7)
**Goal**: All screens connected to real backend API
- Auth endpoints connected (login, register, profile)
- Groups CRUD connected
- Expenses CRUD connected
- Dashboard data from API
- Reports from API
- Payments/settlements from API

**Estimated**: 2-3 weeks

---

## Phase 9: Production (v1.0)
**Goal**: App store ready
- Push notifications
- Offline support
- Dark mode
- i18n
- App icon + splash
- Store submission (iOS + Android)

**Estimated**: 4-6 weeks

---

## Fase 10: Multi-actor Support (v2.0)

**Goal**: Generalizar la plataforma para que no solo funcione para parejas, sino que soporte tres tipos de actores.

### Los 3 actores

| Tipo | Emoji | Descripción | Miembros |
|------|-------|-------------|----------|
| Personal | 👤 | Control financiero individual | 1 (solo yo) |
| Pareja | ❤️ | Gastos compartidos entre dos (como hoy) | 2 |
| Grupo | 👥 | Roommates, familia, viaje, amigos | 3+ |

### Lo que cambia

**Backend (API + DB)**
- Tabla `couples` → `groups` con columna `type`
- `group_members` tabla N:N
- Endpoints de couples → groups (con redirect)
- Splits generalizados para N personas

**Frontend**
- Tab renombrado de "Pareja" → "Grupos" (✅ ya implementado) + selector de tipo de grupo
- Nueva pantalla de creación con selector: Personal / Pareja / Grupo
- Split picker adaptativo: 1 persona (no aplica), 2 personas (actual), 3+ (N-way)
- Dashboard con selector global y balance multi-grupo
- Componentes renombrados: `CoupleCard` → `GroupCard`, `PartnerBalance` → `MemberBalance`, etc.

### Fases internas

| Subfase | Actor | Cambios |
|---------|-------|---------|
| 10.1 | ❤️ Pareja | Migrar DB, renombrar endpoints, conectar frontend existente |
| 10.2 | 👤 Personal | Permitir gastos sin split (100% usuario), dashboard individual |
| 10.3 | 👥 Grupo | Splits N-way, gestión de miembros, roles, permisos |

**Estimated**: 6-8 weeks

---

## Timeline

```
v0.1  ████████████████████████████████  (Foundation — COMPLETE)
v0.2  ████████████████████████████████  (Auth — COMPLETE)
v0.3  ████████████████████████████████  (UI Components + Dashboard + Groups + Perfil — COMPLETE)
v0.4  ████░░░░░░░░░░░░░░░░░░░░░░░░░░  (Movement Hub — Expenses UI + create expense sheet implemented, pending API)
v0.5  ████░░░░░░░░░░░░░░░░░░░░░░░░░░  (Group Management API integration — groups.ts + useGroups + screens connected)
v0.6  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Payments)
v1.0  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Production: remaining API + receipts + polish)
```

**Total estimated time to v1.0**: 14-20 weeks
**Total estimated time to v2.0**: 20-28 weeks
