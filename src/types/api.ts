export type MeterType = 'ColdWaterAreaMeter' | 'HotWaterAreaMeter' | string;

export type MeterDTO = {
  id: string;
  _type: MeterType[]; 
  installation_date: string;
  is_automatic: boolean | null;
  initial_values: number[];
  description: string | null;
  area: {
    id: string;
  };
}

export type AreaDTO = {
  id: string;
  name: string;
  house: string;
  apartment: string;
}

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}