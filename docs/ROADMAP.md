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
- [✅] BottomTab (5 tabs: Inicio, Gastos, Grupos, Reportes, Perfil)
- [✅] ScreenHeader, SplashScreen, HeroSection (unified dashboard/page variants)
- [✅] Staggered entrance animations

**Estimated**: Complete

---

## Phase 3: Dashboard & Reports (v0.3) — Partial
**Goal**: See balances, spending breakdown, and reports
- [✅] Dashboard screen (HeroSection, BalanceCard, GroupSelector, MemberBalance, RecentTransactions, FloatingAddButton — simple FAB)
- [✅] Reports screen (bar chart, donut chart, stats cards)
- [✅] Balance visualization (MemberBalance)
- [✅] Category breakdown chart (DonutChart)
- [❌] Backend API integration (currently mock data)
- [❌] Settlement suggestions

**Estimated**: 1-2 weeks (API integration)

---

## Phase 4: Group Management (v0.3) — Partial
**Goal**: Users can create and manage groups (couples for now, multi-type later)
- [✅] Group list screen (cards, invite code, FloatingAddMenu with create/join group, group menu sheet, invite member sheet)
- [✅] Create group (bottom sheet: name + percentage split + generate invite code)
- [✅] Group detail screen (balances, distribution, transactions, settings, group menu sheet, invite member sheet)
- [✅] Group settings screen (name, split %, members, invite code, type, notifications, danger zone — mock data)
- [❌] Join group via invite code (enter code form)
- [❌] Backend API integration (currently mock data)

**Estimated**: 1 week (API integration + join flow)

---

## Phase 5: Expense Tracking (v0.4)
**Goal**: Add, view, edit, and delete expenses
- Expense list screen (replace `gastos/index.tsx` placeholder with full list)
- Add expense screen with split picker
- Expense detail screen (edit/delete)
- Feature scaffolding already in `src/features/expenses/`

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

## Phase 8: Backend Integration (v0.7)
**Goal**: All screens connected to real backend API
- Auth endpoints connected (login, register, profile)
- Groups CRUD connected
- Expenses CRUD connected
- Dashboard data from API
- Reports from API
- Payments/settlements from API

**Estimated**: 2-3 weeks

---

## Phase 9: Production (v1.0)
**Goal**: App store ready
- Push notifications
- Offline support
- Dark mode
- i18n
- App icon + splash
- Store submission (iOS + Android)

**Estimated**: 4-6 weeks

---

## Fase 10: Multi-actor Support (v2.0)

**Goal**: Generalizar la plataforma para que no solo funcione para parejas, sino que soporte tres tipos de actores.

### Los 3 actores

| Tipo | Emoji | Descripción | Miembros |
|------|-------|-------------|----------|
| Personal | 👤 | Control financiero individual | 1 (solo yo) |
| Pareja | ❤️ | Gastos compartidos entre dos (como hoy) | 2 |
| Grupo | 👥 | Roommates, familia, viaje, amigos | 3+ |

### Lo que cambia

**Backend (API + DB)**
- Tabla `couples` → `groups` con columna `type`
- `group_members` tabla N:N
- Endpoints de couples → groups (con redirect)
- Splits generalizados para N personas

**Frontend**
- Tab "Pareja" → "Grupos" (o se unifica con selector de tipo)
- Nueva pantalla de creación con selector: Personal / Pareja / Grupo
- Split picker adaptativo: 1 persona (no aplica), 2 personas (actual), 3+ (N-way)
- Dashboard con selector global y balance multi-grupo
- Componentes renombrados: `CoupleCard` → `GroupCard`, `PartnerBalance` → `MemberBalance`, etc.

### Fases internas

| Subfase | Actor | Cambios |
|---------|-------|---------|
| 10.1 | ❤️ Pareja | Migrar DB, renombrar endpoints, conectar frontend existente |
| 10.2 | 👤 Personal | Permitir gastos sin split (100% usuario), dashboard individual |
| 10.3 | 👥 Grupo | Splits N-way, gestión de miembros, roles, permisos |

**Estimated**: 6-8 weeks

---

## Timeline

```
v0.1  ████████████████████████████████  (Foundation — COMPLETE)
v0.2  ████████████████████████████████  (Auth — COMPLETE)
v0.3  ████████████████████████████████  (UI Components + Dashboard + Groups + Perfil + Settings — COMPLETE)
v0.4  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Expenses)
v0.5  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Receipts)
v0.6  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Payments)
v0.7  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Backend Integration)
v1.0  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Production)
v2.0  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (Multi-actor: Personal + Pareja + Grupo)
```

**Total estimated time to v1.0**: 14-20 weeks
**Total estimated time to v2.0**: 20-28 weeks
