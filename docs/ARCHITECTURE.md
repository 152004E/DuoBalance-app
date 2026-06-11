# Architecture & Project Structure

## Tech Stack (Planned)
- **Frontend**: React Native + Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State**: Local state + context
- **API Client**: Axios or fetch wrapper
- **Secure Storage**: expo-secure-store
- **Image Capture**: expo-image-picker / expo-camera
- **Package Manager**: pnpm

## Current State

The mobile app is a **git stub** — no source files yet. Only exists:

```
DuoBalance-app/
├── README.md       Project description
└── .git/           Git metadata
```

## Directory Structure (Planned)

```
DuoBalance-app/
├── src/
│   ├── App.tsx                    Root component with NavigationContainer
│   ├── navigation/
│   │   └── AppNavigator.tsx       Stack/Tab navigator
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── home/
│   │   │   └── DashboardScreen.tsx
│   │   ├── expenses/
│   │   │   ├── ExpenseListScreen.tsx
│   │   │   ├── AddExpenseScreen.tsx
│   │   │   └── ExpenseDetailScreen.tsx
│   │   ├── receipts/
│   │   │   └── ReceiptCaptureScreen.tsx
│   │   └── profile/
│   │       ├── ProfileScreen.tsx
│   │       └── CoupleSettingsScreen.tsx
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Loading.tsx
│   │   ├── expenses/
│   │   │   ├── ExpenseCard.tsx
│   │   │   └── SplitPicker.tsx
│   │   ├── balance/
│   │   │   ├── BalanceSummary.tsx
│   │   │   └── BalanceChart.tsx
│   │   └── receipts/
│   │       └── ReceiptPreview.tsx
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   │
│   ├── services/
│   │   └── api.ts                  API client (axios instance + interceptors)
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useExpenses.ts
│   │   └── useReceipts.ts
│   │
│   ├── types/
│   │   └── index.ts                Shared TypeScript interfaces
│   │
│   └── theme/
│       └── index.ts                Colors, typography, spacing
│
├── assets/
│   └── images/
├── app.json
├── package.json
└── tsconfig.json
```

## Screen Flow (Planned)

```
AppNavigator
├── AuthStack (not authenticated)
│   ├── LoginScreen
│   └── RegisterScreen
│
└── MainTabs (authenticated)
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
      └─ api.ts (axios)
          └─ duobalance-api (HTTP)
              └─ PostgreSQL
```

## Design Patterns (Planned)
- **Custom hooks** for data fetching and mutations
- **Context** for auth state and theme
- **Component composition** over inheritance
- **Props-based** component API
- **Separated API layer** — all HTTP calls through `services/api.ts`
