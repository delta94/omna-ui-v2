import * as types from './actionConstants';

export const getProductProperties = () => ({
  type: types.GET_PRODUCT_PROPERTIES,
});

export const setProductProperties = (tabIndex, properties) => ({
  type: types.SET_PRODUCT_PROPERTIES,
  payload: { tabIndex, properties }
});

export const getProductVariantList = (integrationId, remoteProductId) => ({
  type: types.GET_PRODUCT_VARIANTS,
  payload: { integrationId, remoteProductId }
});

export const setProductDescription = (description) => ({
  type: types.SET_PRODUCT_DESCRIPTION,
  description
});

export const setProduct = (product) => ({
  type: types.SET_PRODUCT,
  product
});

/* export const getProductVariantList = () => (dispatch) => {
  dispatch({ type: 'GET_PRODUCT_VARIANTS', payload: {} });
}; */
