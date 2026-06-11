# Contributing to DuoBalance-app

## Getting Started

```bash
git clone <repo-url>
cd DuoBalance-app
pnpm install
npx expo start
```

## Development Workflow

1. **Create a branch** from `main`:
   ```bash
   git checkout -b feature/description
   ```

2. **Make changes** following the conventions in `AI_RULES.md`

3. **Run the app**:
   ```bash
   npx expo start          # Start dev server
   npx expo start --ios    # iOS simulator
   npx expo start --android # Android emulator
   ```

4. **Commit** with conventional commit format:
   ```
   feat: add expense list screen
   fix: correct balance display on dashboard
   chore: update Expo SDK version
   ```

5. **Push and create a PR** to `main`

## Code Review Checklist
- [ ] Follows React Native best practices
- [ ] No `any` types
- [ ] Proper error handling (try/catch in API calls)
- [ ] Loading states handled
- [ ] Responsive layout (different screen sizes)
- [ ] Dark mode compatible
- [ ] Passes lint checks

## Standards
- **TypeScript** strict mode
- **No `export default`** — always named exports
- **Functional components** with hooks (no class components)
- **Custom hooks** for data fetching logic
- **StyleSheet.create** for styles (not inline styles)
- **Async/await** for API calls
- **pnpm** as package manager

## Project Structure
```
DuoBalance-app/
├── src/
│   ├── screens/       # Screen components (one per route)
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── services/      # API client and external services
│   ├── context/       # React Context providers
│   ├── navigation/    # Navigation configuration
│   ├── types/         # TypeScript interfaces
│   └── theme/         # Colors, typography, spacing
```

## Need Help?
Check `docs/` directory for detailed documentation on architecture, data structures, and roadmap.
