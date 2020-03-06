import * as types from './actionConstants';

export const setCollectionList = (params) => ({
  type: types.SET_COLLECTIONS_ASYNC,
  params
});

export const installCollection = (id) => ({
  type: types.INSTALL_COLLECTION_ASYNC,
  id
});

export const uninstallCollection = (id) => ({
  type: types.UNINSTALL_COLLECTION_ASYNC,
  id
});
