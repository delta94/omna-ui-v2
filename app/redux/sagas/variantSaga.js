import { takeLatest, put, all } from 'redux-saga/effects';
import * as types from 'dan-actions/actionConstants';
import get from 'lodash/get';
import api, { CENIT_APP } from 'dan-containers/Utils/api';

function* getVariants(payload) {
  const { productId, params, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const response = yield api.get(`/products/${productId}/variants`, { params });
    const { data } = response;
    yield put({ type: types.GET_VARIANTS, data });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, loading: false });
}

function* getVariant(payload) {
  const { productId, variantId, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const response = yield api.get(`/products/${productId}/variants/${variantId}`);
    const { data } = response.data;
    yield put({ type: types.GET_VARIANT, data });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, loading: false });
}

function* createVariant(payload) {
  const { productId, data, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const response = yield api.post(`/products/${productId}/variants`, { data });
    yield put({ type: types.CREATE_VARIANT, data: response.data.data });
    enqueueSnackbar('Variant created successfuly', {
      variant: 'success'
    });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, loading: false });
}

function* updateVariant(payload) {
  const { productId, variantId, data, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const response = yield api.post(`/products/${productId}/variants/${variantId}`, { data });
    yield put({ type: types.UPDATE_VARIANT, data: response.data.data });
    enqueueSnackbar('Variant edited successfuly', {
      variant: 'success'
    });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, loading: false });
}

function* updateIntegrationVariant(payload) {
  const { integrationId, remoteProductId, remoteVariantId, data, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const response = yield api.post(`integrations/${integrationId}/products/${remoteProductId}/variants/${remoteVariantId}`, { data });
    yield put({ type: types.UPDATE_INTEGRATION_VARIANT, data: response.data.data });
    enqueueSnackbar('Variant edited successfuly', {
      variant: 'success'
    });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, loading: false });
}

function* linkVariant(payload) {
  const { productId, variantId, integrationIds, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const response = yield api.put(`/products/${productId}/variants/${variantId}`, { data: { integration_ids: integrationIds } });
    const { data } = response.data;
    enqueueSnackbar('Linking variant', { variant: 'info' });
    yield put({ type: types.LINK_VARIANT, data });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, loading: false });
}

function* unlinkVariant(payload) {
  const { productId, variantId, integrationIds, deleteFromIntegration, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const response = yield api.patch(`/products/${productId}/variants/${variantId}`, { data: { integration_ids: integrationIds, delete_from_integration: deleteFromIntegration } });
    const { data } = response.data;
    enqueueSnackbar('Unlinking variant', { variant: 'info' });
    yield put({ type: types.UNLINK_VARIANT, data });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, loading: false });
}

function* getBulkEditProperties(payload) {
  const { shop, integrationId, categoryId, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const url = `/request_products?shop=${shop}&integration_id=${integrationId}&category_id=${categoryId}&task=get_product_properties`;
    const response = yield CENIT_APP.get(url);
    const { variant_properties: data } = response.data;
    yield put({ type: types.GET_BULK_EDIT_VARIANT_PROPERTIES_SUCCESS, data });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, loading: false });
}

function* bulkEditProperties(payload) {
  const { shop, remoteIds, basicProperties, integrationProperties, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const url = `/request_products?shop=${shop}&task=bulk_variant_properties`;
    const response = yield CENIT_APP.post(url, {
      data:
      {
        remotes_variants_id: remoteIds,
        basic_properties: basicProperties,
        integration_properties: integrationProperties
      }
    });
    const { data } = response.data;
    enqueueSnackbar('Updating variants', { variant: 'info' });
    yield put({ type: types.BULK_EDIT_VARIANT_PROPERTIES_SUCCESS, data });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, loading: false });
}

function* getProductCategory(payload) {
  const { productId, integration, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const response = yield api.get(`/products/${productId}`);
    const { data } = response.data;
    const id = integration ? integration.value || integration : '';
    const found = data.integrations.find(item => item.id === id);
    const { properties } = found.product;
    const category = properties.find(item => item.id.includes('category'));
    const bulkEditData = { remoteIds: [], category: category.value, integration: '', properties: [] };
    yield put({ type: types.GET_PRODUCT_CATEGORY_SUCCESS, bulkEditData });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, loading: false });
}

export function* watchGetVariants() {
  yield takeLatest(types.GET_VARIANTS_ASYNC, getVariants);
}

export function* watchGetVariant() {
  yield takeLatest(types.GET_VARIANT_ASYNC, getVariant);
}

export function* watchCreateVariant() {
  yield takeLatest(types.CREATE_VARIANT_ASYNC, createVariant);
}

export function* watchUpdateVariant() {
  yield takeLatest(types.UPDATE_VARIANT_ASYNC, updateVariant);
}

export function* watchUpdateIntegrationVariant() {
  yield takeLatest(types.UPDATE_INTEGRATION_VARIANT_ASYNC, updateIntegrationVariant);
}

export function* watchLinkVariant() {
  yield takeLatest(types.LINK_VARIANT_ASYNC, linkVariant);
}

export function* watchUnlinkVariant() {
  yield takeLatest(types.UNLINK_VARIANT_ASYNC, unlinkVariant);
}

export function* watchGetBulkEditProperties() {
  yield takeLatest(types.GET_BULK_EDIT_VARIANT_PROPERTIES, getBulkEditProperties);
}

export function* watchBulkEditProperties() {
  yield takeLatest(types.BULK_EDIT_VARIANT_PROPERTIES, bulkEditProperties);
}

export function* watchGetProductCategory() {
  yield takeLatest(types.GET_PRODUCT_CATEGORY, getProductCategory);
}

export default function* variantSaga() {
  yield all([watchGetVariants(), watchGetVariant(), watchCreateVariant(), watchUpdateVariant(),
    watchUpdateIntegrationVariant(), watchLinkVariant(), watchUnlinkVariant(),
    watchGetBulkEditProperties(), watchBulkEditProperties(), watchGetProductCategory()]);
}
