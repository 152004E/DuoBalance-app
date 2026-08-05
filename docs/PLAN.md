# Plan — What's Left to Implement (Frontend)

> **Nota:** El despliegue en tiendas de aplicaciones ocurre ÚNICAMENTE cuando el proyecto alcance estado beta. Hasta entonces todo corre en localhost con Expo Go.

---

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
- ✅ Toda la lógica de negocio existe en backend
- ✅ Recalcula balances en soft-delete (no persiste, se calcula on-demand)
- ✅ Separa Balance vs Settlement (bien diseñado)
- ✅ Dashboard ya devuelve resumen completo del MVP
- 🚧 **Lo único que falta es frontend**: conectar pantallas

### Decisión de producto
**No desarrollar más lógica de negocio. Dedicarse a conectar pantallas.**

### Ejemplo real — Balance Engine ya funciona en backend

```json
{
  "totalExpenses": 300,
  "totalPaidByMe": 200,
  "totalPaidByPartner": 100,
  "myShare": 150,
  "partnerShare": 150,
  "balance": 50,
  "direction": "OWED_TO_ME"
}
```

Tras soft-delete: balance se recalcula automáticamente. Eso demuestra que el cálculo es correcto y reactivo.

### Separación Balance vs Settlement (ya implementada en backend)

| Concepto | Ejemplo |
|----------|---------|
| **Balance** | "Debes 150" (deuda actual) |
| **Settlement** | "Pagaste 50" (pago histórico) |
| **Balance neto** | "Debes 100" (después del pago) |

Backend ya maneja ambos conceptos separados. Frontend solo debe consumirlos.

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

## Legend
- ✅ Done
- 🔄 In Progress / Partial
- ❌ Not Started

---

## Vistas — Estado actual

| Vista | Ruta | Estado |
|-------|------|--------|
| WelcomeScreen | `(auth)/` → `index.tsx` | ✅ |
| Login | `(auth)/login.tsx` | ✅ |
| Register | `(auth)/register.tsx` | ✅ |
| Forgot Password | `(auth)/forgot-password.tsx` | 🔄 UI lista, backend pendiente |
| Dashboard | `(protected)/index.tsx` | ✅ (datos reales via useDashboardData: balance, transacciones, top categoría, aportes; sin mocks) |
| Gastos (lista) | `(protected)/gastos/index.tsx` | ✅ (API connected via getExpenses, load-more) |
| Movimientos | `(protected)/gastos/Movimientos.tsx` | ✅ (lista filtrada: FilterSheet período/categoría + buscador) |
| Add Expense | `(protected)/gastos/add.tsx` | ✅ (standalone form) |
| Expense Detail | `(protected)/gastos/detalle/[id].tsx` | ✅ (API connected: getExpense, updateExpense, deleteExpense; menú Editar/Eliminar funcional) |
| Group List | `(protected)/grupos/index.tsx` | ✅ (API connected via useGroups) |
| Group Detail | `(protected)/grupos/[id].tsx` | ✅ (datos reales: total, distribución, settlement, gastos clickeables; salir/regenerar con alertas) |
| Join Group | `(protected)/grupos/join.tsx` | ✅ (JoinGroupSheet, API connected) |
| Group Expenses | `(protected)/grupos/[id]/gastos.tsx` | ✅ (API connected: getExpenses, createExpense) |
| Reports | `(protected)/reportes.tsx` | ✅ (datos reales via useReportsData + filtro de período estilo Movimientos) |
| Perfil | `(protected)/perfil/index.tsx` | ✅ |
| Editar Perfil | `(protected)/perfil/editar.tsx` | ✅ (API connected, ImagePicker) |
| Notificaciones | `(protected)/perfil/notificaciones.tsx` | ✅ (UI toggles por tipo) |
| Seguridad / Change Password | `(protected)/perfil/seguridad.tsx` | ✅ (validation, API, AlertModal) |
| Acerca de | `(protected)/perfil/acerca.tsx` | ✅ (hero, funcionalidades, historia, stack, versión real vía expo-constants) |
| Group Settings | `(protected)/grupos/[id]/configuracion.tsx` | ✅ (API connected) |
| Pay Screen | `(protected)/pagos/index.tsx` | ❌ |
| Payment History | `(protected)/pagos/` | ❌ |
| Receipt Capture | `(protected)/gastos/receipt.tsx` | ❌ |

