import { api } from './client';
import { UserBrief } from '@/types/api';

export interface AdminStats {
  totalUsers: number;
  totalGroups: number;
  totalExpensesCount: number;
  totalAmountMoved: number;
}

export const adminService = {
  getStats: async (): Promise<AdminStats> => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  getUsers: async (): Promise<(UserBrief & { createdAt: string; _count: { members: number; expenses: number } })[]> => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  toggleUserSuspension: async (userId: string): Promise<{ id: string; email: string; isActive: boolean }> => {
    const response = await api.patch(`/admin/users/${userId}/toggle-suspend`);
    return response.data;
  },
};
