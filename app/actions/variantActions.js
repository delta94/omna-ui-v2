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

export const linkVariant = (productId, variantId, integrationIds, enqueueSnackbar) => ({
  type: types.LINK_VARIANT_ASYNC,
  productId,
  variantId,
  integrationIds,
  enqueueSnackbar
});

export const unlinkVariant = (productId, variantId, integrationIds, deleteFromIntegration, enqueueSnackbar) => ({
  type: types.UNLINK_VARIANT_ASYNC,
  productId,
  variantId,
  integrationIds,
  deleteFromIntegration,
  enqueueSnackbar
});

export const getBulkEditVariantProperties = (shop, integrationId, categoryId, enqueueSnackbar) => ({
  type: types.GET_BULK_EDIT_VARIANT_PROPERTIES,
  shop,
  integrationId,
  categoryId,
  enqueueSnackbar
});

export const bulkEditVariantProperties = (shop, remoteIds, basicProperties, integrationProperties, enqueueSnackbar) => ({
  type: types.BULK_EDIT_VARIANT_PROPERTIES,
  shop,
  remoteIds,
  basicProperties,
  integrationProperties,
  enqueueSnackbar
});

export const updateRemoteIds = (remoteIds) => ({
  type: types.UPDATE_VARIANT_REMOTE_IDS,
  remoteIds
});

export const initBulkEditData = (payload) => ({
  type: types.INIT_BULK_EDIT_VARIANTS_DATA,
  payload
});

export const updateFilters = (filters) => ({
  type: types.UPDATE_VARIANT_FILTERS,
  filters
});
