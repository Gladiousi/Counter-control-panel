import { types, type Instance } from 'mobx-state-tree';
import { AreaModel } from './Models/AreaModels';
import type { AreaDTO } from '../types/api';

export const AreasStore = types
  .model('AreasStore', {
    items: types.optional(types.map(AreaModel), {}),
  })
  .views((self) => ({
    getById(id: string) {
      return self.items.get(id);
    },

    has(id: string): boolean {
      return self.items.has(id);
    },
  }))
  .actions((self) => ({
    cacheAreas(areas: AreaDTO[]) {
      areas.forEach((area) => {
        self.items.put({
          id: area.id,
          number: area.number,
          str_number: area.str_number,
          str_number_full: area.str_number_full,
          house: area.house
            ? { id: area.house.id, address: area.house.address }
            : null,
        });
      });
    },
  }));

export type IAreasStore = Instance<typeof AreasStore>;
