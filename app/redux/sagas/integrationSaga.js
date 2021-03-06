import { all, put, takeLatest } from 'redux-saga/effects';
import * as actionConstants from 'dan-actions/actionConstants';
import api, { CENIT_APP } from 'dan-containers/Utils/api';
import { handleAuthorization } from 'dan-containers/Common/Utils';
import get from 'lodash/get';

const url = '/integrations';

function* fetchIntegrations(params) {
  yield put({ type: actionConstants.ACTION_INTEGRATION_START });

  try {
    const response = yield api.get(url, { params: params.query });
    const { data } = response;
    yield put({ type: actionConstants.GET_INTEGRATIONS_SUCCESS, data });
  } catch (error) {
    yield put({ type: actionConstants.GET_INTEGRATIONS_FAILED, error });
  }
}

function* createIntegration(params) {
  yield put({ type: actionConstants.ACTION_INTEGRATION_START });
  const {
    authorized, channel, name, enqueueSnackbar
  } = params;

  try {
    const response = yield api.post(url, {
      data: { name, channel }
    });
    const {
      data: { data }
    } = response;
    if (authorized && data.id) {
      const path = `integrations/${data.id}/authorize`;
      handleAuthorization(path);
    }
    enqueueSnackbar('Integration created successfully', {
      variant: 'success'
    });
    yield put({
      type: actionConstants.CREATE_INTEGRATION_SUCCESS,
      data
    });
  } catch (error) {
    enqueueSnackbar(error.response.data.message, {
      variant: 'error'
    });
    yield put({ type: actionConstants.CREATE_INTEGRATION_FAILED, error });
  }
}

function* updateIntegration(params) {
  yield put({ type: actionConstants.ACTION_INTEGRATION_START });
  const { integration } = params;
  const { name } = integration;

  try {
    const response = yield api.post(`${url}/${integration.id}`, {
      data: { name }
    });
    const {
      data: { data }
    } = response;
    yield put({
      type: actionConstants.UPDATE_INTEGRATION_SUCCESS,
      data
    });
  } catch (error) {
    yield put({ type: actionConstants.UPDATE_INTEGRATION_FAILED, error });
  }
}

function* deleteIntegration(params) {
  yield put({ type: actionConstants.ACTION_INTEGRATION_START });
  const { integrationId, enqueueSnackbar } = params;
  try {
    const response = yield api.delete(`${url}/${integrationId}`);
    const { data } = response.data;
    yield put({ type: actionConstants.ADD_TASK_NOTIFICATION, taskId: data.id });
    yield put({ type: actionConstants.DELETE_INTEGRATION_SUCCESS, data });
    enqueueSnackbar('Deleting integration ', { variant: 'info' });
  } catch (error) {
    const message = error.response.data.message ? `: ${error.response.data.message}` : '';
    enqueueSnackbar(`Error deleting integration${message}`, { variant: 'error' });
    yield put({ type: actionConstants.DELETE_INTEGRATION_FAILED, error });
  }
}

function* unauthorizeIntegration(params) {
  yield put({ type: actionConstants.ACTION_INTEGRATION_START });
  const { id } = params;

  try {
    yield api.delete(`${url}/${id}/authorize`, {
      data: { data: { integration_id: id } }
    });
    const response = yield api.get(url, { params: params.query });
    const { data } = response;
    yield put({ type: actionConstants.GET_INTEGRATIONS_SUCCESS, data });
  } catch (error) {
    yield put({ type: actionConstants.UNAUTHORIZE_INTEGRATION_FALIED, error });
  }
}

function* importResource(params) {
  const {
    id, resource, fromShopify, shop, enqueueSnackbar
  } = params.query;
  try {
    yield put({ type: actionConstants.SET_LOADING, loading: true });
    let response = null;

    if (fromShopify && resource === 'products') {
      response = yield CENIT_APP.get(
        `/request_products?shop=${shop}&task=import_from_integration&integration_id=${id}`
      );
    } else response = yield api.get(`/integrations/${id}/${resource}/import`);

    const { data } = response.data;
    yield put({ type: actionConstants.ADD_TASK_NOTIFICATION, taskId: data.id });
    enqueueSnackbar(`Importing ${resource}`, { variant: 'info' });
  } catch (error) {
    enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
      variant: 'error'
    });
  }
  yield put({ type: actionConstants.SET_LOADING, loading: false });
}

export default function* rootSaga() {
  yield all([
    takeLatest(actionConstants.GET_INTEGRATIONS, fetchIntegrations),
    takeLatest(actionConstants.CREATE_INTEGRATION, createIntegration),
    takeLatest(actionConstants.UPDATE_INTEGRATION, updateIntegration),
    takeLatest(actionConstants.DELETE_INTEGRATION, deleteIntegration),
    takeLatest(actionConstants.IMPORT_RESOURCE, importResource),
    takeLatest(actionConstants.UNAUTHORIZE_INTEGRATION, unauthorizeIntegration)
  ]);
}
