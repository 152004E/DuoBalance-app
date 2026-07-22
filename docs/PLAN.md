# Plan — What's Left to Implement (Frontend)

> **Nota:** El despliegue en tiendas de aplicaciones ocurre ÚNICAMENTE cuando el proyecto alcance estado beta. Hasta entonces todo corre en localhost con Expo Go.

## Legend
- ✅ Done
- 🔄 In Progress / Partial
- ❌ Not Started

## Vistas — Estado actual

| Vista | Ruta | Estado |
|-------|------|--------|
| WelcomeScreen | `(auth)/` → `index.tsx` | ✅ |
| Login | `(auth)/login.tsx` | ✅ |
| Register | `(auth)/register.tsx` | ✅ |
| Forgot Password | `(auth)/forgot-password.tsx` | 🚧 UI lista, backend pendiente |
| Dashboard | `(protected)/index.tsx` | ✅ (groups from API via useGroups, mock balance/transactions) |
| Gastos (lista) | `(protected)/gastos/index.tsx` | ✅ (expense list with filters) |
| Add Expense | `(protected)/gastos/add.tsx` | ✅ (standalone form) |
| Expense Detail | `(protected)/gastos/detalle/[id].tsx` | ✅ (hero, info, participants, split, receipt, timeline, actions) |
| Group List | `(protected)/grupos/index.tsx` | ✅ (API connected via useGroups, group filtering by type) |
| Group Detail | `(protected)/grupos/[id].tsx` | ✅ (API connected) |
| Join Group | `(protected)/grupos/join.tsx` | ✅ (JoinGroupSheet implemented as bottom sheet, API connected) |
| Group Expenses | `(protected)/grupos/[id]/gastos.tsx` | ✅ (date/category filters, CreateExpenseSheet) |
| Reports | `(protected)/reportes.tsx` | ✅ (mock data) |
| Perfil | `(protected)/perfil.tsx` | ✅ (avatar, user info, menu options, logout) |
| Group Settings | `(protected)/grupos/[id]/configuracion.tsx` | ✅ (name, split %, members, invite code, regenerate code, notifications, danger zone — API connected) |
| Pay Screen | `(protected)/pagos/index.tsx` | ❌ |
| Payment History | `(protected)/pagos/` | ❌ |
| Receipt Capture | `(protected)/gastos/receipt.tsx` | ❌ |

## Prioridad de implementación

### P1 — Imprescindibles (MVP)
- [❌] Split Picker Component — prerrequisito del Add Expense
- [✅] Expense List Screen — reemplazar placeholder de Gastos
- [✅] Add Expense Screen — core de la app
- [✅] Conectar botón "Registrar gasto" en detalle de grupo → CreateExpenseSheet
- [✅] Expense Detail Screen — tap en lista lleva aquí
- [✅] Profile Screen — avatar, user info, menu options, logout
- [✅] Group Settings Screen — nombre, split %, miembros, notificaciones, zona peligrosa
- [✅] Join Group — completar flujo de unión

### P2 — Importantes
- [✅] Backend API — Groups (CREATE `src/services/api/groups.ts`)
- [❌] Backend API — Expenses (CREATE `src/services/api/expenses.ts`)
- [❌] Backend API — Dashboard (CREATE `src/services/api/dashboard.ts`)
- [❌] Backend API — Reports
- [❌] Backend API — Payments/Settlements (CREATE `src/services/api/payments.ts`)
- [❌] Expense Edit Mode
- [❌] Response Interceptor 401

### P3 — Mejoras
- [❌] Settlement + Payment screens
- [❌] Receipt Capture
- [❌] Forgot Password backend
- [❌] Polish (dark mode, i18n, offline, notificaciones)

## Phase 1: Foundation
- [✅] Expo project init (`create-expo-app` with SDK 56)
- [✅] TypeScript strict mode config
- [✅] Navigation setup (Expo Router file-based routing)
- [✅] Styling config (NativeWind v4 + Tailwind CSS v3)
- [✅] Theme configuration (colors, typography, spacing)
- [✅] ESLint + Prettier integration
- [✅] Import aliases (`@components/*`, `@features/*`, `@context/*`, `@storage/*`, etc.)
- [✅] Environment config (`.env` with `EXPO_PUBLIC_*` prefix)
- [✅] API client (Axios instance with request interceptor)
- [✅] Secure token storage (expo-secure-store)
- [✅] API types (all backend DTOs mapped in `src/types/api.ts`)

