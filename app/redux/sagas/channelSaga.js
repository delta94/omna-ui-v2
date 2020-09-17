import { put, takeLatest } from 'redux-saga/effects';
import * as actionConstants from 'dan-actions/actionConstants';
import api from 'dan-containers/Utils/api';

function* fetchChannels(params) {
  yield put({ type: actionConstants.ACTION_INTEGRATION_START });
  const { query } = params;
  try {
    const response = yield api.get(`/available/integrations/channels`, {
      params: query
    });
    const { data } = response;
    yield put({ type: actionConstants.GET_CHANNELS_SUCCESS, data });
  } catch (error) {
    yield put({ type: actionConstants.GET_CHANNELS_FAILED, error });
  }
}

export default function* fetchChannelsWatcher() {
  yield takeLatest(actionConstants.GET_CHANNELS, fetchChannels);
}
