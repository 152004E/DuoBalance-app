# Roadmap — Mobile App Release Phases

## Estado del Backend (revisión por módulos)

> **Conclusión clave:** El backend está prácticamente completo. Ya no estamos en una etapa de construir lógica de negocio, sino en una etapa de **integrar y consumir esa lógica desde el frontend**.

| Módulo | Estado | Cobertura |
|--------|--------|-----------|
| **Auth** | ✅ Completo | Login, register, profile, password, avatar |
| **Groups** | ✅ Completo | CRUD, invite, join, members, archive (10/10) |
| **Expenses** | ✅ Muy sólido | EQUAL, PERSONAL, PERCENTAGE, Soft Delete + recalc balance |
| **Balance** | ✅ Completo | Recalculado en tiempo real, no persistido |
| **Payments** | ✅ Completo | Validaciones: amount 0, pago a sí mismo, usuario inexistente, sin grupo |
| **Settlement** | ✅ Completo | Separa Balance (deudas) de Settlement (pagos) |
| **Settlement Suggestions** | ✅ Completo | Algoritmo tipo Splitwise "Pedro → Ana: $150" |
| **Percentage Split** | ✅ Completo | Tests: 70/30, 60/40, 90%, 110% |
| **Dashboard** | ✅ Completo | Balance, settlement, month expenses, count, top category, by category, last expense, monthly comparison |

### Lo que esto significa
- ✅ Toda la lógica de negocio existe
- ✅ Recalcula balances en soft-delete (no persiste)
- ✅ Separa Balance vs Settlement (bien diseñado)
- ✅ Dashboard ya devuelve resumen completo del MVP
- 🚧 **Lo único que falta es frontend**: conectar pantallas

### Decisión de producto
**No desarrollar más lógica de negocio. Dedicarse a conectar pantallas.**

---

## Arquitectura de Datos (Dependency Chain)

```
Expenses
    │
    ▼
Shares (división por miembro)
    │
    ▼
Balance (agregación: paid - share)
    │
    ▼
Settlements (pagos para saldar balance)
```

Cada nivel depende estrictamente del anterior. No se puede calcular balance sin shares, ni shares sin expenses.

---

## Sprint 1: Expenses CRUD + Users + Groups (MVP Core)
**Goal**: Registro completo de gastos con categorías, quién pagó, fecha, comprobante, tipo de división

### ✅ Ya completado (Foundation + Auth + Groups)
- [✅] Expo project init (SDK 56), TypeScript strict, NativeWind, Router
- [✅] Auth: Login, Register, Change Password, Profile, token persistence
- [✅] Groups: List, Create, Detail, Settings, Join via invite code — API connected
- [✅] UI Components: BottomSheet, Button, Input, AlertModal, DistributionBar, PercentageSlider, GroupSection, GroupSelector
- [✅] Layout: BottomTab (5 tabs), ScreenHeader, SplashScreen, HeroSection
- [✅] Expense Screens UI: List (`gastos/index.tsx`), Detail (`gastos/detalle/[id].tsx`), CreateExpenseSheet
- [✅] Expenses API service (`src/services/api/expenses.ts`) — CRUD completo

### 🔄 En progreso / Pendiente Sprint 1
- [✅] **Conectar Expense List a API real** — `gastos/index.tsx` + `gastos/Movimientos.tsx` usan `getExpenses` (useFocusEffect), filtros por grupo/palabra/periodo/categoría, RecentExpensesCard/lista con datos reales
- [✅] **Conectar Expense Detail a API real** — `gastos/detalle/[id].tsx` usa `getExpense`, `deleteExpense`, `updateExpense`
- [✅] **Conectar Group Expenses a API real** — `grupos/[id]/gastos.tsx` redirige a `gastos/Movimientos?groupId=id`, que sí usa `getExpenses`/`createExpense`
- [✅] **Edit Expense UI** — `CreateExpenseSheet` con `initialExpense`/`onUpdateExpense` (modo edición + prefill), abierto desde `ExpenseMenuSheet` o `ExpenseActions`
- [✅] **Delete Expense UI** — confirmación en detalle (`AlertModal`) disparada desde `ExpenseMenuSheet` o `ExpenseActions`
- [✅] **División en CreateExpenseSheet (decisión de producto)** — PERSONAL sin división; COUPLE siempre ambos con Igual/Porcentaje (default = splitPercentage de la pareja o 50/50); GROUP 3+ solo Igual con selector de participantes
- [❌] **Receipt Capture (básico)** — cámara/galería, preview, upload placeholder

### Criterios de done Sprint 1
- Usuario puede crear, ver, editar, eliminar gastos
- Gasto guarda: monto, descripción, categoría, fecha, pagado por, split type, splits calculados
- Lista de gastos muestra datos reales (no mock)
- Filtros por fecha/categoría/grupo funcionan

---

## Sprint 2: Expense Shares + Splits Engine
**Goal**: Calcular y persistir la participación de cada miembro al crear un gasto

### Concepto clave
Al crear un gasto, **se generan automáticamente las shares** (ExpenseShares) según el split type:

