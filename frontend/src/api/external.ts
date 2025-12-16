import { apiClient } from './client';

export interface ExternalApiRequest {
  prompt: string;
}

export interface ExternalApiResponse {
  text: string;
  raw: any;
}

export const externalApi = {
  call: async (data: ExternalApiRequest): Promise<ExternalApiResponse> => {
    const response = await apiClient.post<ExternalApiResponse>('/external/call', data);
    return response.data;
  },
};