## Phase 2: Auth Screens
- [✅] Auth context/provider (AuthContext + AuthProvider)
- [✅] useAuth hook (with token persistence on mount)
- [✅] Route scaffolding ((auth)/ and (protected)/ groups)
- [✅] WelcomeScreen with HeroSection + BenefitCards
- [✅] Enhanced Input component (iconLeft, focus border with instant green + blur border reset)
- [✅] Reusable auth components (AuthHeader, AuthDivider, SocialLoginButton, AuthFooter)
- [✅] Login screen (email + password form) — UI + full API integration (authService.login → getProfile → signIn)
- [✅] Register screen (firstName + lastName + email + password) — UI + full API integration (register → login → getProfile → signIn → AlertModal → dashboard)
- [🔄] Forgot password screen — UI complete (email form), pending backend connection + endpoint
- [✅] Custom AlertModal component (success/error/warning/info, BlurView backdrop, animated)
- [✅] Toast notifications via react-native-toast-message (configured in root layout)
- [✅] Root layout with AuthProvider + conditional routing (index.tsx)
- [✅] Protected route wrapper (redirect to login if no token)
- [✅] Token persistence — use-auth reads stored token on mount and triggers auth state
- [❌] Response interceptor (401 → redirect to login)

## Phase 3: Group Management (antes "Couple Management")
- [✅] Group list screen — GroupCard, GroupSection, FloatingAddMenu (FAB → create/join group bottom sheet), group menu sheet, invite member sheet, JoinGroupSheet
- [✅] Group creation bottom sheet — name, percentage split slider, generate invite code, type selector (PERSONAL/COUPLE/GROUP) — connected to API
- [✅] Group detail screen — financial hero card, settlement status, distribution bar, expenses, settings, group menu sheet, invite member sheet — connected to API
- [✅] Group settings screen — name, split %, members, invite code, regenerate code, type, notifications, danger zone — connected to API
- [✅] JoinGroupSheet — bottom sheet with invite code entry form + QR scanner placeholder — connected to API
- [✅] Per-group expense list (`grupos/[id]/gastos.tsx`) — date/category filters, RecentExpensesCard, CreateExpenseSheet
- [✅] useGroups() hook — loads groups from API, classifies by type (PERSONAL/COUPLE/GROUP), exposes refetch
- [✅] GroupCard component — reusable card with type icon, member count, balance, optional menu
- [✅] GroupSection component — reusable section with horizontal/vertical orientation
- [✅] groups.ts API service — full CRUD (create, join, list, get, update, delete, archive, regenerate invite, remove member, update split)
- [❌] **Reemplazar balance mock en GroupCard por balance real del backend** — Pendiente endpoint `GET /groups/:id/balance`

## Phase 4: Expense Screens
- [✅] Expense list screen (flat list with category filters + group filter)
- [✅] Add expense screen (amount, description, category, split picker)
- [✅] Expense detail screen (full info with hero, info, participants, split, receipt, timeline, actions)
- [❌] Split picker UI component (equal/percentage/custom) — pending

## Phase 5: Dashboard
- [✅] Dashboard screen — HeroSection, GroupSection (groups from API), MemberBalance, TopCategory, RecentTransactions, FloatingAddButton
- [✅] Partner/Member balance display (MemberBalance component)
- [✅] Category breakdown chart (DonutChart component)
- [✅] Recent transactions list (RecentTransactions component)
- [✅] Floating action button (FloatingAddButton)
- [❌] Settlement suggestions list
- [❌] Backend API integration for dashboard/balances (mock data remains)

## Phase 6: Reports & Analytics
- [✅] Reports screen — period filter, donut chart, top categories, stats cards (mock data)
- [❌] Reports backend API integration

## Phase 7: New UI Components
- [✅] BottomSheet — reusable modal with backdrop, drag indicator, spring animations
- [✅] BottomSheetHeader — reusable header with premium gradients, spring transitions, safe-area insets
- [✅] PercentageSlider — animated slider with gradient fill
- [✅] DistributionBar — stacked horizontal distribution bar
- [✅] Button — reusable with 5 variants (primary/secondary/outline/danger/link)
- [✅] AlertModal — reusable with 4 types, BlurView backdrop
- [✅] Card, Loading, EmptyState — all generic primitives
- [✅] Layout components — BottomTab (5 tabs), ScreenHeader, SplashScreen, HeroSection (unified dashboard/page variants)
- [✅] Dashboard components — BalanceCard, MemberBalance, RecentTransactions, FloatingAddButton, FloatingAddMenu, TopCategory, AddGroupCard, BarChart, DonutChart
- [✅] Group components — GroupCard, GroupSection, GroupSelector, InviteCodeCard, CreateGroupSheet, CoupleMenuSheet, InviteMemberSheet, JoinGroupSheet

