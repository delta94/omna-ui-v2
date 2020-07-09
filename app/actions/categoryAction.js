import * as types from './actionConstants';

export const getCategoryList = (integrationId, params, enqueueSnackbar)  => ({
  type: types.GET_CATEGROIES_ASYNC,
  integrationId,
  params,
  enqueueSnackbar
});

export const getCategories = () => {};
