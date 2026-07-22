# Architecture & Project Structure

## Tech Stack
- **Frontend**: React Native + Expo SDK 56
- **Language**: TypeScript 6
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind v4 + Tailwind CSS v3
- **State**: Local state + context (AuthContext)
- **API Client**: Axios with interceptors
- **Secure Storage**: expo-secure-store
- **Animations**: react-native-reanimated
- **Image Capture**: expo-image-picker / expo-camera (planned)
- **Charts**: react-native-svg (custom BarChart/DonutChart)
- **Package Manager**: pnpm

## Current State

The mobile app has its auth flow fully implemented, a growing set of reusable UI components, dashboard/couple/reports screens, group management connected to the API, expense detail components, and custom layout components.

```
DuoBalance-app/
├── src/
│   ├── app/                         Expo Router (file-based routing)
│   │   ├── _layout.tsx              Root layout (AuthProvider + Stack + Toast)
│   │   ├── index.tsx                Entry — shows WelcomeScreen or redirects to Dashboard
│   │   ├── (auth)/                  Auth group (unauthenticated routes)
│   │   │   ├── _layout.tsx          Auth layout (login, register, forgot-password)
│   │   │   ├── login.tsx            Login screen (full implementation)
│   │   │   ├── register.tsx         Register screen (full implementation with auto-login)
│   │   │   └── forgot-password.tsx  Forgot password screen (UI complete)
│   │   └── (protected)/             Protected group (authenticated routes)
│   │       ├── _layout.tsx          Protected layout (auth guard + BottomTab)
│   │       ├── index.tsx            Dashboard screen (groups from API via useGroups, mock balance/transactions)
│   │       ├── reportes.tsx         Reports screen (mock data: bar chart, donut chart, stats cards)
│   │       ├── perfil.tsx           Profile screen (avatar, user info, menu options, logout)
│   │       ├── gastos/              Expense routes (directory-based)
│   │       │   ├── _layout.tsx      Gastos Stack navigator
│   │       │   ├── index.tsx        Expense list with filters
│   │       │   ├── add.tsx          Add expense form
│   │       │   └── detalle/
│   │       │       └── [id].tsx     Expense detail (hero, info, participants, split, receipt, timeline, actions)
│   │   └── grupos/               Group stack routes
│   │           ├── _layout.tsx      Grupos Stack navigator
│   │           ├── index.tsx        Group list (GroupSection, group filter, create/join sheets — API connected)
│   │           ├── [id].tsx         Group detail (financial hero, settlement, distribution, expenses)
│   │           └── [id]/            Group sub-routes
│   │               ├── configuracion.tsx  Group settings (name, split %, members, invite code, regenerate code, notifications, danger zone — API connected)
│   │               └── gastos.tsx        Per-group expense list with date/category filters + CreateExpenseSheet
│   │
│   ├── components/                  Reusable UI components
│   │   ├── ui/                      Primitives
│   │   │   ├── alert-modal.tsx       Custom AlertModal (BlurView backdrop, 4 types, animated)
│   │   │   ├── button.tsx           Reusable Button (5 variants: primary/secondary/outline/danger/link)
│   │   │   ├── input.tsx            Enhanced Input (iconLeft, focus border instant green)
│   │   │   ├── card.tsx             Generic Card (default/highlight variants)
│   │   │   ├── loading.tsx          Full-screen loading spinner
│   │   │   ├── empty-state.tsx      Empty state placeholder (icon, title, subtitle, action)
│   │   │   ├── bottom-sheet.tsx     Bottom sheet modal (backdrop, drag indicator, spring animation)
│   │   │   ├── percentage-slider.tsx  Animated percentage slider with gradient fill
│   │   │   ├── bottom-sheet-header.tsx  Reusable header for bottom sheets (gradient, animations, safe area)
│   │   │   ├── screen-header.tsx    Feature-rich header (back button, action button, animated entry)
│   │   │   ├── distribution-bar.tsx  Horizontal stacked distribution bar with legends
│   │   │   ├── group-section.tsx    Reusable section component for group lists (horizontal/vertical)
│   │   │   └── group-selector.tsx   Dropdown-style group selector for filtering
│   │   ├── auth/                    Auth-specific reusable components
│   │   │   ├── auth-header.tsx      Logo + title + optional subtitle
│   │   │   ├── auth-divider.tsx     "O continúa con" separator
│   │   │   ├── social-login-button.tsx  Google/Apple login buttons (UI only)
│   │   │   └── auth-footer.tsx      Navigation text + link (e.g. "¿No tienes cuenta? Crear cuenta")
│   │   ├── welcome/                 Welcome screen components
│   │   │   ├── welcome-screen.tsx   Full welcome landing page
│   │   │   ├── hero-section.tsx     SVG gradient hero with diagonal
│   │   │   └── benefit-card.tsx     Icon + text benefit row
│   │   ├── layout/                  Layout components
│   │   │   ├── bottom-tab.tsx       Custom bottom tab bar (5 tabs: Inicio, Gastos, Pareja, Reportes, Perfil)
│   │   │   ├── screen-header.tsx    Title + subtitle + optional back button
│   │   │   ├── splash-screen.tsx    Animated splash with gradient + logo
│   │   │   └── HeroSection.tsx      Unified hero (dashboard/page variants)
│   │   ├── finance/                 Finance-related components
│   │   │   ├── expense-card.tsx     Expense list item
│   │   │   ├── stat-card.tsx        Stat display card
│   │   │   ├── amount.tsx           Formatted money amount
│   │   │   └── balance-card.tsx     Balance direction card (owed/debt/settled)
│   │   ├── category/
│   │   │   └── category-badge.tsx   Colored category pill
│   │   ├── couple/                  Couple-related components
│   │   │   ├── couple-card.tsx      Partner info card (avatar, name, email)
│   │   │   ├── invite-code-card.tsx  Invite code display with copy + refresh
│   │   │   ├── create-couple-sheet.tsx  Bottom sheet form: name + percentage split + generate code
│   │   │   ├── couple-menu-sheet.tsx  Bottom sheet to manage couple settings/options
│   │   │   └── invite-member-sheet.tsx  Bottom sheet displaying invite code with copy/QR
│   │   └── dashboard/               Dashboard-specific components
│   │       ├── BalanceCard.tsx      Balance summary (income/expenses/net)
│   │       ├── PartnerBalance.tsx   Partner balance card (owed/to whom)
│   │       ├── RecentTransactions.tsx  Transaction list with pull-to-refresh
│   │       ├── FloatingAddButton.tsx   Simple floating action button with shadow (used in Dashboard)
│   │       ├── FloatingAddMenu.tsx    FAB + bottom sheet with create/join couple actions and sub-sheets (used in Couple screen)
│   │       ├── TopCategory.tsx      Top spending category card
│   │       ├── AddCoupleCard.tsx    Quick-add couple card
│   │       ├── BarChart.tsx         Bar chart visualization
│   │       └── DonutChart.tsx       Donut chart for category breakdown
│   │
│   ├── features/                    Feature modules (domain-driven)
│   │   ├── auth/
│   │   │   └── auth.context.tsx     AuthContext + AuthProvider
│   │   ├── couple/                  (empty — pending API service creation)
│   │   ├── dashboard/               (empty — pending API service creation)
│   │   ├── expenses/                (empty — pending API service creation)
│   │   └── payments/                (empty — pending API service creation)
│   │
│   ├── services/
│   │   └── api/
│   │       ├── client.ts            Axios instance (baseURL, timeout)
│   │       ├── interceptor.ts       Bearer token request interceptor
│   │       ├── auth.ts              authService (login, register, getProfile)
│   │       ├── groups.ts            Groups API service (create, join, list, get, update, delete, archive, regenerate invite, remove member, update split)
│   │       ├── expenses.ts          ❌ (pending) — expense CRUD
│   │       ├── balances.ts          ❌ (pending) — balance summary
│   │       ├── payments.ts          ❌ (pending) — payments + settlements
│   │       └── dashboard.ts         ❌ (pending) — dashboard summary
│   │
│   ├── storage/
│   │   └── token.ts                 SecureStore wrapper (token + user)
│   │
│   ├── hooks/
│   │   ├── use-auth.ts              useAuth hook (AuthContext wrapper with guard + token persistence)
│   │   ├── use-bottom-sheet.ts      BottomSheet lifecycle (TransitionState, startClose/finishClose, callbacks)
│   │   ├── use-staggered-entrance.ts  Reusable staggered entrance animations for lists
│   │   ├── use-dashboard-hero-animation.ts  Dashboard hero staggered animation
│   │   └── use-groups.ts            Groups loader from API, classifies by type (PERSONAL/COUPLE/GROUP)
│   │
│   ├── types/
│   │   ├── api.ts                   All backend DTOs and response types
│   │   └── global.d.ts              CSS module + NativeWind type declarations
│   │
│   ├── constants/
│   │   ├── config.ts                Env vars (API_URL, APP_NAME)
│   │   └── theme.ts                 Colors, typography, spacing
│   │
│   ├── context/                     Context providers (empty — AuthContext lives in features/auth/)
│   ├── utils/                       Utilities (empty, ready)
│   └── global.css                   Tailwind directives
│
├── .opencode/
│   └── agents/                      AI agent definitions (docs-updater, expo-mobile, feature-planner, frontend-architect, mobile-ui-reviewer)
├── assets/                          App assets (images, icons)
├── docs/                            Project documentation
├── app.json                         Expo configuration
├── babel.config.js                  Babel + NativeWind preset
├── metro.config.js                  Metro + NativeWind config
├── tailwind.config.js               Tailwind CSS content paths
├── tsconfig.json                    TypeScript paths + strict mode
├── eslint.config.js                 ESLint flat config
├── .prettierrc                      Prettier + Tailwind plugin
├── .prettierignore
├── .env / .env.example              Environment variables
├── nativewind-env.d.ts              NativeWind type declarations
├── package.json
└── pnpm-lock.yaml
```

