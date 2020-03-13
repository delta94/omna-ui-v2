import { takeLatest, put, all } from 'redux-saga/effects';
import get from 'lodash/get';
import * as types from '../../actions/actionConstants';
import API from '../../containers/Utils/api';
import { GENERATED_TASK_INFO } from '../../components/Notification/AlertConstants';
import { goToTaskAction } from '../../components/Notification/AlertActions';

function* fetchCollectionsAsync(payload) {
  yield put({ type: types.SET_LOADING, data: true });
  const { params } = payload;
  const response = yield API.get('/collections', { params });
  const { data, pagination } = response.data;
  yield put({ type: types.SET_COLLECTIONS, data });
  yield put({ type: types.SET_TOTAL, data: pagination.total });
  yield put({ type: types.SET_LOADING, data: false });
}

function* installCollectionAsync(payload) {
  const { id, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, data: true });
    const response = yield API.patch(`/collections/${id}`);
    const { data } = response.data;
    enqueueSnackbar('Installing started', {
      variant: 'success'
    });
    yield put({ type: types.INSTALL_COLLECTION, data });
    const taskNotif = { message: GENERATED_TASK_INFO, variant: 'info', action: goToTaskAction(data.id)};
    yield put({ type: types.PUSH_NOTIFICATION, data: taskNotif });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, data: false });
}

function* uninstallCollectionAsync(payload) {
  const { id, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, data: true });
    const response = yield API.delete(`/collections/${id}`);
    const { data } = response.data;
    enqueueSnackbar('Uninstalling started', {
      variant: 'success'
    });
    yield put({ type: types.UNINSTALL_COLLECTION, data });
    const taskNotif = { message: GENERATED_TASK_INFO, variant: 'info', action: goToTaskAction(data.id)};
    yield put({ type: types.PUSH_NOTIFICATION, data: taskNotif });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, data: false });
}

export function* watchUninstallCollection() {
  yield takeLatest(types.UNINSTALL_COLLECTION_ASYNC, uninstallCollectionAsync);
}
export function* watchInstallCollection() {
  yield takeLatest(types.INSTALL_COLLECTION_ASYNC, installCollectionAsync);
}

export function* watchCollections() {
  yield takeLatest(types.SET_COLLECTIONS_ASYNC, fetchCollectionsAsync);
}

export default function* collectionSaga() {
  yield all([watchCollections(), watchInstallCollection(), watchUninstallCollection()]);
}
