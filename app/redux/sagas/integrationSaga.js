import { put, takeLatest, all } from 'redux-saga/effects';
import * as actionConstants from 'dan-actions/actionConstants';
import api from 'dan-containers/Utils/api';
import get from 'lodash/get';

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

function* importResource(params) {
  const { id, resource, enqueueSnackbar } = params.query;
  try {
    yield put({ type: actionConstants.SET_LOADING, loading: true });
    const response = yield api.get(`/integrations/${id}/${resource}/import`);
    const { data } = response.data;
    yield put({ type: actionConstants.IMPORT_RESOURCE, data });
    enqueueSnackbar(`Importing ${resource}`, { variant: 'info' });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: actionConstants.SET_LOADING, loading: false });
}

export function* fetchIntegrationsWatcher() {
  yield takeLatest(actionConstants.GET_INTEGRATIONS, fetchIntegrations);
}

export function* importResourceWatcher() {
  yield takeLatest(actionConstants.IMPORT_RESOURCE_ASYNC, importResource);
}

export default function* integrationSaga() {
  yield all([fetchIntegrationsWatcher(), importResourceWatcher()]);
}
