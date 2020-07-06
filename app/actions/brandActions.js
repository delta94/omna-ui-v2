import * as types from './actionConstants';

export const getBrandList = (integrationId, params, enqueueSnackbar)  => ({
  type: types.GET_BRANDS_ASYNC,
  integrationId,
  params,
  enqueueSnackbar
});

export const getBrands = () => {};
