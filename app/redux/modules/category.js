import { fromJS } from 'immutable';
import * as types from 'dan-actions/actionConstants';

const initialState = fromJS({
  categoryList: { data: [], pagination: { total: 0 } },
  category: null,
  loading: false
});

export default function categoriesReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_CATEGORIES:
      return state.withMutations((mutableState) => {
        mutableState.set('categoryList', fromJS(action.data));
      });
    case types.SET_LOADING:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', action.loading);
      });
    default:
      return state;
  }
};
