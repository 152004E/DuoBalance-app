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

The mobile app has its infrastructure built and auth scaffold in progress:

```
DuoBalance-app/
├── src/
│   ├── app/                         Expo Router (file-based routing)
│   │   ├── _layout.tsx              Root layout (Stack navigator)
│   │   ├── index.tsx                Home screen (splash)
│   │   ├── (auth)/                  Auth group (unauthenticated routes)
│   │   │   ├── _layout.tsx          Auth layout
│   │   │   ├── login.tsx            Login screen
│   │   │   └── register.tsx         Register screen
│   │   └── (protected)/             Protected group (authenticated routes)
│   │       ├── _layout.tsx          Protected layout
│   │       ├── dashboard.tsx        Dashboard screen
│   │       ├── expenses.tsx         Expenses screen
│   │       └── profile.tsx          Profile screen
│   │
│   ├── features/                    Feature modules (domain-driven)
│   │   └── auth/
│   │       └── auth.context.tsx     AuthContext + AuthProvider
│   │
│   ├── services/
│   │   └── api/
│   │       ├── client.ts            Axios instance (baseURL, timeout)
│   │       └── interceptor.ts       Bearer token request interceptor
│   │
│   ├── storage/
│   │   └── token.ts                 SecureStore wrapper (token + user)
│   │
│   ├── hooks/
│   │   └── use-auth.ts              useAuth hook
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
│   ├── components/                  Reusable UI components (empty, ready)
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
├── (auth) — Not authenticated
│   ├── /login
│   └── /register
│
└── (protected) — Authenticated
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

## Design Patterns
- **File-based routing** with Expo Router
- **Custom hooks** for data fetching and mutations
- **NativeWind** for styling (Tailwind classes via `className`)
- **Context** for auth state
- **Feature modules** organized by domain (auth, expenses, etc.)
- **Separated API layer** — all HTTP calls through `src/services/api/`
