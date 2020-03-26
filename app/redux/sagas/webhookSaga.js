import { put, takeLatest } from 'redux-saga/effects';
import * as actionConstants from 'dan-actions/actionConstants';
import api from 'dan-containers/Utils/api';

function* fetchWebhooks(params) {
  yield put({ type: actionConstants.GET_WEBHOOKS_START });

  try {
    const response = yield api.get('/webhooks', { params : params.query });
    const { data } = response;
    yield put({ type: actionConstants.GET_WEBHOOKS_SUCCESS, data });
  } catch (error) {
    yield put({ type: actionConstants.GET_WEBHOOKS_FAILED, error });
  }
}

export default function* fetchWebhooksWatcher() {
  yield takeLatest(actionConstants.GET_WEBHOOKS, fetchWebhooks);
}

// export default function* webhooksSaga() {
//   yield all([actionWatcher()]);
// }