---

# Sprint 1: Expenses CRUD + Users + Groups (MVP Core)

**Objetivo**: Registro completo de gastos con categorías, quién pagó, fecha, comprobante, tipo de división.

En esta fase **aún no se muestra quién le debe a quién** (eso es Sprint 3). Solo se guarda la información correctamente.

## ✅ Foundation (transversal)
- [✅] Expo project init (`create-expo-app` con SDK 56)
- [✅] TypeScript strict mode config
- [✅] Navigation setup (Expo Router file-based routing)
- [✅] Styling config (NativeWind v4 + Tailwind CSS v3)
- [✅] Theme configuration (colors, typography, spacing)
- [✅] ESLint + Prettier integration
- [✅] Import aliases (`@components/*`, `@features/*`, `@context/*`, `@storage/*`, etc.)
- [✅] Environment config (`.env` con `EXPO_PUBLIC_*` prefix)
- [✅] API client (Axios instance with request interceptor)
- [✅] Secure token storage (expo-secure-store)
- [✅] API types (all backend DTOs mapped in `src/types/api.ts`)
- [✅] BottomSheet, BottomSheetHeader (backdrop, drag indicator, spring animations)
- [✅] Button (5 variants), Input, Card, Loading, EmptyState, AlertModal
- [✅] PercentageSlider, DistributionBar
- [✅] GroupSection, GroupSelector
- [✅] BottomTab (5 tabs), ScreenHeader, SplashScreen, HeroSection
- [✅] Toast notifications, staggered entrance animations

## ✅ Auth
- [✅] AuthContext + AuthProvider
- [✅] useAuth hook (con token persistence on mount)
- [✅] Route scaffolding ((auth)/ y (protected)/ groups)
- [✅] WelcomeScreen con HeroSection + BenefitCards
- [✅] Login screen (API integration: login → getProfile → signIn)
- [✅] Register screen (register → login → getProfile → signIn → AlertModal)
- [✅] Change password screen (PATCH /auth/password, validation, AlertModal)
- [✅] Edit profile screen (name, email, avatar upload)
- [✅] Protected route wrapper (redirect a login si no token)
- [✅] Token persistence
- [🔄] Forgot password — UI completa, backend endpoint pendiente
- [❌] Response interceptor (401 → redirect a login)

## ✅ Groups (API connected)
- [✅] Group list screen (GroupCard, FloatingAddMenu, JoinGroupSheet, InviteMemberSheet)
- [✅] Create group (`CreateCoupleSheet` con type selector, API connected)
- [✅] Group detail screen (financial hero, settlement status, distribution, expenses — todo con datos reales)
- [✅] Group settings screen (name, split %, members, invite code, regenerate, danger zone)
- [✅] JoinGroupSheet (invite code entry + QR placeholder)
- [✅] Per-group expense list (`grupos/[id]/gastos.tsx` → redirige a Movimientos)
- [✅] useGroups() hook (loads from API, classifies by type, refetch)
- [✅] useGroupSummaries() hook (count + total del mes por grupo, en paralelo)
- [✅] Workspace global (`useWorkspace` + `WorkspaceProvider`) — contexto compartido por todas las pantallas
- [✅] GroupCard component
- [✅] groups.ts API service (full CRUD)
- [✅] Salir de grupo con alertas de éxito/error (AlertModal)

## 🔄 Expenses CRUD — Estado actual
- [✅] **Expense List** (`gastos/index.tsx`) — usa `getExpenses`, filtros por grupo/periodo/categoría funcionales
- [✅] **Expense Detail** (`gastos/detalle/[id].tsx`) — usa `getExpense`, `deleteExpense`, `updateExpense`; UI edit/delete confirmada
- [✅] **Group Expenses** (`grupos/[id]/gastos.tsx`) — redirige a `gastos/Movimientos`, usa `getExpenses`, `createExpense`
- [✅] **CreateExpenseSheet** (bottom sheet: amount, description, category, date, paid-by, participants, split type)
- [✅] **Expense Hero Card** + 6 componentes del detalle (info, participants, split, receipt, timeline, actions)
- [✅] **expenses.ts API service** (create, list, get, update, delete)

