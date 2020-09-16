import { fromJS } from 'immutable';
import * as types from 'dan-actions/actionConstants';

const initialState = fromJS({
  brandList: { data: [], pagination: { total: 0 } },
  brand: null,
  loading: false
});

export default function brandsReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_BRANDS_START:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', action.loading);
      });
    case types.GET_BRANDS:
      return state.withMutations((mutableState) => {
        mutableState.set('brandList', fromJS(action.data)).set('loading', false);
      });
    case types.GET_BRANDS_FAILED:
      return state.withMutations((mutableState) => {
        mutableState.set('error', fromJS(action.error)).set('loading', false);
      });
    default:
      return state;
  }
};
