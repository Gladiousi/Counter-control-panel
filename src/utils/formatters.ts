import type { AreaModel } from '../store/Models/AreaModels';
import type { MeterType } from '../types/api';
import { type Instance } from 'mobx-state-tree';

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('ru-RU');
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

export const formatAddress = (area: Instance<typeof AreaModel>): string => {
  const baseAddress = area.house?.address || '';
  const apartment = area.str_number_full ? `, ${area.str_number_full}` : '';

  return `${baseAddress}${apartment}`.trim() || '—';
};
