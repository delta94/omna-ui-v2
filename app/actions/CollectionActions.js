import * as types from './actionConstants';

export const setCollectionList = (params) => ({
  type: types.SET_COLLECTIONS_ASYNC,
  params
});

export const installCollection = (id, enqueueSnackbar) => ({
  type: types.INSTALL_COLLECTION_ASYNC,
  id,
  enqueueSnackbar
});

export const uninstallCollection = (id, enqueueSnackbar) => ({
  type: types.UNINSTALL_COLLECTION_ASYNC,
  id,
  enqueueSnackbar
});
