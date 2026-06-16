# AI Rules — Code Style & Patterns

## General Principles
- **TypeScript strict mode** always. Prefer interfaces over types for objects.
- **No `any`** unless absolutely unavoidable. Use `unknown` + type guards.
- **Async/await** over raw promises. No `.then()` chains.
- **Destructure** objects and arrays at binding sites.
- **Named exports** only. No `export default`.
- **Single responsibility**: one file = one class/function concern.

## Frontend (React Native + Expo)
- **File-based routing** with Expo Router (`src/app/` directory)
- **Components** are functional with hooks — no class components
- **NativeWind** for styling: use `className` prop, avoid `StyleSheet.create` when possible
- **Custom hooks** for data fetching, business logic, and state management
- **Import aliases**: use `@/`, `@components/`, `@features/`, `@services/`, `@utils/`, `@types/` instead of relative paths
- **API layer** goes through `src/services/`, never call fetch/axios directly in components
- **Loading states**, **error handling**, and **empty states** mandatory for every data-fetching screen
- **Dark mode** support via color scheme context
- **Environment variables** use `EXPO_PUBLIC_*` prefix

## NestJS Conventions
- **Controllers** are thin — delegate to services.
- **Services** contain business logic, call Prisma.
- **Modules** register providers and exports explicitly.
- **DTOs** for input validation (class-validator decorators).
- **Decorators** for routes, validation, auth guards.
- **PrismaService** is a singleton provider — inject not instantiate.

## Naming
- **Files**: `kebab-case.ts` (e.g., `auth.service.ts`)
- **Components**: `PascalCase.tsx` (e.g., `LoginScreen.tsx`)
- **Classes**: `PascalCase` (e.g., `AuthService`)
- **Functions/methods**: `camelCase` (e.g., `registerUser`)
- **Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **DTOs**: `CreateUserDto`, `LoginResponseDto`
- **Interfaces**: `IUserService` (prefix I for interfaces)
- **Enums**: `PascalCase` (e.g., `ExpenseCategory`)

## Prisma
- **Schema** is the source of truth — generate client from it.
- **Migrations** are version-controlled — never edit manually.
- **Queries** go through PrismaService, never raw SQL.
- **Relations** use Prisma's `include` / `select` for efficiency.

## Testing
- **Unit tests**: `*.spec.ts` — co-located with source.
- **E2E tests**: `*.e2e-spec.ts` — in `test/` directory.
- **Mock Prisma** via `@nestjs/testing` + custom provider.
- **Coverage threshold**: 80%+.

## Git
- **Conventional commits**: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`
- **Branch naming**: `feature/description`, `fix/description`, `chore/description`
- **No force pushes** to `main`.
- **PRs** squash-merge into `main`.

## Error Handling
- **HTTP exceptions**: use `@nestjs/common` exceptions (e.g., `NotFoundException`, `BadRequestException`).
- **Global exception filter** for unhandled errors.
- **Validation pipe** at module level for DTO validation.
- **Frontend**: try/catch in hooks, user-friendly error messages.

## Security
- **Passwords**: bcrypt hash, never plaintext.
- **JWT**: stored in HTTP-only cookies or Authorization header.
- **Input validation**: all endpoints validate DTOs.
- **Environment variables**: `.env` for secrets, never committed.
