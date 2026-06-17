# Data Structures — Client-Side Types

All types are defined in `src/types/api.ts`. This file mirrors the backend DTOs and response shapes.

## Enums

```typescript
enum ExpenseCategory {
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  RENT = 'RENT',
  SERVICES = 'SERVICES',
  ENTERTAINMENT = 'ENTERTAINMENT',
  OTHER = 'OTHER',
}

enum SplitType {
  EQUAL = 'EQUAL',
  PERCENTAGE = 'PERCENTAGE',
  PERSONAL = 'PERSONAL',
  CUSTOM = 'CUSTOM',
}
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

interface RefreshTokenPayload {
  refreshToken: string;
}

// Couples
// POST /couples/join
interface JoinCouplePayload {
  inviteCode: string;
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

// Couples
interface UserBrief {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface CoupleResponse {
  id: string;
  inviteCode: string;
  createdAt: string;
  users: UserBrief[];
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
  coupleId: string;
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
interface DashboardResponse {
  balance: { amount: number; direction: BalanceDirection };
  settlement: { amount: number; direction: BalanceDirection };
  monthExpenses: number;
  expenseCount: number;
  monthPayments: number;
  topCategory: { name: string; amount: number } | null;
  expensesByCategory: { category: string; amount: number }[];
  lastExpense: { id: string; description: string; amount: number; createdAt: string } | null;
  monthlyComparison: {
    currentMonth: number;
    previousMonth: number;
    difference: number;
    percentageChange: number | null;
  };
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
| POST | /couples | Yes | Create couple |
| POST | /couples/join | Yes | Join couple via invite code |
| GET | /couples/me | Yes | Get my couple |
| DELETE | /couples/leave | Yes | Leave couple |
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
