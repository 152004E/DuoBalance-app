import { api } from './client';

export interface InAppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  url?: string;
  createdAt: string;
}

export const notificationService = {
  getNotifications: async () => {
    const { data } = await api.get<InAppNotification[]>('/notifications');
    return data;
  },

  markAsRead: async (id: string) => {
    const { data } = await api.patch(`/notifications/${id}/read`);
    return data;
  },

  markAllAsRead: async () => {
    const { data } = await api.patch('/notifications/read-all');
    return data;
  },
};