| Split Type | Lógica |
|------------|--------|
| **EQUAL** | Monto / N miembros |
| **PERCENTAGE** | Monto × % de cada miembro (configurado en grupo) |
| **CUSTOM** | Usuario define monto exacto por miembro |
| **PERSONAL** | 100% al usuario que paga (grupo tipo PERSONAL) |

### Tareas Sprint 2
- [✅] **Backend**: Verificado — `POST /expenses` persiste `ExpenseSplit` por miembro (seed real: COUPLE 30/70, GROUP 25%×4, PERSONAL 100%)
- [✅] **Frontend**: `CreateExpenseSheet` calcula splits en cliente según decisión de producto (PERSONAL sin división, COUPLE Igual/Porcentaje con default = splitPercentage, GROUP 3+ solo Igual)
- [✅] **Frontend**: `ExpenseDetail` muestra desglose de splits reales (se oculta para grupos PERSONAL / splitType PERSONAL)
- [🔄] **Tipos de grupo**: Splits funcionan en backend para PERSONAL/COUPLE/GROUP; el picker de UI no escala a CUSTOM/N-way por decisión de producto

### Criterios de done Sprint 2
- Al crear gasto, se persisten shares correctos en backend
- UI muestra preview: "Andrea paga $50.000, Emerson debe $50.000"
- Split Picker funciona para los 4 tipos
- Edit expense recalcula shares

---

## Sprint 3: Balance Engine + Dashboard Real
**Goal**: Agregar shares → balance por usuario → mostrar en Dashboard y Group Detail

### Fórmula
```
Para cada usuario en un grupo:
  paid   = SUM(expenses WHERE paidBy = user)
  share  = SUM(expense_shares WHERE userId = user)
  balance = paid - share

Balance neto del Dashboard (client-side, useDashboardData):
  netBalance = paid - share - paymentsReceived + paymentsMade
  // paymentsReceived = SUM(payments CONFIRMED WHERE toUser = user)
  // paymentsMade     = SUM(payments CONFIRMED WHERE fromUser = user)
  // replica netSettlementSigned del backend (settlements.service.ts)
```

### Tareas Sprint 3
- [❌] **Backend**: `GET /balances` y `GET /groups/:id/balance` devuelven agregación correcta
- [❌] **Frontend API**: `src/services/api/balances.ts` — servicio para balances
- [❌] **Frontend API**: `src/services/api/dashboard.ts` — servicio para dashboard summary (obsoleto como prerrequisito: Dashboard ya conectado client-side vía `useDashboardData` + `getExpenses` + `getPayments`)
- [✅] **Dashboard Screen**: Conectado — balance neto por workspace (incluye pagos CONFIRMED: `paid − share − recibido + enviado`), transacciones del mes, top categoría y aportes reales (useDashboardData); sin mocks
- [✅] **Group Detail**: Conectado — total real via `getExpenses`, barra de distribución (COUPLE splitPercentage de BD / GROUP equitativo / PERSONAL oculta), settlement card (Te deben / Debes / Saldado), gastos clickeables
- [❌] **MemberBalance Component**: Conectar a datos reales (ya existe UI)
- [✅] **RecentExpensesCard** (Dashboard + Gastos): conectado a expenses reales, navegación al detalle, truncamiento de texto
- [❌] **TopCategory**: Conectar a agregación real por categoría
- [✅] **Reports Screen**: Conectado via `useReportsData` (bar por categoría, donut por miembro, comparación vs período anterior) + filtro de período estilo Movimientos (FilterSheet showCategory=false)

### Criterios de done Sprint 3
- [✅] Dashboard muestra balance real: "Te deben $X" / "Debes $X" / "Saldado"
- [✅] Group Detail muestra hero financiero con totales reales
- [✅] Reports muestran datos reales del período seleccionado
- [✅] No queda mock data en Dashboard, Group Detail, Reports

---

## Sprint 4: Settlements + Payments
**Goal**: Registrar pagos entre usuarios para saldar balances

> **Estado:** El registro de pagos ya está implementado en frontend (vía `PaySheet`/`LiquidacionesSheet` del Group Detail) y el backend de settlements/payments ya está (getSettlement, getSettlementSuggestions). Queda la UI por fuera: pantalla dedicada de Payment History y cards de suggestions.

### Flujo
```
Balance: Emerson debe $70.000 a Andrea
    │
    ▼
Emerson transfiere $70.000 (fuera de la app o integración bancaria)
    │
    ▼
Registrar Payment en app: POST /payments { amount: 70000, toUserId: andrea_id }
    │
    ▼
Balance se actualiza → $0 (SETTLED)
    │
    ▼
Settlements history muestra: "Emerson pagó $70.000 a Andrea el 15/01"
```

