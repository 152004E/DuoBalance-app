# Data Structures — Client-Side Types

All types are defined in `src/types/api.ts`. This file mirrors the backend DTOs and response shapes.

## Workspace (contexto global de trabajo)

El **workspace** es el espacio de trabajo actual de la aplicación: sobre qué categoría de grupos (o grupo específico) el usuario está operando en un momento dado. No es un filtro visual — es el contexto global que comparten Inicio, Gastos, Grupos y Reportes.

Definido en `src/features/workspace/workspace.types.ts` como **alias de `FilterState`** (`src/types/filter.ts`):

```typescript
// src/types/filter.ts
type FilterCategory = 'all' | 'personal' | 'couple' | 'group';

interface FilterState {
  category: FilterCategory;
  groupId: string | null; // null = todos los grupos de la categoría
}

// src/features/workspace/workspace.types.ts
type WorkspaceCategory = FilterCategory; // alias
interface WorkspaceState = FilterState;   // alias — mismo dato, nombre de dominio
```

Estados válidos:

```typescript
// Todos
{ category: 'all', groupId: null }

// Todos los personales
{ category: 'personal', groupId: null }

// Todas las parejas
{ category: 'couple', groupId: null }

// Grupo específico
{ category: 'group', groupId: 'abc123' }
```

### Acceso desde las pantallas

```typescript
const { workspace, setWorkspace } = useWorkspace();

// Atajos expresivos disponibles:
const { selectPersonal, selectCouple, selectGroup, resetWorkspace } = useWorkspace();
```

`WorkspaceProvider` envuelve los Tabs en `src/app/(protected)/_layout.tsx`. Todas las pantallas leen el mismo estado: al cambiar el workspace en una, todas se actualizan.

### Catálogo de categorías (`src/constants/categories.ts`)

Fuente única de verdad para metadatos de categorías (label, emoji, icono FontAwesome6, color):

```typescript
interface CategoryMeta {
  value: string;
  label: string;
  emoji: string;
  icon: string; // FontAwesome6
  color: string;
}

const MAIN_CATEGORIES: CategoryMeta[]; // Comida, Transporte, Vivienda, Servicios, Entretención
const EXTRA_CATEGORIES: CategoryMeta[]; // Salud, Educación, Compras, Suscripciones, Mascotas, Regalos, Viajes

// Mapas derivados para compatibilidad
const CATEGORY_LABELS: Record<string, string>;
const CATEGORY_ICONS: Record<string, string>;
const CATEGORY_COLORS: Record<string, string>;

function getCategoryMeta(value?: string | null): CategoryMeta; // fallback seguro → Otros
```

Las categorías extra se muestran en el filtro bajo el expandible "Otros" (no aparecen como chips principales).

### Períodos de Reportes (`use-reports-data.ts`)

```typescript
type ReportPeriod = 'Este mes' | 'Últimos 3 meses' | 'Este año' | 'Todo';

interface ReportsData {
  barData: { label: string; value: number; color: string }[]; // top 5 categorías
  donutData: { label: string; value: number; color: string }[]; // por miembro
  count: number;
  average: number;
  countComparison: number | null;   // % vs período anterior (null si 'Todo' o sin datos)
  averageComparison: number | null;
  isLoading: boolean;
  hasData: boolean;
  refetch: () => Promise<void>;
}
```

## Enums

```typescript
enum ExpenseCategory {
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  RENT = 'RENT',
  SERVICES = 'SERVICES',
  ENTERTAINMENT = 'ENTERTAINMENT',
  HEALTH = 'HEALTH',
  EDUCATION = 'EDUCATION',
  SHOPPING = 'SHOPPING',
  SUBSCRIPTIONS = 'SUBSCRIPTIONS',
  PETS = 'PETS',
  GIFTS = 'GIFTS',
  TRAVEL = 'TRAVEL',
  OTHER = 'OTHER',
}

enum SplitType {
  EQUAL = 'EQUAL',
  PERCENTAGE = 'PERCENTAGE',
  PERSONAL = 'PERSONAL',
  CUSTOM = 'CUSTOM',
}

type GroupType = 'PERSONAL' | 'COUPLE' | 'GROUP';
```

## Request Payloads

```typescript
// Auth
interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface RefreshTokenPayload {
  refreshToken: string;
}

// Groups
interface CreateGroupPayload {
  name: string;
  type?: GroupType;
}

interface JoinGroupPayload {
  inviteCode: string;
}

interface UpdateGroupPayload {
  name?: string;
}

// Expenses
interface CreateExpenseSplitPayload {
  userId: string;
  percentage: number;
}

interface CreateExpensePayload {
  description: string;
  amount: number;
  category: ExpenseCategory;
  splitType: SplitType;
  splits?: CreateExpenseSplitPayload[];
}

interface UpdateExpensePayload {
  description?: string;
  amount?: number;
  category?: ExpenseCategory;
  splitType?: SplitType;
  splits?: CreateExpenseSplitPayload[];
}

interface ExpenseQueryParams {
  category?: ExpenseCategory;
  splitType?: SplitType;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

// Payments
interface CreatePaymentPayload {
  amount: number;
  toUserId: string;
}
```

