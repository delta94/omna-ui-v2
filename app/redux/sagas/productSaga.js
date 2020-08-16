import { takeLatest, put, all } from 'redux-saga/effects';
import * as types from 'dan-actions/actionConstants';
import get from 'lodash/get';
import api, { CENIT_APP } from 'dan-containers/Utils/api';

function* getProducts(payload) {
  const { params, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const response = yield api.get('/products', { params });
    const { data } = response;
    yield put({ type: types.GET_PRODUCTS, data });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, loading: false });
}

function* getProductCategory(payload) {
  const { productId, integrationId, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const response = yield api.get(`/products/${productId}`);
    const { data } = response.data;
    const integration = data.integrations.find(item => item.id === integrationId);
    const { properties } = integration.product;
    const category = properties.find(item => item.id.includes('category'));
    yield put({ type: types.GET_PRODUCT_CATEGORY_SUCCESS, data: { id: category.value, integration: integrationId } });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, loading: false });
}

function* getProductsByIntegration(payload) {
  const { integrationId, params, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const url = `/integrations/${integrationId}/products`;
    const response = yield api.get(url, { params });
    const { data } = response;
    yield put({ type: types.GET_PRODUCTS, data });
  } catch (error) {
    if (enqueueSnackbar) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    } else yield put({ type: types.GET_PRODUCTS_ERROR, error });
  }
  yield put({ type: types.SET_LOADING, loading: false });
}

function* linkProduct(payload) {
  const { productId, integrationIds, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const response = yield api.put(`/products/${productId}`, { data: { integration_ids: integrationIds, link_with_its_variants: 'All' } });
    const { data } = response.data;
    enqueueSnackbar('Linking product', { variant: 'info' });
    yield put({ type: types.LINK_PRODUCT, data });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, loading: false });
}

function* unLinkProduct(payload) {
  const {
    productId, integrationIds, deleteFromIntegration, enqueueSnackbar
  } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const response = yield api.patch(`/products/${productId}`, { data: { integration_ids: integrationIds, delete_from_integration: deleteFromIntegration } });
    const { data } = response.data;
    enqueueSnackbar('Unlinking product', { variant: 'info' });
    yield put({ type: types.UNLINK_PRODUCT, data });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, loading: false });
}

function* bulkLinkProducts(payload) {
  const {
    shop, productIds, integrationIds, enqueueSnackbar
  } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const url = `/request_products?shop=${shop}&task=bulk_edit_link_products`;
    const response = yield CENIT_APP.post(url, { data: { product_ids: productIds, integration_ids: integrationIds } });
    const { data } = response.data;
    enqueueSnackbar('Linking products', { variant: 'info' });
    yield put({ type: types.BULK_LINK_PRODUCTS, data });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, loading: false });
}

function* bulkUnlinkProducts(payload) {
  const {
    shop, productIds, integrationIds, enqueueSnackbar
  } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const url = `/request_products?shop=${shop}&task=bulk_edit_unlink_products`;
    const response = yield CENIT_APP.post(url, { data: { product_ids: productIds, integration_ids: integrationIds } });
    const { data } = response.data;
    enqueueSnackbar('Unlinking products', { variant: 'info' });
    yield put({ type: types.BULK_UNLINK_PRODUCTS, data });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, loading: false });
}

function* deleteProduct(payload) {
  const { productId, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const response = yield api.delete(`/products/${productId}`);
    const { success } = response.data;
    enqueueSnackbar('Deleted product successfully', { variant: 'success' });
    yield put({ type: types.DELETE_PRODUCT, data: success });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, loading: false });
}

function* getBulkEditProperties(payload) {
  const {
    shop, integrationId, categoryId, enqueueSnackbar
  } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const url = `/request_products?shop=${shop}&integration_id=${integrationId}&category_id=${categoryId}&task=get_product_properties`;
    const response = yield CENIT_APP.get(url);
    const { product_properties: data } = response.data;
    yield put({ type: types.GET_BULK_EDIT_PROPERTIES_SUCCESS, data });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, loading: false });
}

function* bulkEditProperties(payload) {
  const {
    shop, remoteIds, properties, enqueueSnackbar
  } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const url = `/request_products?shop=${shop}&task=bulk_product_properties`;
    const response = yield CENIT_APP.post(url, { data: { remotes_id: remoteIds, properties } });
    const { data } = response.data;
    enqueueSnackbar('Updating products', { variant: 'info' });
    yield put({ type: types.BULK_EDIT_PROPERTIES_SUCCESS, data });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, loading: false });
}

function* importProductFromIntegration(payload) {
  const { integrationId, remoteId, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const url = `/integrations/${integrationId}/products/${remoteId}/import`;
    const response = yield api.get(url);
    const { data } = response.data;
    yield put({ type: types.IMPORT_PRODUCT_FROM_INTEGRATION_SUCCESS, data });
    if (enqueueSnackbar) {
      enqueueSnackbar('Importing product', { variant: 'info' });
    }
  } catch (error) {
    if (enqueueSnackbar) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    } else yield put({ type: types.GET_PRODUCTS_ERROR, error });
  }
  yield put({ type: types.SET_LOADING, loading: false });
}

export function* watchLinkProduct() {
  yield takeLatest(types.LINK_PRODUCT_ASYNC, linkProduct);
}

export function* watchUnLinkProduct() {
  yield takeLatest(types.UNLINK_PRODUCT_ASYNC, unLinkProduct);
}

export function* watchBulkLinkProducts() {
  yield takeLatest(types.BULK_LINK_PRODUCTS_ASYNC, bulkLinkProducts);
}

export function* watchBulkUnlinkProducts() {
  yield takeLatest(types.BULK_UNLINK_PRODUCTS_ASYNC, bulkUnlinkProducts);
}

export function* watchDeleteProduct() {
  yield takeLatest(types.DELETE_PRODUCT_ASYNC, deleteProduct);
}

export function* watchGetProducts() {
  yield takeLatest(types.GET_PRODUCTS_ASYNC, getProducts);
}

export function* watchGetProductsByIntegration() {
  yield takeLatest(types.GET_PRODUCTS_BY_INTEGRATION_ASYNC, getProductsByIntegration);
}

export function* watchGetBulkEditProperties() {
  yield takeLatest(types.GET_BULK_EDIT_PROPERTIES, getBulkEditProperties);
}

export function* watchBulkEditProperties() {
  yield takeLatest(types.BULK_EDIT_PROPERTIES, bulkEditProperties);
}

export function* watchImportProductFromIntegration() {
  yield takeLatest(types.IMPORT_PRODUCT_FROM_INTEGRATION, importProductFromIntegration);
}

export function* watchGetProductCategory() {
  yield takeLatest(types.GET_PRODUCT_CATEGORY, getProductCategory);
}

export default function* productSaga() {
  yield all([watchGetProducts(), watchLinkProduct(), watchUnLinkProduct(), watchDeleteProduct(),
    watchBulkLinkProducts(), watchBulkUnlinkProducts(), watchGetProductsByIntegration(),
    watchGetBulkEditProperties(), watchBulkEditProperties(), watchImportProductFromIntegration(),
    watchGetProductCategory()]);
}
