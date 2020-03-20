import { put, takeLatest } from 'redux-saga/effects';
import * as actionConstants from 'dan-actions/actionConstants';
import api from 'dan-containers/Utils/api';

function* fetchFlows(params) {
  yield put({ type: actionConstants.GET_FLOWS_START });

  try {
    const response = yield api.get('/flows', { params : params.query });
    const { data } = response;
    yield put({ type: actionConstants.GET_FLOWS_SUCCESS, data });
  } catch (error) {
    yield put({ type: actionConstants.GET_FLOWS_FAILED, error });
  }
}

export default function* fetchFlowsWatcher() {
  yield takeLatest(actionConstants.GET_FLOWS, fetchFlows);
}

// export default function* flowsSaga() {
//   yield all([actionWatcher()]);
// }
