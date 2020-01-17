import { takeLatest, put } from 'redux-saga/effects';
import API from '../containers/Utils/api';

function* prodVariantsAsync(dispatch) {
  const { integrationId, remoteProductId } = dispatch.payload;
  const params = { with_details: true };
  try {
    yield put({ type: 'GET_PRODUCT_VARIANTS_ASYNC_LOADING', loading: true });
    const response = yield API.get(`/integrations/${integrationId}/products/${remoteProductId}/variants`, { params });
    const { data } = response.data;
    yield put({ type: 'GET_PRODUCT_VARIANTS_ASYNC', data });
  } catch (error) {
    console.log('error fetching product variants');
  }
  yield put({ type: 'GET_PRODUCT_VARIANTS_ASYNC_LOADING', loading: false });
}

export default function* watchProdVariants() {
  yield takeLatest('GET_PRODUCT_VARIANTS', prodVariantsAsync);
}
