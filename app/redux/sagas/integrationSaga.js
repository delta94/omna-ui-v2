import { all, put, takeLatest } from 'redux-saga/effects';
import * as actionConstants from 'dan-actions/actionConstants';
import api from 'dan-containers/Utils/api';

const url = '/integrations';

function* fetchIntegrations(params) {
  yield put({ type: actionConstants.GET_INTEGRATIONS_START });

  try {
    const response = yield api.get(url, { params: params.query });
    const { data } = response;
    yield put({ type: actionConstants.GET_INTEGRATIONS_SUCCESS, data });
  } catch (error) {
    yield put({ type: actionConstants.GET_INTEGRATIONS_FAILED, error });
  }
}

function* deleteIntegration(params) {
  yield put({ type: actionConstants.DELETE_INTEGRATION_START });
  const { integrationId } = params;

  try {
    yield api.delete(`${url}/${integrationId}`);
    yield put({
      type: actionConstants.DELETE_INTEGRATION_SUCCESS,
      integrationId
    });
  } catch (error) {
    console.log(error);
    yield put({ type: actionConstants.DELETE_INTEGRATION_FAILED, error });
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actionConstants.GET_INTEGRATIONS, fetchIntegrations),
    takeLatest(actionConstants.DELETE_INTEGRATION, deleteIntegration)
  ]);
}
