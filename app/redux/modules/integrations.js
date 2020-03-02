import { fromJS } from 'immutable';
import * as actionConstants from 'dan-actions/actionConstants';

const initialState = fromJS({
  integrations: { data: [], pagination: {} },
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
    default:
      return state;
  }
};
