import * as types from './actionConstants';

export const getVariantList = (productId, params, enqueueSnackbar) => ({
  type: types.GET_VARIANTS_ASYNC,
  productId,
  params,
  enqueueSnackbar
});

export const getVariant = (productId, variantId, enqueueSnackbar) => ({
  type: types.GET_VARIANT_ASYNC,
  productId,
  variantId,
  enqueueSnackbar
});

export const createVariant = (productId, data, enqueueSnackbar) => ({
  type: types.CREATE_VARIANT_ASYNC,
  productId,
  data,
  enqueueSnackbar
});

export const updateVariant = (productId, variantId, data, enqueueSnackbar) => ({
  type: types.UPDATE_VARIANT_ASYNC,
  productId,
  variantId,
  data,
  enqueueSnackbar
});

export const deleteVariant = (productId, variantId, enqueueSnackbar) => ({
  type: types.DELETE_VARIANT_ASYNC,
  productId,
  variantId,
  enqueueSnackbar
});

export const updateIntegrationVariant = (integrationId, remoteProductId, remoteVariantId, data, enqueueSnackbar) => ({
  type: types.UPDATE_INTEGRATION_VARIANT_ASYNC,
  integrationId,
  remoteProductId,
  remoteVariantId,
  data,
  enqueueSnackbar
});


