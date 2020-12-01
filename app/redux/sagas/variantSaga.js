import { takeLatest, put, all } from 'redux-saga/effects';
import * as types from 'dan-actions/actionConstants';
import get from 'lodash/get';
import api from 'dan-containers/Utils/api';

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
    yield put({ type: types.ADD_TASK_NOTIFICATION, taskId: data.id });
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
    yield put({ type: types.ADD_TASK_NOTIFICATION, taskId: data.id });
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
  yield takeLatest(types.LINK_VARIANT, linkVariant);
}

export function* watchUnlinkVariant() {
  yield takeLatest(types.UNLINK_VARIANT, unlinkVariant);
}

export function* watchGetProductCategory() {
  yield takeLatest(types.GET_PRODUCT_CATEGORY, getProductCategory);
}

export default function* variantSaga() {
  yield all([watchGetVariants(), watchGetVariant(), watchCreateVariant(), watchUpdateVariant(),
    watchUpdateIntegrationVariant(), watchLinkVariant(), watchUnlinkVariant(), watchGetProductCategory()]);
}
