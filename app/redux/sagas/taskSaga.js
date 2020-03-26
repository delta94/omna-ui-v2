import { put, takeLatest } from 'redux-saga/effects';
import * as actionConstants from 'dan-actions/actionConstants';
import api from 'dan-containers/Utils/api';

function* fetchTasks(params) {
  yield put({ type: actionConstants.GET_TASKS_START });

  try {
    const response = yield api.get('/tasks', { params : params.query });
    const { data } = response;
    yield put({ type: actionConstants.GET_TASKS_SUCCESS, data });
  } catch (error) {
    yield put({ type: actionConstants.GET_TASKS_FAILED, error });
  }
}

export default function* fetchTasksWatcher() {
  yield takeLatest(actionConstants.GET_TASKS, fetchTasks);
}

// export default function* tasksSaga() {
//   yield all([actionWatcher()]);
// }
