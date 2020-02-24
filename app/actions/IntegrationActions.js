import * as types from './actionConstants';

/* export const setProductProperties = (tabIndex, properties) => ({
  type: types.SET_PRODUCT_PROPERTIES,
  payload: { tabIndex, properties }
}); */

export const getProductVariantList = (integrationId, remoteProductId) => ({
  type: types.GET_PRODUCT_VARIANTS,
  payload: { integrationId, remoteProductId }
});

export const setProductName = (name) => ({
  type: types.SET_PRODUCT_NAME,
  name
});

export const setProductDescription = (description) => ({
  type: types.SET_PRODUCT_DESCRIPTION,
  description
});

export const setProductPrice = (price) => ({
  type: types.SET_PRODUCT_PRICE,
  price
});

export const setProduct = (product) => ({
  type: types.SET_PRODUCT,
  product
});

export const setProductIntegrations = (integrations) => ({
  type: types.SET_PRODUCT_INTEGRATIONS,
  integrations
});

export const setProductProperties = (properties) => ({
  type: types.SET_PRODUCT_PROPERTIES,
  properties
});

/* export const getProductVariantList = () => (dispatch) => {
  dispatch({ type: 'GET_PRODUCT_VARIANTS', payload: {} });
}; */
