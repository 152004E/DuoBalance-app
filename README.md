# DuoBalance-app

Mobile client for DuoBalance. Built with React Native and Expo SDK 56.

## Stack

| Tecnología   | Versión  |
|-------------|----------|
| Expo SDK    | 56.0.12  |
| React Native| 0.85.3   |
| React       | 19.2.3   |
| Expo Router | 56.2.11  |
| NativeWind  | 4.2.5    |
| Tailwind CSS| 3.4.19   |
| TypeScript  | 6.0.3    |
| ESLint      | 9.39.4   |
| Prettier    | 3.8.4    |

## Requisitos

- Node.js >= 22.13
- pnpm >= 9

## Instalación

```bash
pnpm install
```

## Desarrollo

```bash
# Iniciar servidor de desarrollo
pnpm start

# iOS
pnpm ios

# Android
pnpm android

# Web
pnpm web
```

## Comandos útiles

```bash
# Lint
pnpm lint

# TypeScript check
pnpm tsc --noEmit

# Exportar build web
pnpm expo export --platform web

# Reset project (template inicial)
pnpm reset-project
```

## Variables de entorno

Crear archivo `.env` en la raíz:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_APP_NAME=DuoBalance
```

## Estructura

```
src/
├── app/           # Expo Router (file-based routing)
├── components/    # Componentes reutilizables
├── features/      # Módulos por feature
├── services/      # API calls, lógica de negocio
├── hooks/         # Custom hooks
├── utils/         # Utilidades
├── constants/     # Config, temas
├── types/         # Tipos globales
└── assets/        # Recursos estáticos
```

## Alias de imports

| Alias             | Destino            |
|------------------|--------------------|
| `@/`             | `./src/*`          |
| `@/assets/*`     | `./assets/*`       |
| `@components/*`  | `./src/components/*` |
| `@features/*`    | `./src/features/*`   |
| `@services/*`    | `./src/services/*`   |
| `@utils/*`       | `./src/utils/*`      |
| `@types/*`       | `./src/types/*`      |
