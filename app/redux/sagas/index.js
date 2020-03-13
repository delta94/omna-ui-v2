import { all } from 'redux-saga/effects';
import orderSaga from './orderSaga';
import productSaga from './productSaga';
import integrationSaga from './integrationSaga';
import channelSaga from './channelSaga';
import flowSaga from './flowSaga';

export default function* rootSaga() {
  yield all([
    channelSaga(),
    flowSaga(),
    integrationSaga(),
    orderSaga(),
    productSaga()
  ]);
}
