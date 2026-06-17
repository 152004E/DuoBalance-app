# CLAUDE.md — AI Context for DuoBalance

## Project Overview
DuoBalance is a shared expense tracking app for couples. It consists of:
- **duobalance-api**: NestJS backend (TypeScript, Prisma, PostgreSQL) — auth, couples, expenses CRUD, balances, payments, settlements, dashboard
- **DuoBalance-app**: React Native + Expo SDK 56 mobile client (infrastructure built, auth scaffold in progress)

## Current State
- **API Client**: Axios instance with base URL and timeout ✅
- **Request Interceptor**: Injects Bearer token from SecureStore ✅
- **Secure Storage**: expo-secure-store wrapper for token + user data ✅
- **Auth Context**: AuthContext + AuthProvider with signIn/signOut/restoreSession ✅
- **useAuth Hook**: useContext wrapper with guard ✅
- **API Types**: Full backend DTOs and response types in `src/types/api.ts` ✅
- **Route Scaffolding**: (auth)/ and (protected)/ route groups created ✅
- **Auth Screens**: login.tsx and register.tsx (empty, pending implementation)
- **User model**: firstName + lastName instead of single name ✅ (migrated)
- **Backend tests**: 109 unit tests, all passing

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

## What to Build Next
1. Login screen (email + password form)
2. Register screen (firstName, lastName, email, password)
3. Root layout with AuthProvider + conditional routing
4. Protected layout with auth guard
5. Couple management screens (create, join)
6. Expense CRUD screens
7. Dashboard with balances

## Coding Style
- TypeScript strict, no `any`
- Named exports only
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
| File | Purpose |
|------|---------|
| `src/app/_layout.tsx` | Root layout |
| `src/app/index.tsx` | Home/splash screen |
| `src/app/(auth)/login.tsx` | Login screen |
| `src/app/(auth)/register.tsx` | Register screen |
| `src/app/(protected)/dashboard.tsx` | Dashboard screen |
| `src/app/(protected)/expenses.tsx` | Expenses screen |
| `src/app/(protected)/profile.tsx` | Profile screen |
| `src/features/auth/auth.context.tsx` | AuthContext + AuthProvider |
| `src/hooks/use-auth.ts` | useAuth hook |
| `src/storage/token.ts` | SecureStore wrapper |
| `src/services/api/client.ts` | Axios instance |
| `src/services/api/interceptor.ts` | Bearer token interceptor |
| `src/types/api.ts` | Backend DTOs and response types |
| `src/constants/config.ts` | Environment variables |
| `docs/ARCHITECTURE.md` | Full architecture docs |
| `docs/PLAN.md` | Implementation plan |
