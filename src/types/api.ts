// ─── Enums ───────────────────────────────────────────
export enum ExpenseCategory {
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  RENT = 'RENT',
  SERVICES = 'SERVICES',
  ENTERTAINMENT = 'ENTERTAINMENT',
  OTHER = 'OTHER',
}
export interface UserBrief {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}


export enum SplitType {
  EQUAL = 'EQUAL',
  PERCENTAGE = 'PERCENTAGE',
  PERSONAL = 'PERSONAL',
  CUSTOM = 'CUSTOM',
}

// ─── API Envelope ────────────────────────────────────
export interface ApiError {
  statusCode: number;
  timestamp: string;
  path: string;
  message: string | object;
}

// ─── Auth ────────────────────────────────────────────
export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

// ─── Groups ────────────────────────────────────────
export interface UserBrief {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export type GroupType = 'PERSONAL' | 'COUPLE' | 'GROUP';

export interface GroupMember {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER';
  joinedAt: string;
  user: UserBrief;
}

export interface GroupResponse {
  id: string;
  name: string;
  inviteCode: string | null;
  type: GroupType;
  createdAt: string;
  members: GroupMember[];
}

export interface CreateGroupPayload {
  name: string;
  type?: GroupType;
}

export interface JoinGroupPayload {
  inviteCode: string;
}

export interface LeaveGroupResponse {
  message: string;
}

// ─── Expenses ────────────────────────────────────────
export interface CreateExpenseSplitPayload {
  userId: string;
  percentage: number;
}

export interface CreateExpensePayload {
  description: string;
  amount: number;
  category: ExpenseCategory;
  splitType: SplitType;
  splits?: CreateExpenseSplitPayload[];
}

export interface UpdateExpensePayload {
  description?: string;
  amount?: number;
  category?: ExpenseCategory;
  splitType?: SplitType;
  splits?: CreateExpenseSplitPayload[];
}

export interface ExpenseQueryParams {
  category?: ExpenseCategory;
  splitType?: SplitType;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface ExpenseSplitResponse {
  id: string;
  percentage: number;
  userId: string;
  expenseId: string;
  createdAt: string;
}

export interface ExpenseResponse {
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

// ─── Balances ────────────────────────────────────────
export type BalanceDirection = 'OWED_TO_ME' | 'I_OWE' | 'SETTLED';

export interface BalanceResponse {
  totalExpenses: number;
  totalPaidByMe: number;
  totalPaidByPartner: number;
  myShare: number;
  partnerShare: number;
  balance: number;
  direction: BalanceDirection;
}

// ─── Payments ────────────────────────────────────────
export interface CreatePaymentPayload {
  amount: number;
  toUserId: string;
}

export interface PaymentUser {
  id: string;
  firstName: string;
  lastName: string;
}

export interface PaymentResponse {
  id: string;
  amount: number;
  fromUserId: string;
  toUserId: string;
  groupId: string;
  createdAt: string;
  fromUser?: PaymentUser;
  toUser?: PaymentUser;
}

// ─── Settlements ─────────────────────────────────────
export interface SettlementResponse {
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

// ─── Dashboard ───────────────────────────────────────
export interface TopCategory {
  name: string;
  amount: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
}

export interface LastExpense {
  id: string;
  description: string;
  amount: number;
  createdAt: string;
}

export interface MonthlyComparison {
  currentMonth: number;
  previousMonth: number;
  difference: number;
  percentageChange: number | null;
}

export interface DashboardResponse {
  balance: {
    amount: number;
    direction: BalanceDirection;
  };
  settlement: {
    amount: number;
    direction: BalanceDirection;
  };
  monthExpenses: number;
  expenseCount: number;
  monthPayments: number;
  topCategory: TopCategory | null;
  expensesByCategory: CategoryBreakdown[];
  lastExpense: LastExpense | null;
  monthlyComparison: MonthlyComparison;
}

// ─── API Client Config ───────────────────────────────
export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
}
