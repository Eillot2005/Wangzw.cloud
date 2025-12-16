import { apiClient } from './client';
import { Todo } from './todos';
import { Message } from './messages';

export interface AuditLog {
  id: number;
  user_id: number;
  action: string;
  resource_type: string;
  resource_id: string | null;
  meta_json: any;
  created_at: string;
  username: string;
}

export interface Overview {
  todo_total: number;
  todo_open: number;
  message_total: number;
  external_call_today: number;
  external_call_last_7d: number;
  pending_photos: number;
  last_actions: Array<{
    id: number;
    action: string;
    resource_type: string;
    created_at: string;
  }>;
}

export const adminApi = {
  getOverview: async (): Promise<Overview> => {
    const response = await apiClient.get<Overview>('/admin/overview');
    return response.data;
  },

  getAuditLogs: async (params?: {
    action?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  }): Promise<AuditLog[]> => {
    const response = await apiClient.get<AuditLog[]>('/admin/audit', { params });
    return response.data;
  },

  getFriendTodos: async (): Promise<Todo[]> => {
    const response = await apiClient.get<Todo[]>('/admin/friend/todos');
    return response.data;
  },

  deleteFriendTodo: async (id: number): Promise<void> => {
    await apiClient.delete(`/admin/friend/todos/${id}`);
  },

  getFriendMessages: async (): Promise<Message[]> => {
    const response = await apiClient.get<Message[]>('/admin/friend/messages');
    return response.data;
  },
};
