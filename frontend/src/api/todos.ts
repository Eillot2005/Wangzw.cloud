import { apiClient } from './client';

export interface Todo {
  id: number;
  owner_id: number;
  title: string;
  done: boolean;
  created_at: string;
  updated_at: string;
}

export interface TodoCreate {
  title: string;
}

export interface TodoUpdate {
  title?: string;
  done?: boolean;
}

export const todosApi = {
  list: async (done?: number): Promise<Todo[]> => {
    const params = done !== undefined ? { done } : {};
    const response = await apiClient.get<Todo[]>('/todos', { params });
    return response.data;
  },

  create: async (data: TodoCreate): Promise<Todo> => {
    const response = await apiClient.post<Todo>('/todos', data);
    return response.data;
  },

  update: async (id: number, data: TodoUpdate): Promise<Todo> => {
    const response = await apiClient.patch<Todo>(`/todos/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/todos/${id}`);
  },
};
