# Contributing to DuoBalance-app

## Getting Started

```bash
git clone <repo-url>
cd DuoBalance-app
pnpm install
pnpm start
```

## Development Workflow

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/description
   ```

2. **Make changes** following the conventions in `AI_RULES.md`

3. **Run the app**:
   ```bash
   pnpm start           # Start dev server
   pnpm ios             # iOS simulator
   pnpm android         # Android emulator
   pnpm web             # Web browser
   ```

4. **Lint and type-check**:
   ```bash
   pnpm lint
   pnpm tsc --noEmit
   ```

5. **Commit** with conventional commit format:
   ```
   feat: add expense list screen
   fix: correct balance display on dashboard
   chore: update Expo SDK version
   ```

6. **Push and create a PR** to `main`

## Code Review Checklist
- [ ] Follows React Native best practices
- [ ] Uses NativeWind `className` for styling
- [ ] No `any` types
- [ ] Proper error handling (try/catch in API calls)
- [ ] Loading states handled
- [ ] Responsive layout (different screen sizes)
- [ ] Dark mode compatible
- [ ] Passes `pnpm lint` and `pnpm tsc --noEmit`

## Standards
- **TypeScript** strict mode
- **No `export default`** — always named exports
- **Functional components** with hooks (no class components)
- **Custom hooks** for data fetching logic
- **NativeWind** for styles (`className` prop, avoid `StyleSheet.create`)
- **Async/await** for API calls
- **pnpm** as package manager (do not use npm, yarn, or bun)

## Project Structure
```
DuoBalance-app/
├── src/
│   ├── app/              # Expo Router (file-based routing)
│   │   ├── (auth)/       # Unauthenticated routes
│   │   └── (protected)/  # Authenticated routes
│   ├── features/         # Feature modules (auth, couple, expenses, etc.)
│   ├── services/         # API client and external services
│   ├── storage/          # Secure storage wrappers
│   ├── context/          # Global contexts
│   ├── hooks/            # Custom React hooks
│   ├── components/       # Reusable UI components
│   ├── utils/            # Utility functions
│   ├── constants/        # Config, themes, constants
│   ├── types/            # TypeScript interfaces and declarations
│   └── global.css        # Tailwind directives
├── assets/               # App assets (images, icons)
└── docs/                 # Project documentation
```

## Import Aliases

| Alias             | Destination            |
|-------------------|------------------------|
| `@/`              | `./src/*`              |
| `@/assets/*`      | `./assets/*`           |
| `@components/*`   | `./src/components/*`   |
| `@features/*`     | `./src/features/*`     |
| `@services/*`     | `./src/services/*`     |
| `@context/*`      | `./src/context/*`      |
| `@storage/*`      | `./src/storage/*`      |
| `@utils/*`        | `./src/utils/*`        |
| `@types/*`        | `./src/types/*`        |

## Need Help?
Check `docs/` directory for detailed documentation on architecture, data structures, and roadmap.
