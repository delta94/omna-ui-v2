import { put, takeLatest, all} from 'redux-saga/effects';
import * as types from 'dan-actions/actionConstants';

import api from 'dan-containers/Utils/api';
import get from 'lodash/get';

function* getBrands(payload) {
  const { integrationId, params, enqueueSnackbar } = payload;

  yield put({ type: types.SET_LOADING, loading: true });
  try {
    const response = yield api.get(`/integrations/${integrationId}/brands`, { params });
    const { data } = response;
    yield put({ type: types.GET_BRANDS, data });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });  }
}

export function* watchgetBrands() {
  yield takeLatest(types.GET_BRANDS_ASYNC, getBrands);
}

export default function* brandSaga() {
  yield all([watchgetBrands()]);
}
