import { all } from 'redux-saga/effects';
import availableIntegrationSaga from './availableIntegrationSaga';
import orderSaga from './orderSaga';
import productSaga from './productSaga';
import integrationSaga from './integrationSaga';
import inventorySaga from './inventorySaga';
import channelSaga from './channelSaga';
import flowSaga from './flowSaga';
import taskSaga from './taskSaga';
import webhookSaga from './webhookSaga';
import variantSaga from './variantSaga';
import brandSaga from './brandSaga';
import categorySaga from './categorySaga';


export default function* rootSaga() {
  yield all([
    availableIntegrationSaga(),
    channelSaga(),
    flowSaga(),
    integrationSaga(),
    inventorySaga(),
    orderSaga(),
    productSaga(),
    variantSaga(),
    taskSaga(),
    webhookSaga(),
    brandSaga(),
    categorySaga()
  ]);
}
