import { takeLatest, put, all } from 'redux-saga/effects';
import get from 'lodash/get';
import * as types from '../../actions/actionConstants';
import API from '../../containers/Utils/api';
import { GENERATED_TASK_INFO } from '../../components/Notification/AlertConstants';
import { goToTaskAction } from '../../components/Notification/AlertActions';

function* fetchAvailableIntegrationAsync(payload) {
  const { params, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, data: true });
    const response = yield API.get('/available/integrations', { params });
    yield put({ type: types.GET_AVAILABLE_INTEGRATIONS, data: response.data });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, data: false });
}

function* installAvailableIntegrationAsync(payload) {
  const { id, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, data: true });
    const response = yield API.patch(`/available/integrations/${id}`);
    const { data } = response.data;
    enqueueSnackbar('Installing started', {
      variant: 'success'
    });
    yield put({ type: types.INSTALL_AVAILABLE_INTEGRATION, data });
    const taskNotif = { message: GENERATED_TASK_INFO, variant: 'info', action: goToTaskAction(data.id)};
    yield put({ type: types.PUSH_NOTIFICATION, data: taskNotif });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, data: false });
}

function* uninstallAvailableIntegrationAsync(payload) {
  const { id, enqueueSnackbar } = payload;
  try {
    yield put({ type: types.SET_LOADING, data: true });
    const response = yield API.delete(`/available/integrations/${id}`);
    const { data } = response.data;
    enqueueSnackbar('Uninstalling started', {
      variant: 'success'
    });
    yield put({ type: types.UNINSTALL_AVAILABLE_INTEGRATION, data });
    const taskNotif = { message: GENERATED_TASK_INFO, variant: 'info', action: goToTaskAction(data.id)};
    yield put({ type: types.PUSH_NOTIFICATION, data: taskNotif });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: types.SET_LOADING, data: false });
}

export function* watchUninstallAvailableIntegration() {
  yield takeLatest(types.UNINSTALL_AVAILABLE_INTEGRATION_ASYNC, uninstallAvailableIntegrationAsync);
}
export function* watchInstallAvailableIntegration() {
  yield takeLatest(types.INSTALL_AVAILABLE_INTEGRATION_ASYNC, installAvailableIntegrationAsync);
}

export function* watchAvailableIntegrations() {
  yield takeLatest(types.GET_AVAILABLE_INTEGRATIONS_ASYNC, fetchAvailableIntegrationAsync);
}

export default function* availableIntegrationSaga() {
  yield all([watchAvailableIntegrations(), watchInstallAvailableIntegration(), watchUninstallAvailableIntegration()]);
}
