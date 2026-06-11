# Plan — What's Left to Implement (Frontend)

> **Nota:** El despliegue en tiendas de aplicaciones ocurre ÚNICAMENTE cuando el proyecto alcance estado beta. Hasta entonces todo corre en localhost con Expo Go.

## Legend
- ❌ Not Started

## Phase 1: Foundation
- [❌] Expo project init (`npx create-expo-app`)
- [❌] TypeScript config
- [❌] Navigation setup (React Navigation stack + tabs)
- [❌] Theme configuration (colors, typography, spacing)
- [❌] API client (axios instance with interceptors for auth)
- [❌] Environment config (API base URL)

## Phase 2: Auth Screens
- [❌] Login screen (email + password form)
- [❌] Registration screen (name + email + password)
- [❌] Token storage (expo-secure-store)
- [❌] Auth context/provider
- [❌] Protected route wrapper (redirect to login if no token)

## Phase 3: Couple Management
- [❌] Couple creation screen (generate/enter invitation code)
- [❌] Couple settings screen (view partner, leave couple)

## Phase 4: Expense Screens
- [❌] Expense list screen (flat list with category filters)
- [❌] Add expense screen (amount, description, category, split picker)
- [❌] Expense detail screen (full info + edit/delete)
- [❌] Split picker UI component (equal/percentage/custom)

## Phase 5: Dashboard
- [❌] Dashboard screen (summary cards: owed, debt, net)
- [❌] Balance chart per person
- [❌] Category breakdown chart
- [❌] Settlement suggestions list

## Phase 6: Receipt Capture
- [❌] Camera/gallery integration (expo-image-picker / expo-camera)
- [❌] Receipt preview screen
- [❌] Upload progress indicator
- [❌] Extracted data confirmation screen

## Phase 7: Payment Screens
- [❌] Pay screen (select amount, confirm payment)
- [❌] Payment history list
- [❌] Settlement suggestion cards

## Phase 8: Polish
- [❌] Push notifications (expo-notifications)
- [❌] Dark mode
- [❌] i18n (multi-language)
- [❌] Offline support
- [❌] App icon + splash screen

## Phase 9: Deployment — Beta
> Todo el desarrollo previo corre en localhost con Expo Go. Solo al llegar a beta se despliega.
- [❌] Conectar con backend desplegado (URL de producción)
- [❌] Generar APK con EAS Build (`eas build --platform android`)
- [❌] Pruebas en dispositivo físico con APK
- [❌] App store submission (Google Play)
- [❌] Preparar versión iOS (App Store)
