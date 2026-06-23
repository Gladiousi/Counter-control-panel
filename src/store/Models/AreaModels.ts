import { types } from 'mobx-state-tree';

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
