import { fromJS } from 'immutable';
import * as types from 'dan-actions/actionConstants';

const initialState = fromJS({
  brandList: { data: [], pagination: { total: 0 } },
  brand: null,
  loading: false
});

export default function brandsReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_BRANDS:
      return state.withMutations((mutableState) => {
        mutableState.set('brandList', fromJS(action.data));
      });
    default:
      return state;
  }
};
