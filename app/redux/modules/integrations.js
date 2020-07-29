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
    case actionConstants.ACTION_INTEGRATION_START:
      return state.withMutations(mutableState => {
        mutableState.set('loading', true);
      });
    case actionConstants.GET_INTEGRATIONS_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState
          .set('integrations', fromJS(action.data))
          .set('loading', false);
      });
    case actionConstants.GET_INTEGRATIONS_FAILED:
      return state.withMutations(mutableState => {
        mutableState.set('error', action.error).set('loading', false);
      });
    case actionConstants.CREATE_INTEGRATION_SUCCESS:
      return state
        .updateIn(['integrations', 'data'], data =>
          data.unshift(fromJS(action.data))
        )
        .set('loading', false);
    case actionConstants.CREATE_INTEGRATION_FAILED:
      return state.withMutations(mutableState => {
        mutableState.set('error', action.error).set('loading', false);
      });
    case actionConstants.UPDATE_INTEGRATION_SUCCESS:
      return state
        .updateIn(['integrations', 'data'], data =>
          data.set(
            data.findIndex(item => item.get('id') === action.data.id),
            fromJS(action.data)
          )
        )
        .set('loading', false);
    case actionConstants.UPDATE_INTEGRATION_FAILED:
      return state.withMutations(mutableState => {
        mutableState.set('error', action.error).set('loading', false);
      });
    case actionConstants.DELETE_INTEGRATION_SUCCESS:
      return state.withMutations(mutableState => {
        const dataFiltered = mutableState
          .getIn(['integrations', 'data'])
          .filter(
            integration => integration.get('id') !== action.integrationId
          );

        mutableState
          .setIn(['integrations', 'data'], dataFiltered)
          .set('loading', false);
      });
    case actionConstants.DELETE_INTEGRATION_FAILED:
      return state.withMutations(mutableState => {
        mutableState.set('error', action.error).set('loading', false);
      });
    case actionConstants.GET_CHANNELS_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState.set('channels', action.data).set('loading', false);
      });
    case actionConstants.GET_CHANNELS_FAILED:
      return state.withMutations(mutableState => {
        mutableState.set('error', action.error).set('loading', false);
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
