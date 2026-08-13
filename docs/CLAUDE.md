# CLAUDE.md — AI Context for DuoBalance

## Project Overview
DuoBalance is a shared expense tracking app for couples. It consists of:
- **duobalance-api**: NestJS backend (TypeScript, Prisma, PostgreSQL) — auth, couples, expenses CRUD, balances, payments, settlements, dashboard
- **DuoBalance-app**: React Native + Expo SDK 56 mobile client (auth flow complete, couple/dashboard/reports screens implemented)

> **Decisión de plataforma (web-first):** DuoBalance inicia como aplicación **web** (Expo Web, `pnpm web`). El soporte móvil (Android/iOS vía Expo Go → EAS build) se agregará **solo cuando el producto avance**. Toda UI/UX y todo componente debe funcionar primero en navegador. No preguntar por esta decisión: está tomada. Implicación práctica: **no usar `Alert.alert` de React Native (es un no-op en web)** — usar siempre el `AlertModal` custom de la app y el helper `extractErrorMessage` de `src/utils/errors.ts` para mostrar errores de la API.

## Current State
### Auth — Fully implemented
- **WelcomeScreen**: Landing page with HeroSection (SVG gradient), BenefitCards, and CTA buttons ✅
- **API Client**: Axios instance with base URL and timeout ✅
- **Request Interceptor**: Injects Bearer token from SecureStore ✅
- **Secure Storage**: expo-secure-store wrapper for token + user data ✅
- **Auth Context**: AuthContext + AuthProvider with signIn/signOut/restoreSession ✅
- **useAuth Hook**: useContext wrapper with guard (also checks token on mount for persistence) ✅
- **API Types**: Full backend DTOs and response types in `src/types/api.ts` (includes Groups, Expenses, Payments, Dashboard) ✅
- **Route Scaffolding**: (auth)/ and (protected)/ route groups created ✅
- **Protected Route Guard**: Redirects to /login if no user ✅
- **Conditional Routing**: index.tsx shows WelcomeScreen or redirects to Dashboard ✅
- **Login Screen**: Full implementation with form validation, API integration (login → getProfile → signIn); bloquea con mensaje claro si el correo no está verificado (403) ✅
- **Register Screen**: Full implementation **sin auto-login** — tras registrar redirige a `(auth)/verificar-correo`; el usuario debe verificar su correo antes de iniciar sesión (verificación estricta) ✅
- **Verificación de correo**: `verificar-correo.tsx` (confirmación post-registro con reenvío + cooldown 60s) y `verify-email.tsx` (procesa `?token=` del link del correo, estados verifying/success/error/no-token) ✅
- **Forgot Password Screen**: UI complete, pending backend endpoint 🔄
- **Auth Components**: AuthHeader, AuthDivider, SocialLoginButton, AuthFooter — all reusable ✅
- **Token persistence**: Fixed — use-auth now reads stored token on mount and calls onAuthStateChanged ✅
- **Response interceptor (401)**: ✅ **implementado** — `src/services/api/interceptor.ts` intenta refresh con el token de refresco (cola las peticiones pendientes); si no hay refresh token o el refresh falla, emite el evento `session:expired` vía `eventEmitter`. `SessionExpiredAlert` (`src/components/auth/session-expired-alert.tsx`, montado en `src/app/_layout.tsx`) escucha el evento y muestra un AlertModal "Sesión expirada" que redirige a `/login` (auto-redirect tras 15s, o al pulsar "Iniciar sesión")

### UI Components — All built
- **Enhanced Input**: iconLeft, iconRight, onIconRightPress, secureTextEntry toggle (auto eye/eye-slash), focus border (instant green on focus, instant reset on blur), dynamic padding ✅
- **AlertModal**: Custom modal with BlurView backdrop, 4 types (success/error/warning/info), spring animations ✅
- **Toast notifications**: react-native-toast-message configurado en root layout con `appToastConfig` (componente `src/components/ui/app-toast.tsx`) — toasts **arriba a la derecha** con variantes success (verde) y error (rojo); usados al crear gastos y grupos ✅
- **Button**: Reusable styled button with 5 variants (primary/secondary/outline/danger/link), loading spinner, icon support ✅
- **Card**: Generic card with default/highlight variants ✅
- **Loading**: Full-screen loading spinner ✅
- **EmptyState**: Empty state placeholder with icon, title, subtitle, action button ✅
- **BottomSheet**: Reusable bottom sheet modal with backdrop press, drag indicator, spring animations, variable height, TransitionState lifecycle (Idle/Opening/Closing), synchronized header/sheet/overlay exit, and `onOpenComplete`/`onCloseComplete` callbacks ✅
- **BottomSheetHeader**: Reusable header for bottom sheets with premium gradients, spring transitions, safe-area insets, and adjustable translation/height configs ✅
- **PercentageSlider**: Animated percentage slider with gradient fill, min/max caps ✅
- **DistributionBar**: Horizontal stacked distribution bar with percentage labels and legends ✅
- **GroupSection**: Reusable section component for rendering grouped lists (horizontal/vertical) with type-based classification ✅
- **GroupSelector**: Dropdown-style group selector for filtering groups on dashboard and list screens ✅

