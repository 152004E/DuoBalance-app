# Architecture & Project Structure

## Tech Stack
- **Frontend**: React Native + Expo SDK 56
- **Language**: TypeScript 6
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind v4 + Tailwind CSS v3
- **State**: Local state + context (AuthContext)
- **API Client**: Axios with interceptors
- **Secure Storage**: expo-secure-store
- **Image Capture**: expo-image-picker / expo-camera (planned)
- **Package Manager**: pnpm

## Current State

The mobile app has its auth flow fully implemented and several reusable component domains:

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
│   │       ├── _layout.tsx          Protected layout (auth guard)
│   │       ├── dashboard.tsx        Dashboard screen (placeholder)
│   │       ├── expenses.tsx         Expenses screen (placeholder)
│   │       └── profile.tsx          Profile screen (placeholder)
│   │
│   ├── components/                  Reusable UI components
│   │   ├── ui/                      Primitives
│   │   │   ├── alert-modal.tsx       Custom AlertModal (BlurView backdrop, 4 types, animated)
│   │   │   ├── button.tsx           Reusable Button (variants, loading, icons, link)
│   │   │   ├── input.tsx            Enhanced Input (iconLeft, focus border instant green)
│   │   │   ├── card.tsx             Generic Card (default/highlight variants)
│   │   │   ├── loading.tsx          Full-screen loading spinner
│   │   │   └── empty-state.tsx      Empty state placeholder
│   │   ├── auth/                    Auth-specific reusable components
│   │   │   ├── auth-header.tsx      Logo + title + optional subtitle
│   │   │   ├── auth-divider.tsx     "O continúa con" separator
│   │   │   ├── social-login-button.tsx  Google/Apple login buttons (UI only)
│   │   │   └── auth-footer.tsx      Navigation text + link (e.g. "¿No tienes cuenta? Crear cuenta")
│   │   ├── welcome/                 Welcome screen components
│   │   │   ├── welcome-screen.tsx   Full welcome landing page
│   │   │   ├── hero-section.tsx     SVG gradient hero with diagonal
│   │   │   └── benefit-card.tsx     Icon + text benefit row
│   │   ├── layout/
│   │   │   └── screen-header.tsx    Title + subtitle page header
│   │   ├── finance/
│   │   │   ├── expense-card.tsx     Expense list item
│   │   │   ├── stat-card.tsx        Stat display card
│   │   │   ├── amount.tsx           Formatted money amount
│   │   │   └── balance-card.tsx     Balance direction card
│   │   ├── category/
│   │   │   └── category-badge.tsx   Colored category pill
│   │   └── couple/
│   │       ├── couple-card.tsx      Partner info card
│   │       └── invite-code-card.tsx Invite code display card
│   │
│   ├── features/                    Feature modules (domain-driven)
│   │   └── auth/
│   │       └── auth.context.tsx     AuthContext + AuthProvider
│   │
│   ├── services/
│   │   └── api/
│   │       ├── client.ts            Axios instance (baseURL, timeout)
│   │       ├── interceptor.ts       Bearer token request interceptor
│   │       └── auth.ts              authService (login, register, getProfile, etc.)
│   │
│   ├── storage/
│   │   └── token.ts                 SecureStore wrapper (token + user)
│   │
│   ├── hooks/
│   │   └── use-auth.ts              useAuth hook (AuthContext wrapper with guard)
│   │
│   ├── types/
│   │   ├── api.ts                   All backend DTOs and response types
│   │   └── global.d.ts              CSS module + NativeWind type declarations
│   │
│   ├── constants/
│   │   ├── config.ts                Env vars (API_URL, APP_NAME)
│   │   └── theme.ts                 Colors, typography, spacing
│   │
│   ├── utils/                       Utilities (empty, ready)
│   └── global.css                   Tailwind directives
│
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
│   └── if authenticated → redirect to /(protected)/dashboard
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
    ├── /dashboard
    ├── /expenses
    └── /profile
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
- **Expo Router default exports** — pages use `export default` (required by the router); all other components use named exports