import { fromJS } from 'immutable';
import { GET_ORDERS } from '../../actions/actionConstants';

const initialState = fromJS({ orders: { data: [], pagination: {} } });

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case GET_ORDERS:
      return state.withMutations(mutableState => {
        mutableState.set('orders', action.payload);
      });
    default:
      return state;
  }
};

export default reducer;
