import { GET_FLOWS } from '../../actions/actionConstants';

const initialState = { flows: { data: [], pagination: {} } };

const reducer = (state = initialState, action) => {
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
