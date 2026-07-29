export interface ExpenseParticipant {
  name: string;
  initials: string;
  amount: number;
  percentage: number;
  isPayer: boolean;
}

export interface ExpenseDetail {
  id: string;
  name: string;
  amount: number;
  description: string;
  category: string;
  categoryIcon: string;
  categoryColor: string;
  date: string;
  createdAt: string;
  updatedAt?: string;
  paidBy: { name: string; initials: string };
  group: { id: string; name: string; type: 'PERSONAL' | 'COUPLE' | 'GROUP' };
  participants: ExpenseParticipant[];
  receipt?: string;
  status: 'personal' | 'shared';
}

export const MOCK_EXPENSE_DETAIL: ExpenseDetail = {
  id: '1',
  name: 'Pizza Hut',
  amount: 80000,
  description: 'Cena de fin de semana con amigos',
  category: 'ALIMENTACIÓN',
  categoryIcon: 'utensils',
  categoryColor: '#F97316',
  date: '10 Julio 2026',
  createdAt: '10 Jul 2026, 19:45',
  updatedAt: 'Hace 1 hora',
  paidBy: { name: 'Emerson', initials: 'E' },
  group: { id: '1', name: 'Andrea', type: 'COUPLE' },
  participants: [
    {
      name: 'Emerson',
      initials: 'E',
      amount: 40000,
      percentage: 50,
      isPayer: true,
    },
    {
      name: 'Andrea',
      initials: 'A',
      amount: 40000,
      percentage: 50,
      isPayer: false,
    },
  ],
  receipt: 'https://placehold.co/600x400/006c49/ffffff?text=Comprobante',
  status: 'shared',
};
