# Roadmap — Mobile App Release Phases

## Phase 0: Foundation (v0.1) — Current
**Goal**: Bootstrapped Expo project with routing, styling, and tooling
- [✅] Expo project init (SDK 56)
- [✅] Expo Router file-based routing
- [✅] NativeWind + Tailwind CSS config
- [✅] TypeScript strict mode
- [✅] ESLint + Prettier config
- [✅] Import aliases
- [✅] Environment variables setup
- [❌] Auth screens
- [❌] API client stub
- [❌] Feature screens

**Estimated**: Completed

---

## Phase 1: Auth (v0.2)
**Goal**: Users can register and log in
- Login screen
- Register screen
- Auth context + secure token storage
- Protected routes

**Estimated**: 1-2 weeks

---

## Phase 2: Expense Tracking (v0.3)
**Goal**: Add and view expenses
- Expense list screen
- Add expense screen with split picker
- Expense detail screen

**Estimated**: 2-3 weeks

---

## Phase 3: Dashboard (v0.4)
**Goal**: See balances and spending breakdown
- Dashboard with summary cards
- Balance visualization
- Category breakdown

**Estimated**: 1-2 weeks

---

## Phase 4: Receipt Capture (v0.5)
**Goal**: Take photos of receipts and auto-fill expenses
- Camera/gallery integration
- Upload + progress UI
- Extracted data confirmation

**Estimated**: 2-3 weeks

---

## Phase 5: Payments (v0.6)
**Goal**: Record payments and settle up
- Pay screen
- Payment history
- Settlement suggestions

**Estimated**: 1-2 weeks

---

## Phase 6: Production (v1.0)
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
v0.2  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Auth — next)
v0.3  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Expenses)
v0.4  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Dashboard)
v0.5  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Receipts)
v0.6  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Payments)
v1.0  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Production)
```

**Total estimated time to v1.0**: 12-18 weeks
