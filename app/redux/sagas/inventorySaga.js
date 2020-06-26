import { all, put, takeLatest } from 'redux-saga/effects';
import * as actionConstants from 'dan-actions/actionConstants';
import { CENIT_APP as api } from 'dan-containers/Utils/api';

function* fetchInventoryEntries() {
  yield put({ type: actionConstants.ACTION_INVENTORY_START });

  try {
    const response = yield api.get(
      '/request_products?shop=playstoretestingone.myshopify.com&task=get_product_inventory'
      // { params: params.query }
    );
    const { data } = response;
    yield put({ type: actionConstants.GET_INVENTORY_ENTRIES_SUCCESS, data });
  } catch (error) {
    yield put({ type: actionConstants.GET_INVENTORY_ENTRIES_FAILED, error });
  }
}

function* fetchInventoryEntry(params) {
  yield put({ type: actionConstants.ACTION_INVENTORY_START });
  const { id } = params;

  try {
    const response = yield api.get(`/inventoryEntries/${id}`);
    const { data } = response;
    yield put({ type: actionConstants.GET_INVENTORY_ENTRY_SUCCESS, data });
  } catch (error) {
    yield put({ type: actionConstants.GET_INVENTORY_ENTRY_FAILED, error });
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actionConstants.GET_INVENTORY_ENTRIES, fetchInventoryEntries),
    takeLatest(actionConstants.GET_INVENTORY_ENTRY, fetchInventoryEntry)
  ]);
}
