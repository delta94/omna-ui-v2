import { takeLatest, put, all } from 'redux-saga/effects';
import * as types from 'dan-actions/actionConstants';
import get from 'lodash/get';
import api from 'dan-containers/Utils/api';

function* prodVariantsAsync(payload) {
  const { productId, enqueueSnackbar } = payload;
  const params = { with_details: true };
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

function* getProducts(payload) {
  const { params, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const response = yield api.get(`/products`, { params });
    const { data } = response;
    yield put({ type: types.GET_PRODUCTS, data });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, loading: false });
}

function* linkProduct(payload) {
  const { productId, integrationIds, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const response = yield api.put(`/products/${productId}`, { data: { integration_ids: integrationIds, link_with_its_variants: "All" } });
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
  const { productId, integrationIds, deleteFromIntegration, enqueueSnackbar } = payload;
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

function* deleteProduct(payload) {
  const { productId, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, loading: true });
    const response =  yield api.delete(`/products/${productId}`);
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

export function* watchProdVariants() {
  yield takeLatest(types.GET_VARIANTS_ASYNC, prodVariantsAsync);
}

export function* watchLinkProduct() {
  yield takeLatest(types.LINK_PRODUCT_ASYNC, linkProduct);
}

export function* watchUnLinkProduct() {
  yield takeLatest(types.UNLINK_PRODUCT_ASYNC, unLinkProduct);
}

export function* watchDeleteProduct() {
  yield takeLatest(types.DELETE_PRODUCT_ASYNC, deleteProduct);
}

export function* watchGetProducts() {
  yield takeLatest(types.GET_PRODUCTS_ASYNC, getProducts);
}

export default function* productSaga() {
  yield all([watchGetProducts(), watchLinkProduct(), watchProdVariants(), watchUnLinkProduct(), watchDeleteProduct()]);
}
