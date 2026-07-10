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
| Dashboard | `(protected)/index.tsx` | ✅ (mock data) |
| Gastos (lista) | `(protected)/gastos/index.tsx` | 🚧 HeroSection + "Próximamente..." placeholder |
| Add Expense | `(protected)/gastos/add.tsx` | 🚧 Stub navegable |
| Expense Detail | `(protected)/gastos/[id].tsx` | 🚧 Stub navegable |
| Couple List | `(protected)/pareja/index.tsx` | ✅ (mock data) |
| Couple Detail | `(protected)/pareja/[id].tsx` | ✅ (mock data) |
| Join Couple | `(protected)/pareja/join.tsx` | ❌ |
| Reports | `(protected)/reportes.tsx` | ✅ (mock data) |
| Perfil | `(protected)/perfil.tsx` | ✅ (avatar, user info, menu options, logout) |
| Group Settings | `(protected)/pareja/[id]/configuracion.tsx` | ✅ (name, split %, members, invite code, notifications, danger zone — mock data) |
| Pay Screen | `(protected)/pagos/index.tsx` | ❌ |
| Payment History | `(protected)/pagos/` | ❌ |
| Receipt Capture | `(protected)/gastos/receipt.tsx` | ❌ |

## Prioridad de implementación

### P1 — Imprescindibles (MVP)
- [❌] Split Picker Component — prerrequisito del Add Expense
- [❌] Expense List Screen — reemplazar placeholder de Gastos
- [❌] Add Expense Screen — core de la app (ver diseño detallado abajo)
- [❌] Conectar botón "Registrar gasto" en detalle de grupo → `gastos/add?groupId=123`
- [❌] Expense Detail Screen — tap en lista lleva aquí
- [✅] Profile Screen — avatar, user info, menu options, logout
- [✅] Group Settings Screen — nombre, split %, miembros, notificaciones, zona peligrosa
- [❌] Join Group — completar flujo de unión

### P2 — Importantes
- [❌] Backend API — Dashboard
- [❌] Backend API — Groups
- [❌] Backend API — Reports
- [❌] Expense Edit Mode
- [❌] Backend API — Expenses
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
- [✅] Group list screen — cards, invite code display/copy/refresh, FloatingAddMenu (FAB → create/join group bottom sheet), group menu sheet, invite member sheet
- [✅] Group creation bottom sheet — name, percentage split slider, generate invite code, type selector (PERSONAL/COUPLE/GROUP)
- [✅] Group detail screen — balance cards (owed/debt/settled), distribution bar, transactions, settings (leave group), group menu sheet, invite member sheet
- [✅] Group settings screen — name, split %, members, invite code, type, notifications, danger zone (mock data)
- [❌] Join group via invite code (enter code form)
- [❌] Backend API integration (currently mock data)

## Phase 4: Expense Screens
- [❌] Expense list screen (flat list with category filters + group filter)
- [❌] Add expense screen (amount, description, category, split picker)
- [❌] Expense detail screen (full info + edit/delete)
- [❌] Split picker UI component (equal/percentage/custom)

## Phase 5: Dashboard
- [✅] Dashboard screen — HeroSection, BalanceCard, GroupSelector (mock data)
- [✅] Partner/Member balance display (MemberBalance component)
- [✅] Category breakdown chart (DonutChart component)
- [✅] Recent transactions list (RecentTransactions component)
- [✅] Floating action button (FloatingAddButton)
- [❌] Settlement suggestions list
- [❌] Backend API integration (currently mock data)

## Phase 6: Reports & Analytics
- [✅] Reports screen — period filter, donut chart, top categories, stats cards (mock data)
- [❌] Reports backend API integration

## Phase 7: New UI Components
- [✅] BottomSheet — reusable modal with backdrop, drag indicator, spring animations
- [✅] PercentageSlider — animated slider with gradient fill
- [✅] DistributionBar — stacked horizontal distribution bar
- [✅] Button — reusable with 5 variants (primary/secondary/outline/danger/link)
- [✅] AlertModal — reusable with 4 types, BlurView backdrop
- [✅] Card, Loading, EmptyState — all generic primitives
- [✅] Layout components — BottomTab (5 tabs), ScreenHeader, SplashScreen, HeroSection (unified dashboard/page variants)
- [✅] Dashboard components — BalanceCard, GroupSelector, MemberBalance, RecentTransactions, FloatingAddButton, FloatingAddMenu, TopCategory, AddGroupCard, BarChart, DonutChart
- [✅] Group components — GroupCard, InviteCodeCard, CreateGroupSheet

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

Una vez completado el MVP (frontend + backend conectados), se generaliza la plataforma para que no esté limitada a parejas, sino que soporte **tres tipos de actores**:

| Tipo | Emoji | Descripción | Miembros máx | Split típico |
|------|-------|-------------|--------------|--------------|
| Personal | 👤 | Control financiero individual | 1 | No aplica |
| Pareja | ❤️ | Gastos compartidos entre dos | 2 | 50/50, % personalizado |
| Grupo | 👥 | Roommates, familia, viaje, amigos | N (3+) | Equal, %, por producto |

### Cambios necesarios en backend

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

### Cambios necesarios en frontend

1. **Terminología**
   - "Parejas" → "Grupos" en tabs, menús, títulos
   - "Tu pareja" → "Miembros"
   - "Crear pareja" → "Crear grupo" con selector de tipo

2. **Rutas**
   - `(protected)/pareja/` → `(protected)/grupos/`
   - `(protected)/pareja/[id]` → `(protected)/grupos/[id]`
   - Mantener redirects por compatibilidad

3. **Nuevas pantallas**
   - `grupos/crear.tsx` con selector de tipo (Personal/Pareja/Grupo)
   - `grupos/[id]/miembros.tsx` listado y gestión de miembros (solo GROUP)
   - Dashboard: selector de grupo global con indicador de tipo

4. **Componentes a generalizar**
   - `CoupleSelector` → `GroupSelector`
   - `CoupleCard` → `GroupCard` (con badge de tipo)
   - `PartnerBalance` → `MemberBalance` (soporta N miembros)
   - `CreateCoupleSheet` → `CreateGroupSheet` con tipo seleccionable

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
