# CLAUDE.md — AI Context for DuoBalance

## Project Overview
DuoBalance is a shared expense tracking app for couples. It consists of:
- **duobalance-api**: NestJS backend (TypeScript, Prisma, PostgreSQL) — auth, couples, expenses CRUD, balances, payments, settlements, dashboard
- **DuoBalance-app**: React Native + Expo SDK 56 mobile client (auth flow complete, couple/dashboard/reports screens implemented)

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
- **Login Screen**: Full implementation with form validation, API integration (login → getProfile → signIn) ✅
- **Register Screen**: Full implementation with auto-login (register → login → getProfile → signIn → AlertModal → dashboard) ✅
- **Forgot Password Screen**: UI complete, pending backend endpoint 🔄
- **Auth Components**: AuthHeader, AuthDivider, SocialLoginButton, AuthFooter — all reusable ✅
- **Token persistence**: Fixed — use-auth now reads stored token on mount and calls onAuthStateChanged ✅
- **Response interceptor (401)**: Exists (logs warning on 401) — login redirect not implemented 🔄

### UI Components — All built
- **Enhanced Input**: iconLeft support + focus border (instant green on focus, instant reset on blur) ✅
- **AlertModal**: Custom modal with BlurView backdrop, 4 types (success/error/warning/info), spring animations ✅
- **Toast notifications**: react-native-toast-message configured in root layout ✅
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
- **Dashboard** (`(protected)/index.tsx`): Dashboard with HeroSection (greeting), GroupSection (groups from API via useGroups hook), MemberBalance, RecentTransactions, TopCategory, FloatingAddButton ✅
- **Gastos list** (`(protected)/gastos/index.tsx`): Expense list screen with filters ✅
- **Add Expense** (`(protected)/gastos/add.tsx`): Standalone expense creation form ✅
- **Expense Detail** (`(protected)/gastos/detalle/[id].tsx`): Full expense detail with hero card, information, participants, split breakdown, receipt section, timeline, actions ✅
- **Reportes** (`(protected)/reportes.tsx`): Reports screen with period filter (dropdown), donut chart, top categories list, stats cards — mock data ✅
- **Perfil** (`(protected)/perfil.tsx`): Profile screen with avatar, user info, menu options (Editar Perfil, Notificaciones, Seguridad), and logout ✅
- **Group List** (`(protected)/grupos/index.tsx`): Group list with GroupSection, FloatingAddMenu (FAB → bottom sheet: create/join group), CoupleMenuSheet, InviteMemberSheet, JoinGroupSheet, group filtering by type — connected to API via useGroups ✅
- **Group Detail** (`(protected)/grupos/[id].tsx`): Group detail with financial hero card, settlement status, distribution bar, recent expenses, CoupleMenuSheet, InviteMemberSheet ✅
- **Group Settings** (`(protected)/grupos/[id]/configuracion.tsx`): Group settings with name, split %, members, invite code, regenerate code, notifications, danger zone — connected to API ✅
- **Group Expenses** (`(protected)/grupos/[id]/gastos.tsx`): Per-group expense list with date/category filters + CreateExpenseSheet ✅

### Layout Components — Built
- **BottomTab**: Custom tab bar with 5 tabs (Inicio, Gastos, Pareja, Reportes, Perfil) ✅
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
- **RecentTransactions**: Recent transactions list with pull-to-refresh ✅
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

### API Services — Built
- **auth.ts**: Auth service (login, register, getProfile) ✅
- **groups.ts**: Full group CRUD (create, join, list, get, update, delete, archive, regenerate invite code, remove member, update member split) ✅
- **Expenses API** (`src/services/api/expenses.ts`): ❌ Pending
- **Payments API** (`src/services/api/payments.ts`): ❌ Pending
- **Dashboard API** (`src/services/api/dashboard.ts`): ❌ Pending

