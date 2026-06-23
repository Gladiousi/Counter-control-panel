import { types, flow, cast, type Instance } from 'mobx-state-tree';
import { metersApi } from '../api/metersApi';
import type { AreaDTO, MeterDTO, PaginatedResponse } from '../types/api';
import type { IAreasStore } from './AreaStore';
import { MeterModel } from './Models/MeterModel';

export const MetersStore = types
  .model('MetersStore', {
    meters: types.array(MeterModel),
    count: types.optional(types.number, 0),
    limit: types.optional(types.number, 20),
    offset: types.optional(types.number, 0),
    isLoading: types.optional(types.boolean, false),
    error: types.maybeNull(types.string),
  })
  .views((self) => ({
    get currentPage(): number {
      return Math.floor(self.offset / self.limit) + 1;
    },

    get totalPages(): number {
      return Math.ceil(self.count / self.limit) || 1;
    },

    get hasNextPage(): boolean {
      return self.offset + self.limit < self.count;
    },

    get hasPrevPage(): boolean {
      return self.offset > 0;
    },

    getMissingAreaIds(metersData: MeterDTO[]): string[] {
      const areaIds = metersData.map((meter) => meter.area.id);
      return Array.from(new Set(areaIds));
    },
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

    const adjustOffsetForDeletion = () => {
      if (self.meters.length === 1 && self.offset > 0) {
        self.offset = Math.max(0, self.offset - self.limit);
      }
    };

    const updateOffsetForPage = (pageNumber: number): boolean => {
      const targetOffset = (pageNumber - 1) * self.limit;
      if (targetOffset >= 0) {
        self.offset = targetOffset;
        return true;
      }
      return false;
    };

    const loadMeters = flow(function* (areasStore: IAreasStore) {
      setLoading(true);
      setError(null);

      try {
        const data: PaginatedResponse<MeterDTO> = yield metersApi.getMeters(
          self.limit,
          self.offset
        );

        setMetersData(data.results, data.count);

        const missingIds = self
          .getMissingAreaIds(data.results)
          .filter((id) => !areasStore.has(id));

        if (missingIds.length > 0) {
          const areasData: PaginatedResponse<AreaDTO> =
            yield metersApi.getAreas(missingIds);
          areasStore.cacheAreas(areasData.results);
        }
      } catch (err) {
        setError('Не удалось загрузить данные счетчиков');
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    const deleteMeter = flow(function* (
      meterId: string,
      areasStore: IAreasStore
    ) {
      setLoading(true);
      setError(null);

      try {
        yield metersApi.deleteMeter(meterId);
        adjustOffsetForDeletion();
        yield loadMeters(areasStore);
      } catch (err) {
        setError('Не удалось удалить счётчик');
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    const setPage = flow(function* (
      pageNumber: number,
      areasStore: IAreasStore
    ) {
      if (updateOffsetForPage(pageNumber)) {
        yield loadMeters(areasStore);
      }
    });

    return {
      loadMeters,
      deleteMeter,
      setPage,
    };
  });

export type IMetersStore = Instance<typeof MetersStore>;
