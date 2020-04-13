import * as types from './actionConstants';

export const getProductVariantList = (integrationId, remoteProductId) => ({
  type: types.GET_PRODUCT_VARIANTS,
  payload: { integrationId, remoteProductId }
});

export const linkProduct = (productId, integrationIds, enqueueSnackbar) => ({
  type: types.LINK_PRODUCT_ASYNC,
  productId,
  integrationIds,
  enqueueSnackbar
});

export const unLinkProduct = (productId ,integrationIds, enqueueSnackbar) => ({
  type: types.UNLINK_PRODUCT_ASYNC,
  productId,
  integrationIds,
  enqueueSnackbar
});