### Animations
- **Staggered entrance animations (auth screens)**: Logo, Title, Inputs, Buttons fade in sequentially on auth screens ✅
- **useStaggeredEntrance hook**: Reusable hook for staggered list animations — accepts `index`, `delayBetweenItems`, `duration`, `fromOffset`, `trigger` (for re-animation on focus/state changes). Used by `StaggeredCoupleCard` in the couple list. ✅
- **BottomSheet**: Spring animations for show/hide with TransitionState lifecycle (Idle/Opening/Closing), synchronized header/sheet/overlay exit via `withTiming`, and `onOpenComplete`/`onCloseComplete` callbacks ✅
- **AlertModal**: Spring animations for show/hide ✅
- **Bug fix**: Bottom sheet overlay no longer covers header — header is correctly positioned below sheet content ✅

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
1. **Create `src/services/api/expenses.ts`** — API service for expense CRUD (POST /expenses, GET /expenses, GET /expenses/:id, PATCH /expenses/:id, DELETE /expenses/:id)
2. **Connect expense screens** — replace mock data with API
3. **Create `src/services/api/balances.ts`** — API service for balance data (GET /balances, GET /groups/:id/balance)
4. **Create `src/services/api/dashboard.ts`** — API service for dashboard summary (GET /dashboard)
5. **Connect Dashboard** — replace remaining mock data with API
6. **Create `src/services/api/payments.ts`** — API service for payments/settlements

### P1 — Remaining features
7. Response interceptor (401 → redirect to login)
8. Create Forgot Password endpoint in backend + connect frontend
9. Receipt capture with camera
10. Payment/settlement screens

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
| `src/app/(auth)/register.tsx` | Register screen (full implementation with auto-login) |
| `src/app/(auth)/forgot-password.tsx` | Forgot password screen (UI complete) |
| `src/app/(protected)/_layout.tsx` | Protected layout with auth guard + BottomTab |
| `src/app/(protected)/index.tsx` | Dashboard screen (groups from API via useGroups, mock balance/transactions) |
| `src/app/(protected)/gastos/index.tsx` | Expenses list screen |
| `src/app/(protected)/gastos/add.tsx` | Add expense form |
| `src/app/(protected)/gastos/detalle/[id].tsx` | Expense detail screen (hero, info, participants, split, receipt, timeline, actions) |
| `src/app/(protected)/reportes.tsx` | Reports screen (mock data: bar chart, donut chart, stats cards) |
| `src/app/(protected)/perfil.tsx` | Profile screen (avatar, user info, menu options, logout) |
| `src/app/(protected)/grupos/_layout.tsx` | Grupos stack navigator (index, [id], [id]/configuracion, [id]/gastos) |
| `src/app/(protected)/grupos/index.tsx` | Group list screen (CoupleCard, FloatingAddMenu, CoupleMenuSheet, InviteMemberSheet, JoinGroupSheet) |
| `src/app/(protected)/grupos/[id].tsx` | Group detail screen (financial hero, settlement, distribution, recent expenses) |
| `src/app/(protected)/grupos/[id]/configuracion.tsx` | Group settings screen (name, split %, members, invite code, regenerate code, notifications, danger zone — connected to API) |
| `src/app/(protected)/grupos/[id]/gastos.tsx` | Per-group expense list with date/category filters |

### UI Components
| File | Purpose |
|------|---------|
| `src/components/ui/alert-modal.tsx` | Custom AlertModal (BlurView, success/error/warning/info, animated) |
| `src/components/ui/input.tsx` | Enhanced Input (iconLeft, focus border) |
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

### Auth Components
| File | Purpose |
|------|---------|
| `src/components/auth/auth-header.tsx` | Logo + title header for auth screens |
| `src/components/auth/auth-divider.tsx` | "O continúa con" divider |
| `src/components/auth/social-login-button.tsx` | Google login button |
| `src/components/auth/auth-footer.tsx` | Auth navigation footer |

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
| `src/components/expenses/expense-actions.tsx` | Expense actions (edit/delete) |
| `src/components/movements/create-expense-sheet.tsx` | Unified bottom sheet form for creating expenses |

### Dashboard Components
| File | Purpose |
|------|---------|
| `src/components/dashboard/BalanceCard.tsx` | Balance summary |
| `src/components/dashboard/CoupleSelector.tsx` | Couple dropdown |
| `src/components/dashboard/PartnerBalance.tsx` | Partner balance card |
| `src/components/dashboard/RecentTransactions.tsx` | Transaction list |
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

### Core
| File | Purpose |
|------|---------|
| `src/features/auth/auth.context.tsx` | AuthContext + AuthProvider |
| `src/storage/token.ts` | SecureStore wrapper (with localStorage fallback for web) |
| `src/services/api/client.ts` | Axios instance |
| `src/services/api/interceptor.ts` | Bearer token interceptor |
| `src/services/api/auth.ts` | Auth service (login, register, getProfile) |
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