## Screen Flow

```
App (Expo Router)
├── index.tsx (conditional)
│   ├── if not authenticated → WelcomeScreen
│   │   ├── "Iniciar Sesión" → /login
│   │   └── "Crear Cuenta" → /register
│   └── if authenticated → redirect to /(protected)
│
├── (auth) — Not authenticated
│   ├── /login
│   │   ├── "¿Olvidaste tu contraseña?" → /forgot-password
│   │   └── "¿No tienes cuenta? Crear cuenta" → /register
│   ├── /register
│   │   └── "¿Ya tienes cuenta? Iniciar sesión" → /login
│   └── /forgot-password
│       └── "Volver a Iniciar sesión" → /login
│
└── (protected) — Authenticated (redirects to /login if no user)
    │   Bottom Tab: Inicio | Gastos | Pareja | Reportes | Perfil
    ├── /inicio (index)
    │       └── Dashboard (HeroSection, GroupSection, MemberBalance,
    │                          RecentTransactions, TopCategory, FloatingAddButton)
    ├── /gastos
    │   ├── /gastos (index) — Expense list with filters
    │   ├── /gastos/add — Add expense form
    │   └── /gastos/detalle/[id] — Expense detail (hero, info, participants, split, receipt, timeline, actions)
    ├── /grupos
    │   ├── /grupos (index) — Group list (API connected via useGroups)
    │   │   ├── Group filter (dropdown: All / Personal / Couple / Group)
    │   │   ├── GroupSection (renders groups by type)
    │   │   ├── FloatingAddMenu (FAB → bottom sheet: create group, join group)
    │   │   ├── CreateCoupleSheet (bottom sheet with type selector, API connected)
    │   │   ├── JoinGroupSheet (invite code entry, API connected)
    │   │   ├── CoupleMenuSheet (invite member, settings, leave group)
    │   │   └── InviteMemberSheet (invite code display + copy)
    │   └── /grupos/[id] — Group detail
    │       ├── Financial hero card (total consolidated spending)
    │       ├── Settlement status card
    │       ├── DistributionBar
    │       ├── Recent expenses (RecentExpensesCard)
    │       ├── "Registrar gasto" → CreateExpenseSheet (bottom sheet)
    │       ├── CoupleMenuSheet (settings, invite)
    │       └── /grupos/[id]/configuracion — Group settings (API connected)
    │       │   ├── Info (name, created date, avatars)
    │       │   ├── Distribution (split percentage + DistributionBar)
    │       │   ├── Members list
    │       │   ├── Invite code (copy + QR + regenerate)
    │       │   ├── Notification toggles
    │       │   └── Danger zone (archive/delete/leave group)
    │       └── /grupos/[id]/gastos — Per-group expense list
    │           ├── Date filter chips
    │           ├── Category filter chips
    │           ├── RecentExpensesCard with expenses
    │           └── FloatingAddButton → CreateExpenseSheet
    ├── /reportes
    │   └── Reports (bar chart, donut chart, stats cards)
    └── /perfil
        └── Profile (avatar, user info, menu options, logout)
```

