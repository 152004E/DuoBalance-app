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
- [✅] Enhanced Input component (iconLeft, focus border with instant green + blur transition)
- [✅] Custom AlertModal with BlurView backdrop (success/error/warning/info)
- [✅] Toast notifications (react-native-toast-message)
- [✅] Protected route guard
- [✅] Conditional routing (index.tsx → WelcomeScreen or Dashboard)
- [❌] Response interceptor (401 handling)

**Estimated**: Complete

---

## Phase 2: UI Components & Layout (v0.3) — Done
**Goal**: Reusable component library and navigation layout
- [✅] BottomSheet (backdrop, drag indicator, spring animations)
- [✅] PercentageSlider (gradient fill, min/max caps)
- [✅] DistributionBar (stacked bar with legends)
- [✅] Button (5 variants: primary/secondary/outline/danger/link)
- [✅] Card, Loading, EmptyState
- [✅] BottomTab (5 tabs: Inicio, Gastos, Pareja, Reportes, Perfil)
- [✅] ScreenHeader, SplashScreen, AppHero
- [✅] Staggered entrance animations

**Estimated**: Complete

---

## Phase 3: Dashboard & Reports (v0.3) — Partial
**Goal**: See balances, spending breakdown, and reports
- [✅] Dashboard screen (HeroSection, BalanceCard, CoupleSelector, PartnerBalance, RecentTransactions, FloatingAddButton)
- [✅] Reports screen (period filter, donut chart, top categories, stats cards)
- [✅] Balance visualization (PartnerBalance)
- [✅] Category breakdown chart (DonutChart)
- [❌] Backend API integration (currently mock data)
- [❌] Settlement suggestions

**Estimated**: 1-2 weeks (API integration)

---

## Phase 4: Couple Management (v0.3) — Partial
**Goal**: Users can create and manage couples
- [✅] Couple list screen (cards, invite code, create trigger)
- [✅] Create couple (bottom sheet: name + percentage split + generate invite code)
- [✅] Couple detail screen (balances, distribution, transactions, settings)
- [❌] Join couple via invite code (enter code form)
- [❌] Backend API integration (currently mock data)

**Estimated**: 1 week (API integration + join flow)

---

## Phase 5: Expense Tracking (v0.4)
**Goal**: Add, view, edit, and delete expenses
- Expense list screen
- Add expense screen with split picker
- Expense detail screen (edit/delete)

**Estimated**: 2-3 weeks

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

## Phase 8: Production (v1.0)
**Goal**: App store ready
- Push notifications
- Offline support
- Dark mode
- i18n
- App icon + splash
- Store submission (iOS + Android)

**Estimated**: 4-6 weeks

---

## Timeline

```
v0.1  ████████████████████████████████  (Foundation — COMPLETE)
v0.2  ████████████████████████████████  (Auth — COMPLETE)
v0.3  ████████████████████████░░░░░░░░  (UI Components + Dashboard + Couples — IN PROGRESS)
v0.4  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Expenses)
v0.5  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Receipts)
v0.6  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Payments)
v1.0  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Production)
```

**Total estimated time to v1.0**: 12-18 weeks
