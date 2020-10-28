import * as types from './actionConstants';

export const getProductVariantList = (productId, params, enqueueSnackbar) => ({
  type: types.GET_VARIANTS_ASYNC,
  productId,
  params,
  enqueueSnackbar
});

export const getProducts = (payload) => ({
  type: types.GET_PRODUCTS,
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

export const deleteProduct = (productId, params, enqueueSnackbar) => ({
  type: types.DELETE_PRODUCT,
  productId,
  params,
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

export const bulkEditProperties = (shop, remoteIds, basicProperties, integrationProperties, enqueueSnackbar) => ({
  type: types.BULK_EDIT_PROPERTIES,
  shop,
  remoteIds,
  basicProperties,
  integrationProperties,
  enqueueSnackbar
});

export const importProductFromIntegration = (integrationId, remoteId, enqueueSnackbar) => ({
  type: types.IMPORT_PRODUCT_FROM_INTEGRATION,
  integrationId,
  remoteId,
  enqueueSnackbar
});

export const getProductCategory = (productId, integration, enqueueSnackbar) => ({
  type: types.GET_PRODUCT_CATEGORY,
  productId,
  integration,
  enqueueSnackbar
});

export const initBulkEditData = (payload) => ({
  type: types.INIT_BULK_EDIT_PRODUCTS_DATA,
  payload
});

export const updateProductFilters = (filters) => ({
  type: types.UPDATE_PRODUCT_FILTERS,
  filters
});

export const changePage = (page) => ({
  type: types.CHANGE_PRODUCTS_PAGE,
  page
});

export const changeRowsPerPage = (limit) => ({
  type: types.CHANGE_PRODUCTS_ROWS_PER_PAGE,
  limit
});

export const changeSearchTerm = (term) => ({
  type: types.CHANGE_PRODUCTS_SEARCH_TERM,
  term
});

export const resetTable = () => ({
  type: types.RESET_PRODUCTS_TABLE
});