## ❌ Sprint 1 — Pendiente
- [✅] **Edit Expense UI** — `CreateExpenseSheet` reutilizado con `initialExpense`/`onUpdateExpense` (modo edición + prefill), desde `ExpenseMenuSheet` o `ExpenseActions`
- [✅] **Delete Expense UI** — confirmación en detail/actions
- [✅] **División en CreateExpenseSheet (decisión de producto)** — PERSONAL sin división; COUPLE siempre ambos (Igual/Porcentaje, default = splitPercentage de la pareja o 50/50); GROUP 3+ solo Igual
- [❌] **Receipt Capture (básico)** — ImagePicker, preview, upload placeholder
- [✅] **Categories** — enum ampliado (FOOD, TRANSPORT, RENT, SERVICES, ENTERTAINMENT, HEALTH, EDUCATION, SHOPPING, SUBSCRIPTIONS, PETS, GIFTS, TRAVEL, OTHER) con catálogo central `src/constants/categories.ts`
- [❌] **Split type guardado** — verificar que `POST /expenses` acepta y guarda `splitType`

### Criterios de done Sprint 1
- Usuario puede crear, ver, editar, eliminar gastos
- Gasto guarda: monto, descripción, categoría, fecha, pagado por, split type
- Lista de gastos muestra datos reales (no mock)
- Filtros por fecha/categoría/grupo funcionan

---

# Sprint 2: Expense Shares + Splits Engine

**Objetivo**: Calcular y persistir la participación de cada miembro al crear un gasto.

Capa crítica que se suele olvidar pero hace el sistema escalable:

```
Expense
├── id: 20
├── amount: 100000
├── paidBy: Andrea
│
└── Genera automáticamente ExpenseShares:
    ├── Andrea: share = 50000
    └── Emerson: share = 50000
```

Una vez persistidas las shares, **ya no necesitas recalcular el reparto** en cada lectura.

## Tipos de Split

| Split Type | Lógica |
|------------|--------|
| **EQUAL** | Monto / N miembros |
| **PERCENTAGE** | Monto × % de cada miembro (configurado en grupo) |
| **CUSTOM** | Usuario define monto exacto por miembro |
| **PERSONAL** | 100% al usuario que paga (grupo tipo PERSONAL) |

## ❌ Sprint 2 — Pendiente

### Backend
- [❌] **Verificar**: `POST /expenses` crea registros en tabla `expense_shares` (o `splits`)
- [❌] **Verificar**: Endpoint acepta payload con `splits: [{ userId, percentage, amount }]`
- [❌] **Verificar**: Schema Prisma tiene tabla `ExpenseShare` (o equivalente)
- [❌] **Endpoint**: `GET /expenses/:id` devuelve shares con datos del usuario (UserBrief)

### Frontend
- [✅] **CreateExpenseSheet — división por decisión de producto**: calcula shares en cliente; PERSONAL sin split; COUPLE siempre ambos con EQUAL/PERCENTAGE (default = splitPercentage de la pareja o 50/50); GROUP 3+ solo EQUAL con selector de participantes
- [✅] **ExpenseDetail** — `ExpenseSplit` component conectado a shares reales
- [✅] **EditExpenseSheet** — recalcula shares al editar (mismo sheet en modo edición)
- [✅] **Validación** — suma de splits = 100% en EQUAL/PERCENTAGE
- [✅] **Adaptado a tipos de grupo**:
  - PERSONAL (1 miembro): sin split, 100% al usuario
  - COUPLE (2): EQUAL o PERCENTAGE
  - GROUP (N): solo EQUAL

