import { types, type Instance } from 'mobx-state-tree';
import { MetersStore } from './MetersStore';
import { AreasStore } from './AreaStore';

export const RootStore = types.model('RootStore', {
  meters: MetersStore,
  areas: AreasStore,
});

export type IRootStore = Instance<typeof RootStore>;

export const rootStore = RootStore.create({
  meters: {},
  areas: {},
});
