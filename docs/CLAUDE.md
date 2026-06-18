# CLAUDE.md — AI Context for DuoBalance

## Project Overview
DuoBalance is a shared expense tracking app for couples. It consists of:
- **duobalance-api**: NestJS backend (TypeScript, Prisma, PostgreSQL) — auth, couples, expenses CRUD, balances, payments, settlements, dashboard
- **DuoBalance-app**: React Native + Expo SDK 56 mobile client (auth flow complete, expense/couple screens in progress)

## Current State
- **WelcomeScreen**: Landing page with HeroSection (SVG gradient), BenefitCards, and CTA buttons ✅
- **API Client**: Axios instance with base URL and timeout ✅
- **Request Interceptor**: Injects Bearer token from SecureStore ✅
- **Secure Storage**: expo-secure-store wrapper for token + user data ✅
- **Auth Context**: AuthContext + AuthProvider with signIn/signOut/restoreSession ✅
- **useAuth Hook**: useContext wrapper with guard ✅
- **API Types**: Full backend DTOs and response types in `src/types/api.ts` ✅
- **Route Scaffolding**: (auth)/ and (protected)/ route groups created ✅
- **Protected Route Guard**: Redirects to /login if no user ✅
- **Conditional Routing**: index.tsx shows WelcomeScreen or redirects to Dashboard ✅
- **Login Screen**: Full implementation with form validation, API integration (login → getProfile → signIn) ✅
- **Register Screen**: UI complete with validation, pending backend connection 🔄
- **Forgot Password Screen**: UI complete, pending backend connection 🔄
- **Enhanced Input**: iconLeft support + animated focus border (reanimated, 500ms blur transition) ✅
- **Auth Components**: AuthHeader, AuthDivider, SocialLoginButton, AuthFooter — all reusable ✅
- **Backend tests**: 109 unit tests, all passing
- **CORS**: Enabled in backend for localhost:8081 ✅
- **User model**: firstName + lastName instead of single name ✅ (migrated)

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
- **react-native-reanimated** for animations (focus border transition)

## What to Build Next
1. Connect Register screen to backend (authService.register)
2. Connect Forgot Password screen to backend (needs new endpoint)
3. Response interceptor (401 → redirect to login)
4. Couple management screens (create, join)
5. Expense CRUD screens
6. Dashboard with balances

## Coding Style
- TypeScript strict, no `any`
- Named exports for reusable components; `export default` for Expo Router pages only
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
pnpm start -- --clear     # Start with clean cache
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
| `src/app/index.tsx` | Conditional entry (WelcomeScreen or Dashboard redirect) |
| `src/app/(auth)/login.tsx` | Login screen (full implementation) |
| `src/app/(auth)/register.tsx` | Register screen (UI complete) |
| `src/app/(auth)/forgot-password.tsx` | Forgot password screen (UI complete) |
| `src/app/(auth)/_layout.tsx` | Auth layout |
| `src/app/(protected)/_layout.tsx` | Protected layout with auth guard |
| `src/app/(protected)/dashboard.tsx` | Dashboard screen (placeholder) |
| `src/components/welcome/welcome-screen.tsx` | Welcome landing page |
| `src/components/auth/auth-header.tsx` | Logo + title header for auth screens |
| `src/components/auth/auth-divider.tsx` | "O continúa con" divider |
| `src/components/auth/social-login-button.tsx` | Google login button |
| `src/components/auth/auth-footer.tsx` | Auth navigation footer |
| `src/components/ui/button.tsx` | Reusable Button (variants, loading, icons) |
| `src/components/ui/input.tsx` | Enhanced Input (icon, animated focus border) |
| `src/features/auth/auth.context.tsx` | AuthContext + AuthProvider |
| `src/hooks/use-auth.ts` | useAuth hook |
| `src/storage/token.ts` | SecureStore wrapper |
| `src/services/api/client.ts` | Axios instance |
| `src/services/api/interceptor.ts` | Bearer token interceptor |
| `src/services/api/auth.ts` | Auth service (login, register, getProfile) |
| `src/types/api.ts` | Backend DTOs and response types |
| `src/constants/config.ts` | Environment variables |
| `docs/ARCHITECTURE.md` | Full architecture docs |
| `docs/PLAN.md` | Implementation plan |