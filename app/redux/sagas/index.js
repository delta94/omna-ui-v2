import { all } from 'redux-saga/effects';
import orderSaga from './orderSaga';
import productSaga from './productSaga';
import integrationSaga from './integrationSaga';
import collectionSaga from './collectionSaga';

export default function* rootSaga() {
  yield all([orderSaga(), productSaga(), integrationSaga(), collectionSaga()]);
}
