import { fromJS } from 'immutable';
import * as actionConstants from 'dan-actions/actionConstants';

const initialState = fromJS({
  orders: { data: [], pagination: {} },
  loading: false,
  error: ''
});

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case actionConstants.GET_ORDERS_START:
      return state.withMutations(mutableState => {
        mutableState.set('loading', true);
      });
    case actionConstants.GET_ORDERS_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState.set('orders', action.data);
        mutableState.set('loading', false);
      });
    case actionConstants.GET_ORDERS_FAILED:
      return state.withMutations(mutableState => {
        mutableState.set('error', action.error);
        mutableState.set('loading', false);
      });
    default:
      return state;
  }
};

export default reducer;