### Tareas Sprint 4
- [✅] **Backend**: Verificado — `POST /payments`, `GET /payments`, `POST /payments/:id/confirm`, `POST /payments/:id/reject`, `GET /settlements`, `GET /settlements/suggestions`
- [✅] **Frontend API**: `src/services/api/payments.ts` — payments + settlements (+ confirmPayment/rejectPayment)
- [✅] **Registrar pago / abono parcial** — `PaySheet` en Group Detail (monto editable)
- [✅] **Confirmar/rechazar solicitudes** — `LiquidacionesSheet` (tabs "Por confirmar"/"Historial")
- [✅] **Settlement status card en Group Detail** — con botón "Liquidar" y "Historial de liquidaciones"; sincronizado con el balance (pagos CONFIRMED)
- [❌] **Pay Screen** (standalone)
- [❌] **Payment History** (standalone)
- [❌] **Settlement Suggestions** — Cards "Transfiere $X a Y para saldar"
- [❌] **Dashboard** — Mostrar suggestions si hay balances pendientes

### Criterios de done Sprint 4
- [✅] Usuario puede registrar pago y ver historial
- [❌] Sugerencias automáticas: "Para saldar, transfiere $70.000 a Andrea"
- [✅] Balance cambia a SETTLED tras payment confirmado
- [✅] Settlements endpoint devuelve neto histórico

---

## Sprint 5: Emails (Resend) — MVP

> Backend: MailModule con Resend (ver `duobalance-api/docs/ROADMAP.md` → Phase 6). Correos MVP: verificación · bienvenida · liquidación mensual · forgot password.

- [x] Conectar `forgot-password.tsx` a `POST /auth/forgot-password` (validación email, estados form/sending/sent, "Revisa tu correo", enlace válido 60 min)
- [x] Pantalla `restablecer-contrasena.tsx` (`?token=` → `POST /auth/reset-password`; estados form/submitting/success/error, success → /login)
- [x] **Verificación de correo al registrarse (DONE, verificación estricta)** — registro sin auto-login → pantalla `verificar-correo.tsx` con reenviar (cooldown 60s); `verify-email.tsx` procesa `?token=`; login bloquea hasta verificar; Perfil muestra badge con reenviar

---

## Post-MVP: Polish + Production (v1.0)

| Área | Tareas |
|------|--------|
| **Receipt Capture completo** | OCR, extracción datos, confirmación |
| **Push Notifications** | expo-notifications, permisos, handlers |
| **Dark Mode** | Theme context, toggle, persist |
| **i18n** | Español/Inglés, react-i18next |
| **Offline Support** | React Query / TanStack Query, optimistic updates |
| **Response Interceptor 401** | ✅ Hecho — redirect a login vía `session:expired` + `SessionExpiredAlert` |
| **Forgot Password** | ✅ Sprint 5 (MailModule Resend): backend + frontend connect |
| **App Store Deploy** | EAS Build, TestFlight/Play Console, icons, splash |

---

## v2.0: Multi-Actor Support (Personal / Pareja / Grupo)

> Frontend ya migrado a terminología "Grupos" y selector de tipo en CreateGroupSheet.

### Backend — ✅ ya realizado
- [✅] DB: `couples` → `groups` con columna `type` (PERSONAL|COUPLE|GROUP) — `Group.type` en Prisma
- [✅] DB: `group_members` N:N con `splitPercentage` y `MemberRole`
- [✅] API: endpoints `couples` → `groups`, splits N-way
- [✅] Splits generalizados para N miembros

### Frontend pendiente
- [❌] `grupos/crear.tsx` con selector tipo (Personal/Pareja/Grupo)
- [❌] `grupos/[id]/miembros.tsx` gestión miembros (solo GROUP)
- [❌] Dashboard: selector global de grupo con badge de tipo
- [🔄] Generalizar: `CoupleCard`→`GroupCard`, `PartnerBalance`→`MemberBalance` (GroupCard ya existe en `ui/`, quedan legacy `dashboard/CoupleCard` y `couple/couple-card` por depurar)
- [🔄] Split Picker adaptativo: mayormente hecho en CreateExpenseSheet (PERSONAL sin split, COUPLE Igual/Porcentaje, GROUP equitativo)

### Fases v2.0
| Fase | Actor | Prioridad |
|------|-------|-----------|
| 1 | ❤️ Pareja (conectar API existente) | Alta |
| 2 | 👤 Personal (gastos sin split) | Media |
| 3 | 👥 Grupo (3+ miembros, N-way splits) | Baja |

---

## Timeline Visual

```
Sprint 1  ████████████████████████████  (Expenses CRUD + conectar API real — completo)
Sprint 2  ██████████░░░░░░░░░░░░░░░░░  (Shares persistidos en BD; falta Split Picker N-way)
Sprint 3  ████████████████████████████  (Balance Engine + Dashboard real — completo)
Sprint 4  ██████████░░░░░░░░░░░░░░░░░  (Payments/settlements backend + PaySheet/LiquidacionesSheet hecho; falta Payment History, suggestions UI)
v1.0      ░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Polish: receipts, dark mode, i18n, offline, deploy)
v2.0      ██████░░░░░░░░░░░░░░░░░░░░  (Backend multi-actor hecho; falta frontend v2.0)
Sprint 5  ████████████░░░░░░░░░░░░░░░░  (Emails: verificación + forgot/reset password — hecho; falta liquidación mensual)
```

**Estimación**: 8-12 semanas a v1.0 (4 sprints × 2-3 sem), 6-8 sem más a v2.0