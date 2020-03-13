import { fromJS } from 'immutable';
import * as actionConstants from 'dan-actions/actionConstants';

const initialState = fromJS({
  flows: { data: [], pagination: { total: 0 } },
  loading: false
});

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionConstants.GET_FLOWS_START:
      return state.withMutations(mutableState => {
        mutableState.set('loading', true);
      });
    case actionConstants.GET_FLOWS_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState.set('flows', fromJS(action.data));
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
