import { put, takeLatest, all} from 'redux-saga/effects';
import * as types from 'dan-actions/actionConstants';

import api from 'dan-containers/Utils/api';
import get from 'lodash/get';

function* getCategories(payload) {
  const { integrationId, params, enqueueSnackbar } = payload;

  yield put({ type: types.SET_LOADING, loading: true });
  try {
    const response = yield api.get(`/integrations/${integrationId}/categories`, { params });
    const { data } = response;
    yield put({ type: types.GET_CATEGORIES, data });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Getting categories error'), {
      variant: 'error'
    });  }
}

export function* watchgetCategories() {
  yield takeLatest(types.GET_CATEGROIES_ASYNC, getCategories);
}

export default function* categorySaga() {
  yield all([watchgetCategories()]);
}
