import { apiClient } from './client';

export interface Message {
  id: number;
  sender_id: number;
  content: string;
  created_at: string;
  sender_username: string;
}

export interface MessageCreate {
  content: string;
}

export const messagesApi = {
  list: async (limit = 100, offset = 0): Promise<Message[]> => {
    const response = await apiClient.get<Message[]>('/messages', {
      params: { limit, offset },
    });
    return response.data;
  },

  create: async (data: MessageCreate): Promise<Message> => {
    const response = await apiClient.post<Message>('/messages', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/messages/${id}`);
  },

  getUnreadCount: async (): Promise<{ unread: number }> => {
    const response = await apiClient.get<{ unread: number }>('/messages/unread_count');
    return response.data;
  },

  markRead: async (): Promise<void> => {
    await apiClient.post('/messages/mark_read');
  },
};
