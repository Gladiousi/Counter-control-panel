import { types, flow, cast, type Instance } from 'mobx-state-tree';
import { metersApi } from '../api/metersApi';
import type { MeterDTO, AreaDTO, PaginatedResponse } from '../types/api';

export const AreaModel = types.model('AreaModel', {
  id: types.identifier,
  number: types.number,
  str_number: types.string,
  str_number_full: types.string,
  house: types.maybeNull(
    types.model({
      id: types.string,
      address: types.string,
    })
  ),
});

export const MeterModel = types.model('MeterModel', {
  id: types.identifier,
  _type: types.array(types.string),
  installation_date: types.string,
  is_automatic: types.maybeNull(types.boolean),
  initial_values: types.array(types.number),
  description: types.maybeNull(types.string),
  area: types.model({
    id: types.string,
  }),
});

export const MetersStore = types
  .model('MetersStore', {
    meters: types.array(MeterModel),
    areasCache: types.optional(types.map(AreaModel), {}),
    count: types.optional(types.number, 0),
    limit: types.optional(types.number, 20),
    offset: types.optional(types.number, 0),
    isLoading: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
  })
  .views((self) => ({
    get currentPage() {
      return Math.floor(self.offset / self.limit) + 1;
    },
    get totalPages() {
      return Math.ceil(self.count / self.limit) || 1;
    },
    get hasNextPage() {
      return self.offset + self.limit < self.count;
    },
    get hasPrevPage() {
      return self.offset > 0;
    },
  }))
  .actions((self) => {
    const loadAddresses = flow(function* (ids: string[]) {
      try {
        const data: PaginatedResponse<AreaDTO> = yield metersApi.getAreas(ids);
        data.results.forEach((area) => {
          self.areasCache.put({
            id: area.id,
            number: area.number,
            str_number: area.str_number,
            str_number_full: area.str_number_full,
            house: area.house
              ? { id: area.house.id, address: area.house.address }
              : null,
          });
        });
      } catch (err) {
        console.error('Ошибка при загрузке адресов:', err);
      }
    });

    const loadMeters = flow(function* () {
      self.isLoading = true;
      self.error = null;
      try {
        const data: PaginatedResponse<MeterDTO> = yield metersApi.getMeters(
          self.limit,
          self.offset
        );

        self.meters = cast(data.results);
        self.count = data.count;

        const areaIds = data.results.map((meter) => meter.area.id);
        const uniqueIds = Array.from(new Set(areaIds));
        const missingIds = uniqueIds.filter((id) => !self.areasCache.has(id));

        if (missingIds.length > 0) {
          yield loadAddresses(missingIds);
        }
      } catch (err) {
        self.error = 'Не удалось загрузить данные счетчиков';
        console.error(err);
      } finally {
        self.isLoading = false;
      }
    });

    const deleteMeter = flow(function* (meterId: string) {
      self.isLoading = true;
      self.error = null;
      try {
        yield metersApi.deleteMeter(meterId);

        if (self.meters.length === 1 && self.offset > 0) {
          self.offset = Math.max(0, self.offset - self.limit);
        }

        yield loadMeters();
      } catch (err) {
        self.error = 'Не удалось удалить счётчик';
        console.error(err);
        self.isLoading = false;
      }
    });

    const setPage = (pageNumber: number) => {
      const targetOffset = (pageNumber - 1) * self.limit;
      if (targetOffset >= 0) {
        self.offset = targetOffset;
        loadMeters();
      }
    };

    return {
      loadMeters,
      loadAddresses,
      deleteMeter,
      setPage,
    };
  });

export type IMetersStore = Instance<typeof MetersStore>;
export const rootStore = MetersStore.create();
