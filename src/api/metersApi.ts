import axios from 'axios';
import type { AreaDTO, MeterDTO, PaginatedResponse } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
});

export const metersApi = {
  getMeters: async (
    limit: number = 20,
    offset: number = 0
  ): Promise<PaginatedResponse<MeterDTO>> => {
    const response = await apiClient.get<PaginatedResponse<MeterDTO>>(
      '/meters/',
      {
        params: { limit, offset },
      }
    );
    return response.data;
  },

  getAreas: async (ids: string[]): Promise<PaginatedResponse<AreaDTO>> => {
    if (ids.length === 0) {
      return { count: 0, next: null, previous: null, results: [] };
    }

    const params = new URLSearchParams();
    ids.forEach((id) => params.append('id__in', id));
    const response = await apiClient.get<PaginatedResponse<AreaDTO>>(
      `/areas/?${params.toString()}`
    );

    return response.data;
  },

  deleteMeter: async (meterId: string): Promise<void> => {
    await apiClient.delete(`/meters/${meterId}/`);
  },
};
