import { fromJS } from 'immutable';
import * as actionConstants from 'dan-actions/actionConstants';

const initialState = fromJS({
  integrations: { data: [], pagination: {} },
  channels: { data: [], pagination: {} },
  task: null,
  loading: false,
  error: ''
});

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionConstants.GET_INTEGRATIONS_START:
      return state.withMutations(mutableState => {
        mutableState.set('loading', true);
      });
    case actionConstants.GET_INTEGRATIONS_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState.set('integrations', action.data);
        mutableState.set('loading', false);
      });
    case actionConstants.GET_INTEGRATIONS_FAILED:
      return state.withMutations(mutableState => {
        mutableState.set('error', action.error);
        mutableState.set('loading', false);
      });
    case actionConstants.GET_CHANNELS_START:
      return state.withMutations(mutableState => {
        mutableState.set('loading', true);
      });
    case actionConstants.GET_CHANNELS_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState.set('channels', action.data);
        mutableState.set('loading', false);
      });
    case actionConstants.GET_CHANNELS_FAILED:
      return state.withMutations(mutableState => {
        mutableState.set('error', action.error);
        mutableState.set('loading', false);
      });
    case actionConstants.IMPORT_RESOURCE:
      return state.withMutations(mutableState => {
        mutableState.set('task', action.data);
      });
    case actionConstants.SET_LOADING:
      return state.withMutations(mutableState => {
        mutableState.set('loading', action.loading);
      });
    default:
      return state;
  }
};