### Criterios de done Sprint 2
- Al crear gasto, se persisten shares correctos en backend
- UI muestra preview: "Andrea paga $50.000, Emerson debe $50.000"
- Split Picker funciona para los 4 tipos
- Edit expense recalcula shares
- `GET /expenses/:id` devuelve shares con info del usuario

---

# Sprint 3: Balance Engine + Dashboard Real

**Objetivo**: Agregar shares → balance por usuario → mostrar en Dashboard y Group Detail.

## Fórmula (algoritmo pequeño)

```
Para cada usuario en un grupo:
  paid   = SUM(expenses WHERE paidBy = user)
  share  = SUM(expense_shares WHERE userId = user)
  balance = paid - share

  direction:
    balance > 0  → OWED_TO_ME  (me deben)
    balance < 0  → I_OWE       (debo)
    balance = 0  → SETTLED     (saldado)
```

## ❌ Sprint 3 — Pendiente

### Backend (verificar)
- [❌] `GET /balances` — agregación global por usuario
- [❌] `GET /groups/:id/balance` — balance por grupo
- [❌] `GET /dashboard` — summary del dashboard
- [❌] `GET /reports` (o equivalente) — agregaciones para Reports

### Frontend API services (crear)
- [❌] `src/services/api/balances.ts` — getBalances, getGroupBalance
- [❌] `src/services/api/dashboard.ts` — getDashboard (obsoleto como prerrequisito: Dashboard ya conectado client-side vía `useDashboardData` + `getExpenses`)

### Pantallas a conectar con API real
- [✅] **Dashboard** (`index.tsx`) — conectado via `useDashboardData` (balance neto por workspace, transacciones del mes, top categoría, aportes Tú vs resto) + `useGroupSummaries` en las cards
- [✅] **Group Detail** (`grupos/[id].tsx`) — conectado: total real via `getExpenses`, barra de distribución según tipo (COUPLE splitPercentage / GROUP equitativo / PERSONAL oculto), settlement card (Te deben / Debes / Saldado), gastos recientes clickeables
- [✅] **Reports** (`reportes.tsx`) — conectado via `useReportsData` (agregación por categoría y por miembro, comparación vs período anterior) + filtro de período (Este mes / Últimos 3 meses / Este año / Todo)

### Componentes a conectar
- [❌] **MemberBalance** component — conectar a balance real
- [✅] **RecentExpensesCard** (Dashboard + Gastos) — conectado a expenses reales, con navegación al detalle y truncamiento de textos largos
- [❌] **TopCategory** — conectar a agregación real por categoría
- [❌] **DonutChart / BarChart** — alimentar con datos reales

### Criterios de done Sprint 3
- Dashboard muestra balance real: "Te deben $X" / "Debes $X" / "Saldado"
- Group Detail muestra hero financiero con totales reales
- Reports muestran datos reales del período seleccionado
- No queda mock data en Dashboard, Group Detail, Reports

---

# Sprint 4: Settlements + Payments

**Objetivo**: Registrar pagos entre usuarios para saldar balances.

## Flujo completo

```
Balance: Emerson debe $70.000 a Andrea
    │
    ▼
Emerson transfiere $70.000 (fuera de la app o integración bancaria futura)
    │
    ▼
Registrar Payment en app:
    POST /payments { amount: 70000, toUserId: andrea_id, groupId }
    │
    ▼
Balance se actualiza → $0 (SETTLED)
    │
    ▼
Settlements history muestra:
    "Emerson pagó $70.000 a Andrea el 15/01/2026"
```

## ❌ Sprint 4 — Pendiente

### Backend (verificar)
- [❌] `POST /payments` — registrar pago entre usuarios
- [❌] `GET /payments` — historial de pagos (con filtros)
- [❌] `GET /settlements` — neto histórico por grupo
- [❌] `GET /settlements/suggestions` — algoritmo "quién le debe a quién"

### Frontend API services
- [✅] `src/services/api/payments.ts` — createPayment, getPayments, getSettlement, getSettlementSuggestions (backend ya soporta `?groupId=` para todos los endpoints)
- [❌] `src/services/api/settlements.ts` — (consolidado en `payments.ts`)

