import { all, put, takeLatest } from 'redux-saga/effects';
import * as actionConstants from 'dan-actions/actionConstants';
import api from 'dan-containers/Utils/api';

function* fetchOrders(params) {
  yield put({ type: actionConstants.GET_ORDERS_START });

  try {
    const response = yield api.get('/orders', { params: params.query });
    const { data } = response;
    yield put({ type: actionConstants.GET_ORDERS_SUCCESS, data });
  } catch (error) {
    yield put({ type: actionConstants.GET_ORDERS_FAILED, error });
  }
}

function* fetchOrder(params) {
  yield put({ type: actionConstants.GET_ORDER_START });
  const { id } = params;

  try {
    const response = yield api.get(`/orders/${id}`);
    const { data } = response;
    yield put({ type: actionConstants.GET_ORDER_SUCCESS, data });
  } catch (error) {
    yield put({ type: actionConstants.GET_ORDER_FAILED, error });
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actionConstants.GET_ORDERS, fetchOrders),
    takeLatest(actionConstants.GET_ORDER, fetchOrder)
  ]);
}
