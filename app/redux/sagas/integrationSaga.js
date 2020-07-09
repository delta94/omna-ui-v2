import { all, put, takeLatest } from 'redux-saga/effects';
import * as actionConstants from 'dan-actions/actionConstants';
import api, { CENIT_APP } from 'dan-containers/Utils/api';
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

function* updateIntegration(params) {
  yield put({ type: actionConstants.ACTION_INTEGRATION_START });
  const { integration } = params;

  try {
    yield api.put(`${url}/${integration.id}`, {
      data: integration
    });
    yield put({
      type: actionConstants.UPDATE_INTEGRATION_SUCCESS,
      integration
    });
  } catch (error) {
    yield put({ type: actionConstants.UPDATE_INTEGRATION_FAILED, error });
  }
}

function* deleteIntegration(params) {
  yield put({ type: actionConstants.ACTION_INTEGRATION_START });
  const { integrationId } = params;

  try {
    yield api.delete(`${url}/${integrationId}`);
    yield put({
      type: actionConstants.DELETE_INTEGRATION_SUCCESS,
      integrationId
    });
  } catch (error) {
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
  const { id, resource, fromShopify, shop, enqueueSnackbar } = params.query;
  try {
    yield put({ type: actionConstants.SET_LOADING, loading: true });
    let response = null;

    if (fromShopify && resource === 'products') {
      response = yield CENIT_APP.get(`/request_products?shop=${shop}&task=import_from_integration&integration_id=${id}`);
    } else response = yield api.get(`/integrations/${id}/${resource}/import`);

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

export default function* rootSaga() {
  yield all([
    takeLatest(actionConstants.GET_INTEGRATIONS, fetchIntegrations),
    takeLatest(actionConstants.UPDATE_INTEGRATION, updateIntegration),
    takeLatest(actionConstants.DELETE_INTEGRATION, deleteIntegration),
    takeLatest(actionConstants.IMPORT_RESOURCE_ASYNC, importResource),
    takeLatest(actionConstants.UNAUTHORIZE_INTEGRATION, unauthorizeIntegration)
  ]);
}
