# CLAUDE.md — AI Context for DuoBalance

## Project Overview
DuoBalance is a shared expense tracking app for couples. It consists of:
- **duobalance-api**: NestJS backend (TypeScript, Prisma, PostgreSQL)
- **DuoBalance-app**: React Native + Expo SDK 56 mobile client (scaffolded and configured)

The project is in early development — the API has a basic scaffold and a User model. The mobile app is initialized with Expo SDK 56, TypeScript 6, NativeWind v4, Expo Router, ESLint, and Prettier.

## Current State
- Backend has one `GET /` endpoint returning "Hello World!"
- Prisma schema has a single `User` model (id, name, email, password, createdAt)
- Database migration already applied
- Mobile app is scaffolded with Expo SDK 56, Expo Router, NativeWind, Tailwind CSS v3, TypeScript strict mode, ESLint + Prettier
- Home screen renders with NativeWind `className` props
- Import aliases configured: `@/`, `@components/`, `@features/`, `@services/`, `@utils/`, `@types/`
- Environment variables via `EXPO_PUBLIC_*` prefix

## Tech Decisions
- **pnpm** over npm/yarn (exclusively)
- **Prisma** as ORM (PostgreSQL)
- **NestJS v11** with decorators and DI
- **Jest** for testing (ts-jest for unit, supertest for e2e)
- **ESLint flat config** + Prettier
- **Expo SDK 56** with Expo Router (file-based routing, no React Navigation)
- **NativeWind v4** (stable) + Tailwind CSS v3 for styling
- **TypeScript 6** strict mode
- **react-native-reanimated** for animations

## What to Build Next
1. Auth screens (login/register with JWT + bcrypt)
2. Expense CRUD screens
3. Balance calculation UI
4. Couple/group management (linking two users)
5. Receipt upload with OCR
6. Payment tracking and settlement

## Coding Style
- TypeScript strict, no `any`
- Named exports only
- Functional components with hooks
- NativeWind `className` for styling (avoid StyleSheet when possible)
- Conventional commits (`feat:`, `fix:`, `chore:`)

## Testing
- `pnpm test` (not yet configured)
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
pnpm expo export --platform web  # Static export

# Backend
cd ../duobalance-api
pnpm install
pnpm start:dev
pnpm test
pnpm test:e2e
```

## Key Files
| File | Purpose |
|------|---------|
| `src/app/_layout.tsx` | Root layout + global CSS import |
| `src/app/index.tsx` | Home screen |
| `src/constants/config.ts` | Environment variables |
| `src/types/global.d.ts` | Global type declarations |
| `babel.config.js` | Babel + NativeWind preset |
| `metro.config.js` | Metro + NativeWind config |
| `tailwind.config.js` | Tailwind CSS content paths |
| `eslint.config.js` | ESLint flat config |
| `.env` | Environment variables (gitignored) |
| `docs/ARCHITECTURE.md` | Full architecture docs |
| `docs/PLAN.md` | Implementation plan |
