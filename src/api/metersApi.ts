import axios from 'axios';
import type { AreaDTO, MeterDTO, PaginatedResponse } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
});

export const metersApi = {
  getMeters: async (limit: number = 20, offset: number = 0): Promise<PaginatedResponse<MeterDTO>> => {
    const response = await apiClient.get<PaginatedResponse<MeterDTO>>('/meters/', {
      params: { limit, offset },
    });
    return response.data;
  },

  getAreas: async (areaIds: string[]): Promise<PaginatedResponse<AreaDTO>> => {
    const params = new URLSearchParams();
    areaIds.forEach((id) => params.append('id_in', id));

    const response = await apiClient.get<PaginatedResponse<AreaDTO>>('/areas/', { params });
    return response.data;
  },

  deleteMeter: async (meterId: string): Promise<void> => {
    await apiClient.delete(`/meters/${meterId}/`);
  },
};