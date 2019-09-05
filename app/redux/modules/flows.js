import { fromJS } from 'immutable';
import { GET_FLOWS } from '../../actions/actionConstants';

const initialState = { flows: { data: [], pagination: {} } };

const initialImmutableState = fromJS(initialState);

const reducer = (state = initialImmutableState, action = {}) => {
  switch (action.type) {
    case GET_FLOWS:
      return {
        ...state,
        flows: action.payload
      };
    default:
      return state;
  }
};

export default reducer;