## Data Flow

```
Screen
  └─ hook (useAuth, etc.)
      └─ services/api/client (Axios + interceptor)
          └─ duobalance-api (HTTP)
              └─ PostgreSQL
```

## Auth Flow (Login)

```
User submits form
  → validate() (email format + password required)
  → authService.login({ email, password })
  → POST /auth/login (backend)
  → AuthResponse { access_token, refresh_token, expires_in }
  → tokenStorage.set(access_token)
  → authService.getProfile()
  → GET /auth/profile (with Bearer token)
  → UserResponse { id, firstName, lastName, email }
  → signIn(user, access_token) (AuthContext → stores both)
  → router.replace("/(protected)/dashboard")
```

## Auth Flow (Register)

```
User submits form
  → validate() (all fields required, email format, password match)
  → authService.register({ firstName, lastName, email, password })
  → POST /auth/register (backend)
  → UserResponse { id, firstName, lastName, email }
  → authService.login({ email, password })
  → POST /auth/login (backend)
  → AuthResponse { access_token, refresh_token, expires_in }
  → tokenStorage.set(access_token)
  → authService.getProfile()
  → GET /auth/profile (with Bearer token)
  → UserResponse { id, firstName, lastName, email }
  → signIn(user, access_token) (AuthContext → stores both)
  → AlertModal "Registro exitoso"
  → user taps "Continuar"
  → router.replace("/(protected)/dashboard")
```

## Design Patterns
- **File-based routing** with Expo Router
- **Custom hooks** for data fetching and mutations
- **NativeWind** for styling (Tailwind classes via `className`)
- **Context** for auth state
- **Feature modules** organized by domain (auth, expenses, etc.)
- **Separated API layer** — all HTTP calls through `src/services/api/`
- **Reusable domain components** — `components/auth/` for cross-auth-screen reuse, `components/ui/` for primitives
- **Modals** built as overlays — `BottomSheet` for forms, `AlertModal` for alerts, `BottomSheetHeader` for consistent sheet headers
- **Expo Router default exports** — pages use `export default` (required by the router); all other components use named exports
