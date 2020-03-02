import { all } from 'redux-saga/effects';
import orderSaga from './orderSaga';
import productSaga from './productSaga';
import integrationSaga from './integrationSaga';

export default function* rootSaga() {
  yield all([orderSaga(), productSaga(), integrationSaga()]);
}
