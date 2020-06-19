import { all } from 'redux-saga/effects';
import availableIntegrationSaga from './availableIntegrationSaga';
import orderSaga from './orderSaga';
import productSaga from './productSaga';
import integrationSaga from './integrationSaga';
import channelSaga from './channelSaga';
import flowSaga from './flowSaga';
import taskSaga from './taskSaga';
import webhookSaga from './webhookSaga';
import variantSaga from './variantSaga';

export default function* rootSaga() {
  yield all([
    availableIntegrationSaga(),
    channelSaga(),
    flowSaga(),
    integrationSaga(),
    orderSaga(),
    productSaga(),
    variantSaga(),
    taskSaga(),
    webhookSaga()
  ]);
}