### Pantallas
- [❌] **Pay Screen** (`pagos/index.tsx`) — seleccionar monto, confirmar pago, registrar en API
- [❌] **Payment History** — lista de pagos realizados/recibidos
- [❌] **Settlement Suggestions** — cards "Transfiere $X a Y para saldar"
- [❌] **Dashboard** — sección de suggestions si hay balances pendientes
- [❌] **Group Detail** — settlement status card con botón "Saldar"

### Criterios de done Sprint 4
- Usuario puede registrar pago y ver historial
- Sugerencias automáticas: "Para saldar, transfiere $70.000 a Andrea"
- Balance cambia a SETTLED tras payment
- Settlements endpoint devuelve neto histórico

---

# Post-MVP: Polish + Production (v1.0)

| Área | Tareas |
|------|--------|
| **Receipt Capture completo** | OCR, extracción datos, confirmación |
| **Push Notifications** | expo-notifications, permisos, handlers |
| **Dark Mode** | Theme context, toggle, persist |
| **i18n** | Español/Inglés, react-i18next |
| **Offline Support** | React Query / TanStack Query, optimistic updates |
| **Response Interceptor 401** | Redirect a login en axios interceptor |
| **Forgot Password** | Backend endpoint + frontend connect |
| **App Store Deploy** | EAS Build, TestFlight/Play Console, icons, splash |

- [❌] Push notifications (expo-notifications)
- [❌] Dark mode
- [❌] i18n (multi-language)
- [❌] Offline support
- [✅] App icon + splash screen
- [✅] Staggered entrance animations

---

# Phase Deployment — Beta

> Todo el desarrollo previo corre en localhost con Expo Go. Solo al llegar a beta se despliega.

- [❌] Conectar con backend desplegado (URL de producción)
- [❌] Generar APK con EAS Build (`eas build --platform android`)
- [❌] Pruebas en dispositivo físico con APK
- [❌] App store submission (Google Play)
- [❌] Preparar versión iOS (App Store)

---

# Fase Post-MVP: Multi-actor Support (v2.0+)

Una vez completado el MVP (Sprints 1-4 completos), se generaliza la plataforma para soporte de **tres tipos de actores**.

> **Nota**: El frontend ya comenzó esta migración. Las rutas están en `grupos/`, la terminología usa "Grupos", y `CreateCoupleSheet` ya incluye un selector de tipo.

| Tipo | Emoji | Descripción | Miembros máx | Split típico |
|------|-------|-------------|--------------|--------------|
| Personal | 👤 | Control financiero individual | 1 | No aplica |
| Pareja | ❤️ | Gastos compartidos entre dos | 2 | 50/50, % personalizado |
| Grupo | 👥 | Roommates, familia, viaje, amigos | N (3+) | Equal, %, por producto |

## ✅ Ya implementado en frontend

| Cambio | Estado |
|--------|--------|
| Rutas renombradas `pareja/` → `grupos/` | ✅ Completo |
| Tab "Grupos" en lugar de "Parejas" | ✅ Completo |
| Terminología "Grupos", "Miembros" | ✅ En su mayoría |
| `CreateCoupleSheet` con selector de tipo | ✅ Completo |
| `JoinGroupSheet` con entrada de código | ✅ Completo |
| `GroupSelector` UI component | ✅ Completo |

## ❌ Pendiente para v2.0 (backend + frontend)

### Backend
1. **Base de datos**
   - Tabla `groups` (reemplaza `couples`): agregar columna `type: PERSONAL | COUPLE | GROUP`
   - Tabla `group_members`: relación N:N con roles opcionales
   - `splits`: soportar N miembros en vez de solo 2

2. **API**
   - Endpoints de `couples` → `groups`
   - `POST /groups` con `type` selector
   - `GET /groups` devuelve todos los grupos del usuario
   - Lógica de splits generalizada para N personas

3. **Modelo de datos**

