import { fromJS } from 'immutable';
import * as actionConstants from 'dan-actions/actionConstants';

const initialState = { flows: { data: [], pagination: {} }, loading: false };

const initialImmutableState = fromJS(initialState);

const reducer = (state = initialImmutableState, action = {}) => {
  switch (action.type) {
    case actionConstants.GET_FLOWS_START:
      return state.withMutations(mutableState => {
        mutableState.set('loading', true);
      });
    case actionConstants.GET_FLOWS_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState.set('flows', action.data);
        mutableState.set('loading', false);
      });
    case actionConstants.GET_FLOWS_FAILED:
      return state.withMutations(mutableState => {
        mutableState.set('error', action.error);
        mutableState.set('loading', false);
      });
    default:
      return state;
  }
};

export default reducer;
