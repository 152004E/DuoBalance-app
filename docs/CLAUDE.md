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
- **API Types**: Full backend DTOs and response types in `src/types/api.ts` ✅
- **Route Scaffolding**: (auth)/ and (protected)/ route groups created ✅
- **Protected Route Guard**: Redirects to /login if no user ✅
- **Conditional Routing**: index.tsx shows WelcomeScreen or redirects to Dashboard ✅
- **Login Screen**: Full implementation with form validation, API integration (login → getProfile → signIn) ✅
- **Register Screen**: Full implementation with auto-login (register → login → getProfile → signIn → AlertModal → dashboard) ✅
- **Forgot Password Screen**: UI complete, pending backend endpoint 🔄
- **Auth Components**: AuthHeader, AuthDivider, SocialLoginButton, AuthFooter — all reusable ✅
- **Token persistence**: Fixed — use-auth now reads stored token on mount and calls onAuthStateChanged ✅
- **Response interceptor (401)**: Not implemented ❌

### UI Components — All built
- **Enhanced Input**: iconLeft support + focus border (instant green on focus, instant reset on blur) ✅
- **AlertModal**: Custom modal with BlurView backdrop, 4 types (success/error/warning/info), spring animations ✅
- **Toast notifications**: react-native-toast-message configured in root layout ✅
- **Button**: Reusable styled button with 5 variants (primary/secondary/outline/danger/link), loading spinner, icon support ✅
- **Card**: Generic card with default/highlight variants ✅
- **Loading**: Full-screen loading spinner ✅
- **EmptyState**: Empty state placeholder with icon, title, subtitle, action button ✅
- **BottomSheet**: Reusable bottom sheet modal with backdrop press, drag indicator, spring animations, variable height ✅
- **BottomSheetHeader**: Reusable header for bottom sheets with premium gradients, spring transitions, safe-area insets, and adjustable translation/height configs ✅
- **PercentageSlider**: Animated percentage slider with gradient fill, min/max caps ✅
- **DistributionBar**: Horizontal stacked distribution bar with percentage labels and legends ✅

### Screens — Implemented
- **Dashboard** (`(protected)/index.tsx`): Full dashboard with HeroSection (greeting), BalanceCard, CoupleSelector, PartnerBalance, RecentTransactions, FloatingAddButton — all with mock data ✅
- **Gastos** (`(protected)/gastos.tsx`): Expense list screen (placeholder) ✅
- **Reportes** (`(protected)/reportes.tsx`): Reports screen with period filter (dropdown), donut chart, top categories list, stats cards — mock data ✅
- **Perfil** (`(protected)/perfil.tsx`): Profile screen (placeholder) ✅
- **Couple List** (`(protected)/pareja/index.tsx`): Couple list with couple cards, invite code display/refresh, create couple sheet trigger, couple menu sheet, invite member sheet ✅
- **Couple Detail** (`(protected)/pareja/[id].tsx`): Couple detail with balance cards (owed/debt/settled), distribution bar, recent transactions, couple menu sheet, invite member sheet ✅

### Layout Components — Built
- **BottomTab**: Custom tab bar with 5 tabs (Inicio, Gastos, Pareja, Reportes, Perfil) ✅
- **ScreenHeader**: Title + subtitle + optional back button page header ✅
- **SplashScreen**: Animated splash screen with gradient and logo ✅
- **AppHero**: Shared hero component used in dashboard ✅

### Couple Components — Built
- **CoupleCard**: Partner info card with avatar, name, email ✅
- **InviteCodeCard**: Invite code display with copy-to-clipboard and refresh ✅
- **CreateCoupleSheet**: Bottom sheet form with couple name input, percentage slider split, and generate invite code action ✅
- **AddCoupleCard**: Quick-add card for creating a new couple ✅
- **CoupleDetailHeader**: Reusable header for couple detail view with back button, title, subtitle, and optional menu button ✅
- **CoupleMenuSheet**: Bottom sheet to manage couple settings/options (invite, leave, edit split) with interactive transitions ✅
- **InviteMemberSheet**: Bottom sheet displaying couple's invite code with quick copy, premium gradients, and logo branding ✅

