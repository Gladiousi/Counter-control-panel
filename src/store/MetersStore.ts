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
    getMissingAreaIds(metersData: MeterDTO[]) {
      const areaIds = metersData.map((meter) => meter.area.id);
      const uniqueIds = Array.from(new Set(areaIds));
      return uniqueIds.filter((id) => !self.areasCache.has(id));
    }
  }))
  .actions((self) => {
    const setLoading = (status: boolean) => {
      self.isLoading = status;
    };

    const setError = (errorMessage: string | null) => {
      self.error = errorMessage;
    };

    const setMetersData = (meters: MeterDTO[], totalCount: number) => {
      self.meters = cast(meters);
      self.count = totalCount;
    };

    const cacheAreas = (areas: AreaDTO[]) => {
      areas.forEach((area) => {
        self.areasCache.put({
          id: area.id,
          number: area.number,
          str_number: area.str_number,
          str_number_full: area.str_number_full,
          house: area.house ? { id: area.house.id, address: area.house.address } : null,
        });
      });
    };

    const adjustOffsetForDeletion = () => {
      if (self.meters.length === 1 && self.offset > 0) {
        self.offset = Math.max(0, self.offset - self.limit);
      }
    };

    const updateOffsetForPage = (pageNumber: number) => {
      const targetOffset = (pageNumber - 1) * self.limit;
      if (targetOffset >= 0) {
        self.offset = targetOffset;
        return true;
      }
      return false;
    };

    const loadAddresses = flow(function* (ids: string[]) {
      if (ids.length === 0) return;
      try {
        const data: PaginatedResponse<AreaDTO> = yield metersApi.getAreas(ids);
        cacheAreas(data.results);
      } catch (err) {
        console.error('Ошибка при загрузке адресов:', err);
      }
    });

    const loadMeters = flow(function* () {
      setLoading(true);
      setError(null);
      try {
        const data: PaginatedResponse<MeterDTO> = yield metersApi.getMeters(self.limit, self.offset);
        setMetersData(data.results, data.count);

        const missingIds = self.getMissingAreaIds(data.results);
        yield loadAddresses(missingIds);
      } catch (err) {
        setError('Не удалось загрузить данные счетчиков');
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    const deleteMeter = flow(function* (meterId: string) {
      setLoading(true);
      setError(null);
      try {
        yield metersApi.deleteMeter(meterId);
        adjustOffsetForDeletion();
        yield loadMeters();
      } catch (err) {
        setError('Не удалось удалить счётчик');
        console.error(err);
        setLoading(false);
      }
    });

    const setPage = (pageNumber: number) => {
      if (updateOffsetForPage(pageNumber)) {
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
