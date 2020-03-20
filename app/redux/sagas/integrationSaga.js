import { put, takeLatest } from 'redux-saga/effects';
import * as actionConstants from 'dan-actions/actionConstants';
import api from 'dan-containers/Utils/api';

function* fetchIntegrations(params) {
  yield put({ type: actionConstants.GET_INTEGRATIONS_START });

  try {
    const response = yield api.get('/integrations', { params: params.query });
    const { data } = response;
    yield put({ type: actionConstants.GET_INTEGRATIONS_SUCCESS, data });
  } catch (error) {
    yield put({ type: actionConstants.GET_INTEGRATIONS_FAILED, error });
  }
}

export default function* fetchIntegrationsWatcher() {
  yield takeLatest(actionConstants.GET_INTEGRATIONS, fetchIntegrations);
}

// export default function* integrationsSaga() {
//   yield all([actionWatcher()]);
// }
