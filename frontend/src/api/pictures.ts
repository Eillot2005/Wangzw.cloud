import { apiClient } from './client';

export interface PictureInfo {
  name: string;
  size: number;
  content_type: string;
  created_at?: number;
}

export const picturesApi = {
  list: async (): Promise<PictureInfo[]> => {
    const response = await apiClient.get<PictureInfo[]>('/pictures');
    return response.data;
  },

  getUrl: (filename: string): string => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const token = localStorage.getItem('token');
    return `${baseUrl}/pictures/${filename}?token=${token}`;
  },
};