## Phase 8: Receipt Capture
- [❌] Camera/gallery integration (expo-image-picker / expo-camera)
- [❌] Receipt preview screen
- [❌] Upload progress indicator
- [❌] Extracted data confirmation screen

## Phase 9: Payment Screens
- [❌] Pay screen (select amount, confirm payment)
- [❌] Payment history list
- [❌] Settlement suggestion cards

## Phase 10: Polish
- [❌] Push notifications (expo-notifications)
- [❌] Dark mode
- [❌] i18n (multi-language)
- [❌] Offline support
- [✅] App icon + splash screen
- [✅] Staggered entrance animations on auth screens (Logo, Title, Inputs, Buttons)

## Phase 11: Deployment — Beta
> Todo el desarrollo previo corre en localhost con Expo Go. Solo al llegar a beta se despliega.
- [❌] Conectar con backend desplegado (URL de producción)
- [❌] Generar APK con EAS Build (`eas build --platform android`)
- [❌] Pruebas en dispositivo físico con APK
- [❌] App store submission (Google Play)
- [❌] Preparar versión iOS (App Store)

---

## Fase Post-MVP: Multi-actor Support (v2.0+)

Una vez completado el MVP (frontend + backend conectados), se generaliza la plataforma para que no esté limitada a parejas, sino que soporte **tres tipos de actores**.

> **Nota importante:** El frontend ya comenzó esta migración. Las rutas están en `grupos/` (no `pareja/`), la terminología usa "Grupos", y `CreateCoupleSheet` ya incluye un selector de tipo (personal/pareja/grupo). Lo que falta es la migración del backend y conectar los endpoints de grupos.

| Tipo | Emoji | Descripción | Miembros máx | Split típico |
|------|-------|-------------|--------------|--------------|
| Personal | 👤 | Control financiero individual | 1 | No aplica |
| Pareja | ❤️ | Gastos compartidos entre dos | 2 | 50/50, % personalizado |
| Grupo | 👥 | Roommates, familia, viaje, amigos | N (3+) | Equal, %, por producto |

### ✅ Ya implementado en frontend

| Cambio | Estado |
|--------|--------|
| Rutas renombradas `pareja/` → `grupos/` | ✅ Completo |
| Tab "Grupos" en lugar de "Parejas" | ✅ Completo |
| Terminología "Grupos", "Miembros" | ✅ En su mayoría |
| `CreateCoupleSheet` con selector de tipo | ✅ Completo |
| `JoinGroupSheet` con entrada de código | ✅ Completo |
| `GroupSelector` UI component | ✅ Completo |

### ❌ Pendiente para v2.0 (backend + frontend)

#### Backend
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
├── groupId (FK → groups, no coupleId)
├── paidById
├── amount
├── category
├── splitType (EQUAL | PERCENTAGE | CUSTOM | PERSONAL)

Splits
├── id
├── expenseId
├── userId
├── percentage
├── amount
```

#### Frontend (pendiente)
1. **Nuevas pantallas**
   - `grupos/crear.tsx` con selector de tipo (Personal/Pareja/Grupo)
   - `grupos/[id]/miembros.tsx` listado y gestión de miembros (solo GROUP)
   - Dashboard: selector de grupo global con indicador de tipo

2. **Componentes a generalizar**
   - `CoupleSelector` → `GroupSelector`
   - `CoupleCard` → `GroupCard` (con badge de tipo)
   - `PartnerBalance` → `MemberBalance` (soporta N miembros)
   - `CreateCoupleSheet` → `CreateGroupSheet`

5. **Split picker**
   - PERSONAL: sin split (100% usuario)
   - COUPLE: 50/50, %, o personal
   - GROUP: equal, %, o custom por producto

### Fases de implementación

| Fase | Actor | Prioridad |
|------|-------|-----------|
| 1 | ❤️ Pareja (ya implementado, conectar API) | Alta |
| 2 | 👤 Personal (modo individual, sin splits) | Media |
| 3 | 👥 Grupo (3+ miembros, splits N-way) | Baja |

---

## Decisiones de Diseño — Routing de Gastos

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
