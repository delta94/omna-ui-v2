import { fromJS } from 'immutable';
import * as types from 'dan-actions/actionConstants';

const initialState = fromJS({
  categoryList: { data: [], pagination: { total: 0 } },
  category: null,
  error: null,
  loading: false
});

export default function categoriesReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_CATEGORIES_START:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', action.loading);
      });
    case types.GET_CATEGORIES_SUCCESS:
      return state.withMutations((mutableState) => {
        mutableState.set('categoryList', fromJS(action.data)).set('loading', false);
      });
    case types.GET_CATEGORIES_FAILED:
      return state.withMutations((mutableState) => {
        mutableState.set('error', fromJS(action.error)).set('loading', false);
      });
    default:
      return state;
  }
};
