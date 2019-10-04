import { fromJS } from 'immutable';
import { GET_ORDERS } from '../../actions/actionConstants';

const initialState = { orders: { data: [], pagination: {} } };

const initialImmutableState = fromJS(initialState);

const reducer = (state = initialImmutableState, action = {}) => {
  switch (action.type) {
    case GET_ORDERS:
      return {
        ...state,
        orders: action.payload
      };
    default:
      return state;
  }
};

export default reducer;
