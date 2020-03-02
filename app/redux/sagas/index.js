import { all } from 'redux-saga/effects';
import orderSaga from './orderSaga';
import productSaga from './productSaga';

export default function* rootSaga() {
  yield all([orderSaga(), productSaga()]);
}
