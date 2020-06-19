import { fromJS } from 'immutable';
import * as types from 'dan-actions/actionConstants';

const initialState = fromJS({
  variantList: { data: [], pagination: {} },
  variant: null,
  create: null,
  update: null,
  loading: false,
});

export default function variantsReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_VARIANTS:
      return state.withMutations((mutableState) => {
        mutableState.set('variantList', action.data);
      });
    case types.GET_VARIANT:
      return state.withMutations((mutableState) => {
        mutableState.set('variant', action.data);
      });
    case types.CREATE_VARIANT:
      return state.withMutations((mutableState) => {
        mutableState.set('create', action.data);
      });
    case types.UPDATE_VARIANT:
      return state.withMutations((mutableState) => {
        mutableState.set('update', action.data);
      });
    case types.UPDATE_INTEGRATION_VARIANT:
      return state.withMutations((mutableState) => {
        mutableState.set('update', action.data);
      });
    case types.SET_LOADING:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', action.loading);
      });
    default:
      return state;
  }
}