## Response Types

```typescript
// Auth
interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

// Groups
interface GroupMember {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  joinedAt: string;
  user: UserBrief;
}

interface GroupResponse {
  id: string;
  name: string;
  inviteCode: string | null;
  type: GroupType;
  createdAt: string;
  members: GroupMember[];
}

interface LeaveGroupResponse {
  message: string;
}

interface MemberSplitResponse {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  splitPercentage: number | null;
  userId: string;
  groupId: string;
  user: UserBrief;
}

interface MessageResponse {
  message: string;
}

// Expenses
interface ExpenseSplitResponse {
  id: string;
  percentage: number;
  userId: string;
  expenseId: string;
  createdAt: string;
}

interface ExpenseResponse {
  id: string;
  description: string;
  amount: number;
  category: ExpenseCategory;
  splitType: SplitType;
  paidById: string;
  groupId: string;
  splits: ExpenseSplitResponse[];
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// Balances
type BalanceDirection = 'OWED_TO_ME' | 'I_OWE' | 'SETTLED';

interface BalanceResponse {
  totalExpenses: number;
  totalPaidByMe: number;
  totalPaidByPartner: number;
  myShare: number;
  partnerShare: number;
  balance: number;
  direction: BalanceDirection;
}

// Payments
interface PaymentUser {
  id: string;
  name: string;
}

interface PaymentResponse {
  id: string;
  amount: number;
  fromUserId: string;
  toUserId: string;
  coupleId: string;
  createdAt: string;
  fromUser?: PaymentUser;
  toUser?: PaymentUser;
}

// Couple management
interface LeaveCoupleResponse {
  message: string;
}

// Settlements
interface SettlementResponse {
  totalExpenses: number;
  totalPaidByMe: number;
  totalPaidByPartner: number;
  myShare: number;
  partnerShare: number;
  balanceAmount: number;
  balanceDirection: BalanceDirection;
  paymentsMade: number;
  paymentsReceived: number;
  netSettlement: number;
  settlementDirection: BalanceDirection;
}

// Dashboard
interface TopCategory {
  name: string;
  amount: number;
}

interface CategoryBreakdown {
  category: string;
  amount: number;
}

interface LastExpense {
  id: string;
  description: string;
  amount: number;
  createdAt: string;
}

interface MonthlyComparison {
  currentMonth: number;
  previousMonth: number;
  difference: number;
  percentageChange: number | null;
}

interface DashboardResponse {
  balance: { amount: number; direction: BalanceDirection };
  settlement: { amount: number; direction: BalanceDirection };
  monthExpenses: number;
  expenseCount: number;
  monthPayments: number;
  topCategory: TopCategory | null;
  expensesByCategory: CategoryBreakdown[];
  lastExpense: LastExpense | null;
  monthlyComparison: MonthlyComparison;
}

// API Client Config
interface ApiConfig {
  baseUrl: string;
  timeout?: number;
}

// Error
interface ApiError {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | object;
}
```

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /auth/register | No | Register user |
| POST | /auth/login | No | Login, returns JWT |
| POST | /auth/refresh | No | Refresh access token |
| POST | /auth/logout | No | Revoke refresh token |
| GET | /auth/profile | Yes | Get current user |
| PATCH | /auth/profile | Yes | Update profile (firstName, lastName, email) |
| PATCH | /auth/password | Yes | Change password (currentPassword, newPassword) |
| POST | /auth/profile/avatar | Yes | Upload avatar image |
| POST | /groups | Yes | Create group |
| GET | /groups | Yes | Get my groups |
| GET | /groups/:id | Yes | Get group detail |
| PATCH | /groups/:id | Yes | Update group |
| DELETE | /groups/:id | Yes | Delete group |
| POST | /groups/join | Yes | Join group via invite code |
| POST | /groups/:id/regenerate-invite | Yes | Regenerate invite code |
| POST | /groups/:id/archive | Yes | Archive group |
| DELETE | /groups/:id/leave | Yes | Leave group |
| DELETE | /groups/:id/members/:memberId | Yes | Remove member |
| PATCH | /groups/:id/members/:memberId/split | Yes | Update member split % |
| POST | /expenses | Yes | Create expense |
| GET | /expenses | Yes | List expenses (with filters) |
| GET | /expenses/:id | Yes | Get expense detail |
| PATCH | /expenses/:id | Yes | Update expense |
| DELETE | /expenses/:id | Yes | Soft-delete expense |
| GET | /balances | Yes | Get balance summary |
| POST | /payments | Yes | Record payment |
| GET | /payments | Yes | Payment history |
| GET | /settlements | Yes | Net settlement calculation |
| GET | /dashboard | Yes | Dashboard summary |
