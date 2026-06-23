# Plan — What's Left to Implement (Frontend)

> **Nota:** El despliegue en tiendas de aplicaciones ocurre ÚNICAMENTE cuando el proyecto alcance estado beta. Hasta entonces todo corre en localhost con Expo Go.

## Legend
- ✅ Done
- 🔄 In Progress / Partial
- ❌ Not Started

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

## Phase 3: Couple Management
- [✅] Couple list screen — cards, invite code display/copy/refresh, create trigger
- [✅] Couple creation bottom sheet — name, percentage split slider, generate invite code
- [✅] Couple detail screen — balance cards (owed/debt/settled), distribution bar, transactions, settings (leave couple)
- [❌] Join couple via invite code (enter code form)
- [❌] Backend API integration (currently mock data)

## Phase 4: Expense Screens
- [❌] Expense list screen (flat list with category filters)
- [❌] Add expense screen (amount, description, category, split picker)
- [❌] Expense detail screen (full info + edit/delete)
- [❌] Split picker UI component (equal/percentage/custom)

## Phase 5: Dashboard
- [✅] Dashboard screen — HeroSection, BalanceCard, CoupleSelector (mock data)
- [✅] Partner balance display (PartnerBalance component)
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
- [✅] Layout components — BottomTab (5 tabs), ScreenHeader, SplashScreen, AppHero
- [✅] Dashboard components — HeroSection, BalanceCard, CoupleSelector, PartnerBalance, RecentTransactions, FloatingAddButton, TopCategory, AddCoupleCard, BarChart, DonutChart
- [✅] Couple components — CoupleCard, InviteCodeCard, CreateCoupleSheet

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
- [❌] App icon + splash screen
- [✅] Staggered entrance animations on auth screens (Logo, Title, Inputs, Buttons)

## Phase 11: Deployment — Beta
> Todo el desarrollo previo corre en localhost con Expo Go. Solo al llegar a beta se despliega.
- [❌] Conectar con backend desplegado (URL de producción)
- [❌] Generar APK con EAS Build (`eas build --platform android`)
- [❌] Pruebas en dispositivo físico con APK
- [❌] App store submission (Google Play)
- [❌] Preparar versión iOS (App Store)
