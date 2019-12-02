import { takeLatest, put } from 'redux-saga/effects';
import API from '../containers/Utils/api';

function* prodVariantsAsync(dispatch) {
  const { integrationId, remoteProductId } = dispatch.payload;
  const response = yield API.get(`/integrations/${integrationId}/products/${remoteProductId}/variants`);
  const { data } = response.data;
  yield put({ type: 'GET_PRODUCT_VARIANTS_ASYNC', data });
}

export default function* watchProdVariants() {
  yield takeLatest('GET_PRODUCT_VARIANTS', prodVariantsAsync);
}
