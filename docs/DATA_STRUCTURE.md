# Data Structures — Client-Side Types

## API Response Types (Consumed by the App)

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

interface AuthResponse {
  token: string;
  user: UserProfile;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface CoupleResponse {
  id: string;
  code: string;
  user1: UserProfile;
  user2?: UserProfile;
  balance: number;
  createdAt: string;
}

interface ExpenseResponse {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  paidBy: UserProfile;
  splitType: SplitType;
  yourShare: number;
  createdAt: string;
}

interface BalanceResponse {
  coupleId: string;
  totalOwed: number;
  totalDebt: number;
  netBalance: number;
  expenses: ExpenseResponse[];
  payments: PaymentResponse[];
}

interface PaymentResponse {
  id: string;
  amount: number;
  from: UserProfile;
  to: UserProfile;
  settledAt: string;
}

interface ReceiptUploadResponse {
  id: string;
  url: string;
  processed: boolean;
  extractedData?: {
    amount: number;
    date: string;
    merchant: string;
    items: string[];
  };
}
```

## Enums

```typescript
enum ExpenseCategory {
  FOOD = "FOOD",
  TRANSPORT = "TRANSPORT",
  HOUSING = "HOUSING",
  UTILITIES = "UTILITIES",
  ENTERTAINMENT = "ENTERTAINMENT",
  SHOPPING = "SHOPPING",
  HEALTH = "HEALTH",
  OTHER = "OTHER",
}

enum SplitType {
  EQUAL = "EQUAL",
  PERCENTAGE = "PERCENTAGE",
  CUSTOM = "CUSTOM",
}
```

## Navigation Types

```typescript
type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
};

type MainTabParamList = {
  Dashboard: undefined;
  Expenses: undefined;
  Receipts: undefined;
  Profile: undefined;
};

type ExpenseStackParamList = {
  ExpenseList: undefined;
  AddExpense: { receiptData?: ExtractedData };
  ExpenseDetail: { expenseId: string };
};
```

## Component Props

```typescript
interface ExpenseCardProps {
  expense: ExpenseResponse;
  onPress: (id: string) => void;
}

interface SplitPickerProps {
  amount: number;
  splitType: SplitType;
  onSplitChange: (type: SplitType, customSplits?: Record<string, number>) => void;
}

interface BalanceSummaryProps {
  totalOwed: number;
  totalDebt: number;
  netBalance: number;
}

interface ReceiptPreviewProps {
  uri: string;
  extractedData?: ExtractedData;
  onConfirm: () => void;
  onRetake: () => void;
}

type ExtractedData = {
  amount: number;
  date: string;
  merchant: string;
  items: string[];
};
```
