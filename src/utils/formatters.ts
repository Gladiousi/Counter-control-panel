import type { MeterType } from '../types/api';

export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
};

export const getMeterLabel = (typesArray: MeterType[] | undefined): string => {
  if (!typesArray || typesArray.length === 0) return 'Неизвестно';

  const mainType = typesArray[0];
  const labels: Record<string, string> = {
    ColdWaterAreaMeter: 'ХВС',
    HotWaterAreaMeter: 'ГВС',
  };

  return labels[mainType] || mainType;
};
