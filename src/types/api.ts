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
};

export interface AreaDTO {
  id: string;
  number: number;
  str_number: string;
  str_number_full: string;
  house: HouseDTO | null;
}

export type AreasResponse = {
  count: number;
  results: AreaDTO[];
};

export type HouseDTO = {
  id: string;
  address: string;
  fias_addrobjs?: string[];
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};
