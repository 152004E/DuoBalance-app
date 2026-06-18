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

## Phase 1: Auth (v0.2) — Current
**Goal**: Users can register and log in
- [✅] Auth context + secure token storage
- [✅] useAuth hook
- [✅] Login screen (UI + API integration)
- [🔄] Register screen (UI complete, pending backend connection)
- [🔄] Forgot password screen (UI complete, pending backend connection)
- [✅] Reusable auth components (AuthHeader, AuthDivider, SocialLoginButton, AuthFooter)
- [✅] Enhanced Input component (iconLeft, animated focus border)
- [✅] Protected route guard
- [✅] Conditional routing (index.tsx → WelcomeScreen or Dashboard)
- [❌] Response interceptor (401 handling)

**Estimated**: In progress

---

## Phase 2: Expense Tracking (v0.3)
**Goal**: Add and view expenses
- Expense list screen
- Add expense screen with split picker
- Expense detail screen

**Estimated**: 2-3 weeks

---

## Phase 3: Couple Management (v0.3)
**Goal**: Users can create and join couples
- Create couple screen
- Join couple via invite code
- Couple settings screen

**Estimated**: 1-2 weeks

---

## Phase 4: Dashboard (v0.4)
**Goal**: See balances and spending breakdown
- Dashboard with summary cards
- Balance visualization
- Category breakdown

**Estimated**: 1-2 weeks

---

## Phase 5: Receipt Capture (v0.5)
**Goal**: Take photos of receipts and auto-fill expenses
- Camera/gallery integration
- Upload + progress UI
- Extracted data confirmation

**Estimated**: 2-3 weeks

---

## Phase 6: Payments (v0.6)
**Goal**: Record payments and settle up
- Pay screen
- Payment history
- Settlement suggestions

**Estimated**: 1-2 weeks

---

## Phase 7: Production (v1.0)
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
v0.2  ████████████████████░░░░░░░░░░░░  (Auth — IN PROGRESS)
v0.3  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Expenses + Couples)
v0.4  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Dashboard)
v0.5  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Receipts)
v0.6  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Payments)
v1.0  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Production)
```

**Total estimated time to v1.0**: 12-18 weeks
