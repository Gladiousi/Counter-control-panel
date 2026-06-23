import { types } from 'mobx-state-tree';

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
