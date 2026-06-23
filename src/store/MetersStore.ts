import { types, flow, type Instance } from 'mobx-state-tree';
import { metersApi } from '../api/metersApi';

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
    const loadMeters = flow(function* () {
      self.isLoading = true;
      self.error = null;
      try {
        const data = yield metersApi.getMeters(self.limit, self.offset);
        
        self.meters = data.results;
        self.count = data.count;
      } catch (err) {
        self.error = 'Не удалось загрузить данные счетчиков';
        console.error(err);
      } finally {
        self.isLoading = false;
      }
    });

    const nextPage = () => {
      if (self.hasNextPage) {
        self.offset += self.limit;
        loadMeters();
      }
    };

    const prevPage = () => {
      if (self.hasPrevPage) {
        self.offset = Math.max(0, self.offset - self.limit);
        loadMeters();
      }
    };

    const setPage = (pageNumber: number) => {
      const targetOffset = (pageNumber - 1) * self.limit;
      if (targetOffset >= 0 && targetOffset < self.count) {
        self.offset = targetOffset;
        loadMeters();
      }
    };

    return {
      loadMeters,
      nextPage,
      prevPage,
      setPage,
    };
  });

export type IMetersStore = Instance<typeof MetersStore>

export const rootStore = MetersStore.create();