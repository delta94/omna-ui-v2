import * as types from './actionConstants';

export const getCategoryList = (integrationId, params, enqueueSnackbar)  => ({
  type: types.GET_CATEGORIES,
  integrationId,
  params,
  enqueueSnackbar
});

export const getCategories = () => {};