### Dashboard Components — Built
- **HeroSection**: Greeting section with user avatar and welcome message ✅
- **PartnerBalance**: Balance card showing how much is owed/to whom ✅
- **RecentTransactions**: Recent transactions list with pull-to-refresh ✅
- **FloatingAddButton**: Floating action button with shadow ✅
- **TopCategory**: Top spending category card ✅
- **BalanceCard**: Balance summary card (income/expenses/net) ✅
- **CoupleSelector**: Dropdown-style couple switcher ✅
- **BarChart**: Bar chart visualization ✅
- **DonutChart**: Donut chart for category breakdown ✅

### Animations
- **Staggered entrance animations**: Logo, Title, Inputs, Buttons fade in sequentially on auth screens ✅
- **BottomSheet**: Spring animations for show/hide ✅
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
1. Connect couple screens to real backend API (currently mock data)
2. Connect dashboard/reports to real API
3. Create Forgot Password endpoint in backend + connect frontend
4. Response interceptor (401 → redirect to login)
5. Expense CRUD screens (create, edit, delete)
6. Receipt capture with camera
7. Payment/settlement screens

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
| `src/app/(protected)/index.tsx` | Dashboard screen (mock data, full implementation) |
| `src/app/(protected)/gastos.tsx` | Expenses screen (placeholder) |
| `src/app/(protected)/reportes.tsx` | Reports screen (mock data: charts, categories, stats) |
| `src/app/(protected)/perfil.tsx` | Profile screen (placeholder) |
| `src/app/(protected)/pareja/_layout.tsx` | Pareja stack navigator |
| `src/app/(protected)/pareja/index.tsx` | Couple list screen (cards, invite code, create couple, couple menu sheet, invite member sheet) |
| `src/app/(protected)/pareja/[id].tsx` | Couple detail screen (balances, distribution, transactions, couple menu sheet, invite member sheet) |

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
| `src/components/ui/percentage-slider.tsx` | Animated percentage slider with gradient |
| `src/components/ui/distribution-bar.tsx` | Stacked distribution bar with legends |
| `src/components/ui/bottom-sheet-header.tsx` | Reusable header for bottom sheets (gradient, animations, safe area) |

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
| `src/components/layout/AppHero.tsx` | Shared hero for dashboard |

### Couple Components
| File | Purpose |
|------|---------|
| `src/components/couple/couple-card.tsx` | Partner info card |
| `src/components/couple/invite-code-card.tsx` | Invite code display + copy |
| `src/components/couple/create-couple-sheet.tsx` | Create couple bottom sheet form |
| `src/components/couple/couple-detail-header.tsx` | Reusable header for couple detail (back, title, subtitle, menu) |
| `src/components/couple/couple-menu-sheet.tsx` | Bottom sheet to manage couple settings/options |
| `src/components/couple/invite-member-sheet.tsx` | Bottom sheet displaying invite code with copy/QR |

### Dashboard Components
| File | Purpose |
|------|---------|
| `src/components/dashboard/HeroSection.tsx` | Greeting with avatar |
| `src/components/dashboard/BalanceCard.tsx` | Balance summary |
| `src/components/dashboard/CoupleSelector.tsx` | Couple dropdown |
| `src/components/dashboard/PartnerBalance.tsx` | Partner balance card |
| `src/components/dashboard/RecentTransactions.tsx` | Transaction list |
| `src/components/dashboard/FloatingAddButton.tsx` | FAB with shadow |
| `src/components/dashboard/TopCategory.tsx` | Top category card |
| `src/components/dashboard/AddCoupleCard.tsx` | Quick-add couple card |
| `src/components/dashboard/BarChart.tsx` | Bar chart |
| `src/components/dashboard/DonutChart.tsx` | Donut chart |

### Core
| File | Purpose |
|------|---------|
| `src/features/auth/auth.context.tsx` | AuthContext + AuthProvider |
| `src/hooks/use-auth.ts` | useAuth hook (with token persistence) |
| `src/storage/token.ts` | SecureStore wrapper |
| `src/services/api/client.ts` | Axios instance |
| `src/services/api/interceptor.ts` | Bearer token interceptor |
| `src/services/api/auth.ts` | Auth service (login, register, getProfile) |
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
