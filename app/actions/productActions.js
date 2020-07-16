import * as types from './actionConstants';

export const getProductVariantList = (productId, params, enqueueSnackbar) => ({
  type: types.GET_VARIANTS_ASYNC,
  productId,
  params,
  enqueueSnackbar
});

export const getProducts = (payload) => ({
  type: types.GET_PRODUCTS_ASYNC,
  params: payload.params,
  enqueueSnackbar: payload.enqueueSnackbar
});

export const getProductsByIntegration = (integrationId, params, enqueueSnackbar) => ({
  type: types.GET_PRODUCTS_BY_INTEGRATION_ASYNC,
  integrationId,
  params,
  enqueueSnackbar
});

export const linkProduct = (productId, integrationIds, enqueueSnackbar) => ({
  type: types.LINK_PRODUCT_ASYNC,
  productId,
  integrationIds,
  enqueueSnackbar
});

export const unLinkProduct = (productId, integrationIds, deleteFromIntegration, enqueueSnackbar) => ({
  type: types.UNLINK_PRODUCT_ASYNC,
  productId,
  integrationIds,
  deleteFromIntegration,
  enqueueSnackbar
});

export const deleteProduct = (productId, enqueueSnackbar) => ({
  type: types.DELETE_PRODUCT_ASYNC,
  productId,
  enqueueSnackbar
});

export const bulkLinkProducts = (shop, productIds, integrationIds, enqueueSnackbar) => ({
  type: types.BULK_LINK_PRODUCTS_ASYNC,
  shop,
  productIds,
  integrationIds,
  enqueueSnackbar
});

export const bulkUnlinkProducts = (shop, productIds, integrationIds, deleteFromIntegration, enqueueSnackbar) => ({
  type: types.BULK_UNLINK_PRODUCTS_ASYNC,
  shop,
  productIds,
  integrationIds,
  deleteFromIntegration,
  enqueueSnackbar
});

export const resetDeleteProductFlag = () => ({
  type: types.RESET_DELETE_PRODUCT_FLAG
});

export const unsubscribeProducts = () => ({
  type: types.UNSUBSCRIBE_PRODUCTS
});

export const getBulkEditProperties = (shop, integrationId, categoryId, enqueueSnackbar) => ({
  type: types.GET_BULK_EDIT_PROPERTIES,
  shop,
  integrationId,
  categoryId,
  enqueueSnackbar
});

export const bulkEditProperties = (shop, remoteIds, properties, enqueueSnackbar) => ({
  type: types.BULK_EDIT_PROPERTIES,
  shop,
  remoteIds,
  properties,
  enqueueSnackbar
});
