import { apiClient } from './client';

export interface Photo {
  id: number;
  filename: string;
  created_at: string;
  uploader_id?: number;
}

export const photosApi = {
  upload: async (file: File): Promise<{ id: number; status: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/photos/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  list: async (): Promise<Photo[]> => {
    const response = await apiClient.get<Photo[]>('/photos');
    return response.data;
  },

  // Admin endpoints
  listPending: async (): Promise<Photo[]> => {
    const response = await apiClient.get<Photo[]>('/admin/photos/pending');
    return response.data;
  },

  approve: async (id: number): Promise<void> => {
    await apiClient.post(`/admin/photos/${id}/approve`);
  },

  reject: async (id: number): Promise<void> => {
    await apiClient.post(`/admin/photos/${id}/reject`);
  },
};
