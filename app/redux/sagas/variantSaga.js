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

function* deleteVariant(payload) {
  const { productId, variantId, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    yield api.delete(`/products/${productId}/variants/${variantId}`);
    yield put({ type: types.DELETE_VARIANT, id: variantId });
    enqueueSnackbar('Variant deleted successfuly', {
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

export function* watchDeleteVariant() {
  yield takeLatest(types.DELETE_VARIANT_ASYNC, deleteVariant);
}

export function* watchUpdateIntegrationVariant() {
  yield takeLatest(types.UPDATE_INTEGRATION_VARIANT_ASYNC, updateIntegrationVariant);
}

export default function* variantSaga() {
  yield all([watchGetVariants(), watchGetVariant(), watchCreateVariant(), watchUpdateVariant(), watchDeleteVariant(), watchUpdateIntegrationVariant()]);
}