### Screens — Implemented
- **Dashboard** (`(protected)/index.tsx`): Dashboard **conectado a datos reales** (sin mocks) — hero con gasto total del mes + badge de deuda (Te deben / Debes / Saldado) calculado desde `getExpenses` + `getPayments` por workspace, `RecentExpensesCard` con las últimas 5 del mes y navegación al detalle, `TopCategory` real (mayor categoría del mes con %), "Aportes del mes" (Tú vs resto, **oculto en modo personal**), `GroupSection` con `useGroupSummaries` reales, estados loading/empty, refetch al foco y responde al selector de grupos (workspace) ✅
- **Gastos list** (`(protected)/gastos/index.tsx`): Expense list screen with filters ✅
- **Expense Detail** (`(protected)/gastos/detalle/[id].tsx`): Full expense detail with hero card, information, participants, split breakdown, receipt section, timeline, actions ✅ (ScreenHeader con menú de tres puntos que abre el ExpenseMenuSheet → "Editar gasto" abre el CreateExpenseSheet precargado; "Eliminar gasto" abre el AlertModal de confirmación; guardado con alertas de éxito/error). Participantes y distribución **solo se muestran si el grupo no es PERSONAL y el splitType no es PERSONAL** (evita redundancia en gastos personales); la sección "Actividad" solo muestra "Última actualización" si el gasto fue realmente editado (`updatedAt > createdAt`)
- **Expense Detail (legacy)** (`(protected)/gastos/[id].tsx`): shim de compatibilidad — `Redirect` a `/gastos/detalle/[id]` (rutas viejas tipo `/gastos/abc` siguen funcionando) ✅
- **Reportes** (`(protected)/reportes.tsx`): Reports screen connected to real data via `useReportsData` — bar chart (por categoría, top 5), donut chart (aportes por miembro), stat cards (promedio + transacciones con comparación vs periodo anterior), filtro de período **y categoría** estilo Movimientos (FilterSheet compartido: Este mes / Últimos 3 meses / Este año / Todo + categorías con expandible "Otros"), estados loading/empty ✅
- **Perfil** (`(protected)/perfil/index.tsx`): Profile screen with avatar, user info, menu options (Editar Perfil, Notificaciones, Seguridad, **Acerca de**), badge de verificación de correo (verificado ✓ / "Por verificar" con reenviar), and logout ✅
- **Editar Perfil** (`(protected)/perfil/editar.tsx`): Edit profile screen with name, email fields (uses Input with iconLeft), avatar upload via ImagePicker + ImagePreviewModal, save to API (updateProfile/uploadAvatar) ✅
- **Seguridad** (`(protected)/perfil/seguridad.tsx`): Change password screen with 3 inputs (currentPassword, newPassword, confirmPassword) using Input with iconLeft="lock" + secureTextEntry, per-field validation, API call to changePassword, AlertModal for success/error ✅
- **Acerca de** (`(protected)/perfil/acerca.tsx`): About screen con hero de gradiente, "¿Qué es DuoBalance?", funcionalidades, historia, stack tecnológico y footer; lee la versión real desde `Constants.expoConfig` ✅
- **Group List** (`(protected)/grupos/index.tsx`): Group list with GroupSection, FloatingAddMenu (FAB → bottom sheet: create/join group), CoupleMenuSheet, InviteMemberSheet, JoinGroupSheet, group filtering by type — connected to API via useGroups ✅
- **Group Detail** (`(protected)/grupos/[id].tsx`): Group detail **conectado a datos reales** (ya no usa MOCK_EXPENSES): hero con total real (`getExpenses`), barra de distribución según tipo (COUPLE → % real de BD `splitPercentage`; GROUP → equitativo 100/N; PERSONAL → oculta), settlement card real del backend (`useGroupPayments`), gastos recientes clickeables al detalle, CoupleMenuSheet + InviteMemberSheet, salir/regenerar código con alertas de éxito/error ✅
  - **Flujo de Liquidaciones implementado**: el card/botón de liquidaciones abre `LiquidacionesSheet` (tabs **"Por confirmar"**/**"Historial"**, con confirmar/rechazar solicitudes vía `confirmPayment`/`rejectPayment`); el botón "Liquidar" (solo cuando `settlementDirection === 'I_OWE'`) abre `PaySheet` con **monto de abono parcial editable** (puedes pagar en partes). Conectado a `useGroupPayments` + `useDashboardData` (el balance del dashboard incluye solo pagos **CONFIRMED**)
- **Group Settings** (`(protected)/grupos/[id]/configuracion.tsx`): Group settings with name, split %, members, invite code, regenerate code, notifications, danger zone — connected to API ✅
- **Group Expenses** (`(protected)/grupos/[id]/gastos.tsx`): Per-group expense list with date/category filters + CreateExpenseSheet ✅
- **Creación de gastos**: NO existe `gastos/add.tsx` — se hace vía `gastos/Movimientos.tsx?create=1` (o `gastos/index.tsx` / `grupos/[id].tsx` con el botón "Registrar gasto") que autoabre el `CreateExpenseSheet` ✅

### Layout Components — Built
- **BottomTab**: Custom tab bar with 5 tabs (Inicio, Gastos, Grupos, Reportes, Perfil) ✅
- **ScreenHeader**: Title + subtitle + optional back button page header ✅
- **SplashScreen**: Animated splash screen with gradient and logo ✅
- **HeroSection**: Unified hero component with `variant` prop (`"dashboard"` / `"page"`) — replaces former AppHero + dashboard HeroSection ✅

### Couple/Group Components — Built
- **CoupleCard**: Group/partner info card with avatar, name, balance, status indicator ✅
- **InviteCodeCard**: Invite code display with copy-to-clipboard and refresh ✅
- **CreateCoupleSheet**: Bottom sheet form with group type selector (personal/pareja/grupo), name input, split configuration (50/50, equal, percentage) — connected to API (POST /groups) with loading/error states ✅
- **AddCoupleCard**: Quick-add card for creating a new group ✅
- **CoupleMenuSheet**: Bottom sheet to manage group settings/options (invite, leave, edit split) with interactive transitions ✅
- **Couple Detail Screen** (`grupos/[id].tsx`): Uses `ScreenHeader` from `@/components/ui/screen-header` (with back, action menu) ✅
- **Configuración Screen** (`grupos/[id]/configuracion.tsx`): Group settings with name, split %, members, invite code, regenerate code, notifications, danger zone — connected to API ✅
- **InviteMemberSheet**: Bottom sheet displaying group's invite code with quick copy, premium gradients, and logo branding ✅
- **JoinGroupSheet**: Bottom sheet to join a group via invite code (manual entry + QR scanner placeholder) ✅

### Dashboard Components — Built
- **PartnerBalance**: Balance card showing how much is owed/to whom ✅
- **RecentExpensesCard** (usado en Dashboard y Gastos): lista de gastos recientes con icono por categoría, truncamiento de textos largos (`numberOfLines={1}`) y navegación al detalle (`onExpensePress`) ✅ (reemplaza al antiguo `RecentTransactions`, eliminado)
- **FloatingAddButton**: Simple floating action button with shadow (used in Dashboard) ✅
- **FloatingAddMenu**: FAB + bottom sheet with create/join couple actions and sub-sheets (CreateCoupleSheet, AlertModal) — used in Couple screen ✅
- **TopCategory**: Top spending category card ✅
- **BalanceCard**: Balance summary card (income/expenses/net) ✅
- **BarChart**: Bar chart visualization ✅
- **DonutChart**: Donut chart for category breakdown ✅

### Hooks — Built
- **useAuth**: Auth context wrapper with guard + token persistence on mount ✅
- **useBottomSheet**: BottomSheet lifecycle management (TransitionState, startClose/finishClose, callbacks, pan gesture) ✅
- **useStaggeredEntrance**: Reusable staggered entrance animation for list items — configurable delay, duration, offset, trigger ✅
- **useDashboardHeroAnimation**: Dashboard hero staggered entrance (greeting, balance, badge, selector) with Animated API ✅
- **useGroups**: Loads groups from API (GET /groups), classifies by type (PERSONAL/COUPLE/GROUP), exposes refetch ✅
- **useWorkspace**: Context hook para el workspace global (categoría all/personal/couple/group + groupId) — expone `workspace`, `setWorkspace` y atajos (`selectPersonal`, `selectCouple`, `selectGroup`, `resetWorkspace`) ✅
- **useGroupSummaries**: Carga el resumen real de cada grupo en paralelo (nº de gastos + total del mes) vía `getExpenses({ groupId, startDate, endDate })` — usado por la lista de grupos ✅
- **useReportsData**: Agrega gastos reales por categoría (bar, top 5) y por miembro (donut) respetando el workspace; soporta períodos (Este mes / Últimos 3 meses / Este año / Todo) con ventanas de comparación contra el período anterior; expone `refetch` ✅
- **useDashboardData**: Datos reales del Dashboard por workspace — balance neto del usuario (`pagado − share − recibido + enviado`, donde `recibido`/`enviado` son los pagos `CONFIRMED` de `getPayments`, replicando `netSettlementSigned` del backend; solo gastos para el resto de métricas), transacciones del mes (top 5), top categoría y aportes (Tú vs resto); `refetch` ✅
- **useGroupPayments**: Carga pagos + settlement real del grupo en paralelo (`getPayments` + `getSettlement`); deriva `pendingToConfirm` (pagos `PENDING` donde yo soy el receptor) y `history` (CONFIRMED/REJECTED); se re-ejecuta con `useFocusEffect` y expone `refetch` — usado por `grupos/[id].tsx` ✅

### Feature: Workspace
- **`src/features/workspace/`**: Contexto global de "espacio de trabajo" (`WorkspaceProvider` envuelve los Tabs en `(protected)/_layout.tsx`). Define `WorkspaceState = FilterState` (categoría + groupId). Todas las pantallas (Inicio, Gastos, Grupos, Reportes) leen el mismo estado y se sincronizan. Types en `workspace.types.ts` (alias de `src/types/filter.ts`). ✅

### API Services — Built
- **auth.ts**: Auth service (login, register, getProfile, updateProfile, changePassword, uploadAvatar, **verifyEmail, resendVerification**) ✅
- **groups.ts**: Full group CRUD (create, join, list, get, update, delete, archive, regenerate invite code, remove member, update member split) ✅
- **Expenses API** (`src/services/api/expenses.ts`): CRUD completo (create, list, get, update, delete) ✅
- **Payments API** (`src/services/api/payments.ts`): createPayment, getPayments, getSettlement, getSettlementSuggestions, **confirmPayment, rejectPayment** — conectado al backend (con `?groupId=` para el workspace) ✅
- **Dashboard API** (`src/services/api/dashboard.ts`): ❌ Pending — obsoleto como prerrequisito: el Dashboard ya está conectado client-side vía `useDashboardData` + `getExpenses` + `getPayments` (no consume mocks)

### Animations
- **Staggered entrance animations (auth screens)**: Logo, Title, Inputs, Buttons fade in sequentially on auth screens ✅
- **useStaggeredEntrance hook**: Reusable hook for staggered list animations — accepts `index`, `delayBetweenItems`, `duration`, `fromOffset`, `trigger` (for re-animation on focus/state changes). Used by `StaggeredCoupleCard` in the couple list. ✅
- **BottomSheet**: Spring animations for show/hide with TransitionState lifecycle (Idle/Opening/Closing), synchronized header/sheet/overlay exit via `withTiming`, and `onOpenComplete`/`onCloseComplete` callbacks ✅
- **AlertModal**: Spring animations for show/hide ✅
- **Bug fix**: Bottom sheet overlay no longer covers header — header is correctly positioned below sheet content ✅

## Decisión de producto — División de gastos (acordada)
- **PERSONAL**: siempre personal, 100% al que paga. Sin selector de división en el sheet. ✅
- **COUPLE (pareja)**: participan **siempre ambos** (no hay selector de participantes — si participó solo uno, se registra como gasto personal). División: **Igual (50/50)** o **Porcentaje** ajustable. El **% por defecto es el configurado al crear la pareja** (`splitPercentage` del miembro) o 50/50 si no existe. ✅
- **GROUP (3+ personas)**: **solo división Igual** ("cada quien paga su parte"). Se mantiene el selector de participantes (no todos participan en cada gasto). El botón Porcentaje **no aparece** en grupos de 3+. ✅
- Implementado en `CreateExpenseSheet` (`isCouple = group.type === 'COUPLE' || members.length === 2`).

## Tech Decisions
- **pnpm** over npm/yarn (exclusively)
- **Prisma** as ORM (PostgreSQL)
- **NestJS v11** with decorators and DI
- **Jest** for testing (ts-jest for unit, supertest for e2e)
- **ESLint flat config** + Prettier
- **Expo SDK 56** with Expo Router (file-based routing, no React Navigation)
- **NativeWind v4** (stable) + Tailwind CSS v3 for styling
- **TypeScript 6** strict mode
- **Axios** for HTTP client with interceptors
- **expo-secure-store** for token storage
- **expo-blur** for AlertModal backdrop blur
- **react-native-toast-message** for non-critical toast notifications
- **expo-svg** for SVG rendering in hero/charts
- **react-native-reanimated** for animations (staggered entries, spring modals)

## What to Build Next
### P0 — Remaining Backend API Integration
1. ~~Create `src/services/api/payments.ts`~~ ✅ **ya existe** (createPayment, getPayments, getSettlement, getSettlementSuggestions, confirmPayment, rejectPayment)
2. ~~Response interceptor (401 → redirect to login)~~ ✅ **ya implementado** vía `session:expired` + `SessionExpiredAlert` (ver sección Auth)

### P1 — Remaining features
1. **Forgot Password** — endpoint en backend + conectar frontend (UI ya lista en `forgot-password.tsx`)
2. **Receipt Capture** — captura de comprobantes con cámara/galería (hoy el detalle muestra la sección receipt pero sin captura real)
3. **Settlement Suggestions cards** — UI de las sugerencias "Transfiere $X a Y para saldar" (el API `getSettlementSuggestions` ya existe)
4. **Payment History screen** — pantalla dedicada de historial de pagos (hoy el historial vive dentro del `LiquidacionesSheet` del Group Detail)
5. **Dashboard suggestions** — sección en el Dashboard con sugerencias de liquidación si hay balances pendientes
6. **Polish** — dark mode, i18n, offline, push notifications

## Coding Style
- TypeScript strict, no `any`
- Named exports for reusable components; `export default` for Expo Router pages only
- Functional components with hooks
- NativeWind `className` for styling (avoid StyleSheet when possible)
- Conventional commits (`feat:`, `fix:`, `chore:`)

## Testing
- `pnpm tsc --noEmit` for TypeScript check
- 80%+ coverage target

## Common Commands
```bash
# Mobile app
pnpm install              # Install deps
pnpm start                # Start Expo dev server
pnpm start -- --clear     # Start with clean cache
pnpm android              # Android emulator
pnpm ios                  # iOS simulator
pnpm web                  # Web browser
pnpm lint                 # ESLint check
pnpm tsc --noEmit         # TypeScript check

# Backend
cd ../duobalance-api
pnpm install
pnpm start:dev
pnpm test
pnpm test:e2e
pnpm lint

# Prisma
npx prisma generate       # Generate client
npx prisma migrate dev    # Create migration
npx prisma db push        # Push schema (dev)
```

## Key Files

### Routes
| File | Purpose |
|------|---------|
| `src/app/_layout.tsx` | Root layout (AuthProvider + Stack + Toast) |
| `src/app/index.tsx` | Conditional entry (WelcomeScreen or Dashboard redirect) |
| `src/app/(auth)/_layout.tsx` | Auth layout |
| `src/app/(auth)/login.tsx` | Login screen (full implementation) |
| `src/app/(auth)/register.tsx` | Register screen (full implementation, sin auto-login → verificar-correo) |
| `src/app/(auth)/verificar-correo.tsx` | Post-registro: "te enviamos un correo" + reenviar (cooldown 60s) |
| `src/app/(auth)/verify-email.tsx` | Procesa `?token=` del correo de verificación (estados verifying/success/error) |
| `src/app/(auth)/forgot-password.tsx` | Forgot password screen (UI complete) |
| `src/app/(protected)/_layout.tsx` | Protected layout with auth guard + BottomTab |
| `src/app/(protected)/index.tsx` | Dashboard screen (datos reales via useDashboardData + useGroupSummaries, sin mocks) |
| `src/app/(protected)/gastos/index.tsx` | Gastos screen (hero + Últimos Movimientos con load-more) |
| `src/app/(protected)/gastos/Movimientos.tsx` | Movimientos screen (lista filtrada con FilterSheet: período + categoría + buscador + workspace; `?create=1` autoabre el CreateExpenseSheet) |
| `src/app/(protected)/gastos/[id].tsx` | Shim de compatibilidad (Redirect → `/gastos/detalle/[id]`) — NO existe `gastos/add.tsx` |
| `src/app/(protected)/gastos/detalle/[id].tsx` | Expense detail screen (hero, info, participants, split, receipt, timeline, actions) |
| `src/app/(protected)/reportes.tsx` | Reports screen (datos reales: bar/donut/stats + filtro de período estilo Movimientos) |
| `src/app/(protected)/perfil/_layout.tsx` | Perfil stack navigator (index, editar, notificaciones, seguridad, acerca) |
| `src/app/(protected)/perfil/index.tsx` | Profile screen (avatar, user info, menu options, logout) |
| `src/app/(protected)/perfil/editar.tsx` | Edit profile (name, email, avatar upload) |
| `src/app/(protected)/perfil/notificaciones.tsx` | Notification preferences (toggles por tipo) |
| `src/app/(protected)/perfil/seguridad.tsx` | Change password (validation, API, AlertModal) |
| `src/app/(protected)/perfil/acerca.tsx` | About screen (hero, funcionalidades, historia, stack, versión real) |
| `src/app/(protected)/grupos/_layout.tsx` | Grupos stack navigator (index, [id], [id]/configuracion, [id]/gastos) |
| `src/app/(protected)/grupos/index.tsx` | Group list screen (CoupleCard, FloatingAddMenu, CoupleMenuSheet, InviteMemberSheet, JoinGroupSheet) |
| `src/app/(protected)/grupos/[id].tsx` | Group detail screen (financial hero, settlement, distribution, recent expenses + LiquidacionesSheet/PaySheet) |
| `src/app/(protected)/grupos/[id]/configuracion.tsx` | Group settings screen (name, split %, members, invite code, regenerate code, notifications, danger zone — connected to API) |
| `src/app/(protected)/grupos/[id]/gastos.tsx` | Per-group expense list with date/category filters |

### UI Components
| File | Purpose |
|------|---------|
| `src/components/ui/alert-modal.tsx` | Custom AlertModal (BlurView, success/error/warning/info, animated) |
| `src/components/ui/input.tsx` | Enhanced Input (iconLeft, iconRight, onIconRightPress, secureTextEntry toggle, focus border) |
| `src/components/ui/button.tsx` | Reusable Button (5 variants, loading, icons) |
| `src/components/ui/card.tsx` | Generic Card (default/highlight) |
| `src/components/ui/loading.tsx` | Full-screen loading spinner |
| `src/components/ui/empty-state.tsx` | Empty state placeholder |
| `src/components/ui/bottom-sheet.tsx` | Bottom sheet modal (backdrop, drag indicator, spring animation) |
| `src/components/ui/bottom-sheet-header.tsx` | Reusable header for bottom sheets (gradient, animations, safe area) |
| `src/components/ui/screen-header.tsx` | Feature-rich header (back button, action button, animated entry) — used in couple detail & config |
| `src/components/ui/percentage-slider.tsx` | Animated percentage slider with gradient |
| `src/components/ui/distribution-bar.tsx` | Stacked distribution bar with legends |
| `src/components/ui/group-selector.tsx` | Dropdown-style group selector for filtering |
| `src/components/ui/group-section.tsx` | Reusable section for group lists (horizontal/vertical, type-based) |
| `src/components/ui/group-card.tsx` | GroupCard — card de grupo con total del mes, barra de distribución según tipo (PERSONAL 100%/COUPLE % de BD/GROUP equitativo) y botón "Agregar gasto" |
| `src/components/ui/load-more-button.tsx` | LoadMoreButton — botón "Cargar más movimientos" (visibleCount/totalCount/step) usado por Gastos y Movimientos |
| `src/components/ui/app-toast.tsx` | Toast custom arriba a la derecha (success verde / error rojo) — config `appToastConfig` para react-native-toast-message; usado al crear gastos y grupos |

### Auth Components
| File | Purpose |
|------|---------|
| `src/components/auth/auth-header.tsx` | Logo + title header for auth screens |
| `src/components/auth/auth-divider.tsx` | "O continúa con" divider |
| `src/components/auth/social-login-button.tsx` | Google login button |
| `src/components/auth/auth-footer.tsx` | Auth navigation footer |
| `src/components/auth/session-expired-alert.tsx` | SessionExpiredAlert — escucha `session:expired` del interceptor 401, muestra AlertModal y redirige a `/login` (auto 15s) |

### Welcome Components
| File | Purpose |
|------|---------|
| `src/components/welcome/welcome-screen.tsx` | Welcome landing page |
| `src/components/welcome/hero-section.tsx` | SVG gradient hero with diagonal |
| `src/components/welcome/benefit-card.tsx` | Icon + text benefit row |

### Layout Components
| File | Purpose |
|------|---------|
| `src/components/layout/bottom-tab.tsx` | Custom bottom tab bar (5 tabs) |
| `src/components/layout/screen-header.tsx` | Title + subtitle + back button header |
| `src/components/layout/splash-screen.tsx` | Animated splash screen |
| `src/components/layout/HeroSection.tsx` | Unified hero component (`"dashboard"` / `"page"` variants) |

### Couple/Group Components
| File | Purpose |
|------|---------|
| `src/components/couple/couple-card.tsx` | Group/partner info card with balance & status |
| `src/components/couple/invite-code-card.tsx` | Invite code display + copy |
| `src/components/couple/create-couple-sheet.tsx` | Create group bottom sheet (type selector: personal/pareja/grupo, split config) |
| `src/components/couple/couple-menu-sheet.tsx` | Bottom sheet to manage group settings/options |
| `src/components/couple/invite-member-sheet.tsx` | Bottom sheet displaying invite code with copy/QR |
| `src/components/couple/join-group-sheet.tsx` | Join group via invite code (manual entry + QR scanner placeholder) |

### Expense/Movement Components
| File | Purpose |
|------|---------|
| `src/components/expenses/recent-expenses-card.tsx` | Recent expenses list card with category icons |
| `src/components/expenses/expense-hero-card.tsx` | Expense detail hero card |
| `src/components/expenses/expense-information.tsx` | Expense info (amount, category, date) |
| `src/components/expenses/expense-participants.tsx` | Expense participants display |
| `src/components/expenses/expense-split.tsx` | Expense split breakdown |
| `src/components/expenses/expense-receipt.tsx` | Expense receipt section |
| `src/components/expenses/expense-timeline.tsx` | Expense timeline |
| `src/components/expenses/expense-actions.tsx` | Expense actions (edit/delete) — botón "Editar gasto" dispara el CreateExpenseSheet en modo edición |
| `src/components/expenses/expense-menu-sheet.tsx` | Bottom sheet de opciones del gasto (réplica de couple-menu-sheet): expone `ExpenseMenuAction = 'edit' \| 'delete'`, items "Editar gasto"/"Eliminar gasto" con animaciones de entrada |
| `src/components/movements/filter-sheet.tsx` | Bottom sheet de filtros **compartido** (período + categoría) con expandible "Otros" que muestra categorías extra; usado por Movimientos y Reportes |
| `src/components/movements/destination-selector.tsx` | Selector de destino/grupo para el CreateExpenseSheet |
| `src/components/movements/create-expense-sheet.tsx` | Unified bottom sheet form for creating AND editing expenses (`initialExpense` + `onUpdateExpense`, prefill de todos los campos, modo edición "Editar gasto"/"Guardar cambios", campo Valor con formato en vivo vía `formatAmountInput`: solo enteros, sin ceros iniciales y separador de miles 2.000) |
| `src/components/expenses/couple-expense-card.tsx` | CoupleExpenseCard — card con reparto Tú vs pareja (sin importar en pantallas activas; ver deuda de componentes huérfanos) |

### Payment Components
| File | Purpose |
|------|---------|
| `src/components/payments/liquidaciones-sheet.tsx` | LiquidacionesSheet — bottom sheet con tabs **"Por confirmar"** (solicitudes PENDING donde soy receptor, botones Aceptar/Rechazar) e **"Historial"** (pagos CONFIRMED/REJECTED); props `onConfirm`/`onReject` |
| `src/components/payments/pay-sheet.tsx` | PaySheet — bottom sheet "Registrar pago": **monto de abono parcial editable** (`formatAmountInput`, valida `> 0` y `<= amountDue`), **destino automático en COUPLE** (solo el acreedor) y **selector de destinatario en GROUP** (chips); envía `{ amount, toUserId }` |

### Perfil Components
| File | Purpose |
|------|---------|
| `src/components/perfil/profile-card.tsx` | ProfileCard — card del perfil (avatar, nombre, email) usado en Perfil y Editar Perfil |
| `src/components/perfil/image-preview-modal.tsx` | ImagePreviewModal — preview del avatar seleccionado (ImagePicker) con opciones de confirmar/descartar |

### Dashboard Components
| File | Purpose |
|------|---------|
| `src/components/dashboard/BalanceCard.tsx` | Balance summary |
| `src/components/dashboard/CoupleSelector.tsx` | Couple dropdown (usado en HeroSection del Dashboard) |
| `src/components/dashboard/CoupleCard.tsx` | Card de pareja con balance/status — **⚠️ no se importa en ninguna pantalla activa** y se solapa con `couple/couple-card.tsx` y `ui/group-card.tsx` (candidato a eliminar/deprecar) |
| `src/components/dashboard/PartnerBalance.tsx` | Partner balance card |
| `src/components/expenses/recent-expenses-card.tsx` | Gastos recientes con navegación al detalle + truncamiento de texto (usado por Dashboard, Gastos y Movimientos) |
| `src/components/dashboard/FloatingAddButton.tsx` | Simple FAB with shadow (used in Dashboard) |
| `src/components/dashboard/FloatingAddMenu.tsx` | FAB + bottom sheet with create/join couple actions and sub-sheets (used in Couple screen) |
| `src/components/dashboard/TopCategory.tsx` | Top category card |
| `src/components/dashboard/AddCoupleCard.tsx` | Quick-add couple card |
| `src/components/dashboard/BarChart.tsx` | Bar chart |
| `src/components/dashboard/DonutChart.tsx` | Donut chart |

### Hooks
| File | Purpose |
|------|---------|
| `src/hooks/use-auth.ts` | useAuth hook (with token persistence) |
| `src/hooks/use-bottom-sheet.ts` | BottomSheet lifecycle management — TransitionState (Idle/Opening/Closing), startClose/finishClose, onOpenComplete/onCloseComplete callbacks, pan gesture handling |
| `src/hooks/use-staggered-entrance.ts` | Reusable staggered entrance animation for list items — configurable delay, duration, offset, and trigger for re-animation |
| `src/hooks/use-dashboard-hero-animation.ts` | Dashboard hero staggered entrance (greeting, balance, badge, selector) with Animated API |
| `src/hooks/use-groups.ts` | Groups loader from API (GET /groups), classifies by type (PERSONAL/COUPLE/GROUP), refetch |
| `src/hooks/use-workspace.ts` | useWorkspace hook (WorkspaceContext wrapper con guard) |
| `src/hooks/use-group-summaries.ts` | Resumen real por grupo (count + total del mes) en paralelo |
| `src/hooks/use-reports-data.ts` | Datos de Reportes agregados por categoría/miembro + comparación por período |
| `src/hooks/use-group-payments.ts` | Pagos + settlement real del grupo (`getPayments` + `getSettlement`); deriva `pendingToConfirm` y `history`; refetch con useFocusEffect |
| `src/hooks/use-dashboard-data.ts` | Datos del Dashboard por workspace (balance neto incluyendo pagos, transacciones, top categoría, aportes) |

### Utils
| File | Purpose |
|------|---------|
| `src/utils/date.ts` | `formatRelativeDate` (Hoy/Ayer/Hace N días) |
| `src/utils/format.ts` | `formatAmountInput` (solo enteros, sin ceros iniciales, separador de miles 2.000 en vivo) + `parseAmount` (texto → número) — usado en el campo Valor del CreateExpenseSheet |
| `src/utils/event-emitter.ts` | Event emitter |
| `src/utils/jwt.ts` | JWT helpers |

### Constants
| File | Purpose |
|------|---------|
| `src/constants/categories.ts` | Catálogo central de categorías (label/emoji/icono/color) + `MAIN_CATEGORIES`/`EXTRA_CATEGORIES` + `getCategoryMeta` — fuente única reemplaza los mapas duplicados |

### Core
| File | Purpose |
|------|---------|
| `src/features/auth/auth.context.tsx` | AuthContext + AuthProvider |
| `src/storage/token.ts` | SecureStore wrapper (with localStorage fallback for web) |
| `src/services/api/client.ts` | Axios instance |
| `src/services/api/interceptor.ts` | Axios interceptors (Bearer token + respuesta 401 → refresh de token, o emite `session:expired` si falla) |
| `src/services/api/auth.ts` | Auth service (login, register, getProfile, updateProfile, changePassword, uploadAvatar, verifyEmail, resendVerification) |
| `src/services/api/groups.ts` | Groups API service (create, join, list, get, update, delete, archive, regenerate invite, remove member, update split) |
| `src/types/api.ts` | Backend DTOs and response types |
| `src/constants/config.ts` | Environment variables |
| `docs/ARCHITECTURE.md` | Full architecture docs |
| `docs/PLAN.md` | Implementation plan |
| `docs/ROADMAP.md` | Release roadmap |

### AI Agents (`.opencode/agents/`)
| File | Purpose |
|------|---------|
| `.opencode/agents/docs-updater.md` | Mantiene la documentación actualizada tras cada cambio |
| `.opencode/agents/expo-mobile.md` | Construye pantallas y componentes Expo con NativeWind |
| `.opencode/agents/feature-planner.md` | Planifica pantallas y features antes de implementar |
| `.opencode/agents/frontend-architect.md` | Diseña la arquitectura del frontend y organiza el código |
| `.opencode/agents/mobile-ui-reviewer.md` | Revisa UI/UX de pantallas Expo y propone mejoras |