```
Groups
├── id
├── name
├── type (PERSONAL | COUPLE | GROUP)
├── inviteCode
├── createdAt

GroupMembers
├── id
├── groupId
├── userId
├── splitPercentage (nullable)

Expenses
├── id
├── groupId (FK → groups)
├── paidById
├── amount
├── category
├── splitType (EQUAL | PERCENTAGE | CUSTOM | PERSONAL)

ExpenseShares (Sprint 2 — capa crítica)
├── id
├── expenseId
├── userId
├── shareAmount (lo que le toca)
├── percentage (% aplicado)
└── createdAt
```

### Frontend (pendiente)
1. **Nuevas pantallas**
   - `grupos/crear.tsx` con selector de tipo (Personal/Pareja/Grupo)
   - `grupos/[id]/miembros.tsx` listado y gestión de miembros (solo GROUP)
   - Dashboard: selector de grupo global con indicador de tipo

2. **Componentes a generalizar**
   - `CoupleSelector` → `GroupSelector`
   - `CoupleCard` → `GroupCard` (con badge de tipo)
   - `PartnerBalance` → `MemberBalance` (soporta N miembros)
   - `CreateCoupleSheet` → `CreateGroupSheet`

3. **Split picker adaptativo** (relacionado con Sprint 2)
   - PERSONAL: sin split (100% usuario)
   - COUPLE: 50/50, %, o personal
   - GROUP: equal, %, o custom por producto

### Fases de implementación

| Fase | Actor | Prioridad |
|------|-------|-----------|
| 1 | ❤️ Pareja (conectar API existente, base del MVP) | Alta |
| 2 | 👤 Personal (modo individual, sin splits) | Media |
| 3 | 👥 Grupo (3+ miembros, splits N-way) | Baja |

---

# Decisiones de Diseño — Routing de Gastos

### Problema
El tab Gastos no debe competir con Grupos. Ambos necesitan acceso a la creación de gastos, pero con comportamientos distintos.

### Solución adoptada
**Una sola pantalla `add.tsx` reutilizada desde múltiples flujos**, en lugar de duplicar formularios o anidar gastos dentro de grupos.

### Estructura de rutas
```
(protected)/gastos/
  ├── _layout.tsx     ← Stack
  ├── index.tsx       ← Lista de gastos con filtros
  ├── add.tsx         ← Formulario único de creación
  └── [id].tsx        ← Detalle del gasto
```

### Flujo 1: Desde Grupos (contextual)
```
❤️ Grupos → Andrea → [Registrar gasto]
  → router.push('/gastos/add?groupId=123')
  → add.tsx detecta groupId → bloquea selector de grupo
  → Usuario ve: Grupo ✓ Andrea (solo lectura)
  → Guardar → POST /expenses → router.back() → vuelve al detalle de Andrea
```

### Flujo 2: Desde Gastos (genérico)
```
💸 Gastos → FAB +
  → router.push('/gastos/add')
  → add.tsx sin groupId → muestra dropdown para elegir grupo
  → Usuario ve: Grupo ▼ Selecciona un grupo
  → Guardar → POST /expenses → router.back() → vuelve a la lista de Gastos
```

### Comportamiento post-guardado
- El gasto aparece inmediatamente en ambos lugares:
  - **Grupo/Andrea**: en "Gastos Recientes"
  - **Gastos**: en la lista general con filtros
- El resumen financiero del grupo se actualiza al regresar
- No hay duplicación de lógica: un solo componente de formulario,
  un solo endpoint, un solo `router.back()`

---

# Prioridad de implementación (resumen)

## 🔴 P0 — Inmediato (Sprint 1)
- Edit/Delete Expense UI
- Split Picker Component
- Verificar expense screens conectados a API real

## 🟡 P1 — Sprints 2-3
- Expense Shares persistidas en backend
- Balance Engine (API + cálculo)
- Dashboard con datos reales
- Reports con datos reales

## 🟢 P2 — Sprint 4
- Payments API service
- Pay Screen
- Payment History
- Settlement Suggestions

## 🔵 P3 — Post-MVP
- Receipt Capture (OCR completo)
- Polish: dark mode, i18n, offline, push, 401 interceptor
- Deployment (EAS Build + stores)

## 🟣 P4 — v2.0
- Multi-actor (Personal/Pareja/Grupo) — backend DB + N-way splits