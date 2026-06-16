# Architecture & Project Structure

## Tech Stack
- **Frontend**: React Native + Expo SDK 56
- **Language**: TypeScript 6
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind v4 + Tailwind CSS v3
- **State**: Local state + context
- **API Client**: fetch wrapper (planned)
- **Secure Storage**: expo-secure-store (planned)
- **Image Capture**: expo-image-picker / expo-camera (planned)
- **Package Manager**: pnpm

## Current State

The mobile app is initialized with Expo SDK 56 and fully configured:

```
DuoBalance-app/
├── src/
│   ├── app/                    Expo Router (file-based routing)
│   │   ├── _layout.tsx         Root layout (imports global.css)
│   │   ├── index.tsx           Home screen (NativeWind styles)
│   │   └── explore.tsx         Explore screen (from template)
│   │
│   ├── components/             Reusable UI components
│   │   ├── animated-icon.tsx
│   │   ├── app-tabs.tsx
│   │   ├── external-link.tsx
│   │   ├── hint-row.tsx
│   │   ├── themed-text.tsx
│   │   ├── themed-view.tsx
│   │   ├── web-badge.tsx
│   │   └── ui/
│   │       └── collapsible.tsx
│   │
│   ├── constants/
│   │   ├── config.ts           App configuration (env vars)
│   │   └── theme.ts            Colors, typography, spacing
│   │
│   ├── hooks/
│   │   ├── use-color-scheme.ts
│   │   ├── use-color-scheme.web.ts
│   │   └── use-theme.ts
│   │
│   ├── features/               Feature modules (empty, ready)
│   ├── services/                API client (empty, ready)
│   ├── utils/                  Utilities (empty, ready)
│   ├── types/                  TypeScript types
│   │   └── global.d.ts         CSS module declarations + NativeWind types
│   ├── assets/                 Static resources (empty, ready)
│   └── global.css              Tailwind directives
│
├── assets/                     App assets (images, icons)
├── docs/                       Project documentation
├── app.json                    Expo configuration
├── babel.config.js             Babel + NativeWind preset
├── metro.config.js             Metro + NativeWind config
├── tailwind.config.js          Tailwind CSS configuration
├── tsconfig.json               TypeScript paths + strict mode
├── eslint.config.js            ESLint flat config
├── .prettierrc                 Prettier + Tailwind plugin
├── .prettierignore
├── .env / .env.example         Environment variables
├── nativewind-env.d.ts         NativeWind type declarations
├── package.json
└── pnpm-lock.yaml
```

## Screen Flow (Planned)

```
AppNavigator (Expo Router)
├── AuthGroup (not authenticated) — planned
│   ├── LoginScreen
│   └── RegisterScreen
│
└── MainTabs (authenticated) — planned
    ├── DashboardTab
    │   └── DashboardScreen
    ├── ExpensesTab
    │   ├── ExpenseListScreen
    │   ├── AddExpenseScreen
    │   └── ExpenseDetailScreen
    ├── ReceiptsTab
    │   └── ReceiptCaptureScreen
    └── ProfileTab
        ├── ProfileScreen
        └── CoupleSettingsScreen
```

## Data Flow (Planned)

```
Screen
  └─ hook (useExpenses)
      └─ api.ts (fetch/axios)
          └─ duobalance-api (HTTP)
              └─ PostgreSQL
```

## Design Patterns
- **File-based routing** with Expo Router
- **Custom hooks** for data fetching and mutations
- **NativeWind** for styling (Tailwind classes via `className`)
- **Context** for auth state and theme (planned)
- **Component composition** over inheritance
- **Separated API layer** — all HTTP calls through `src/services/`
