import { fromJS, List } from 'immutable';
import * as types from 'dan-actions/actionConstants';

const initialState = fromJS({
  productVariants: [],
  loading: false,
  disabledForm: false,
  linkProduct: null,
  unLinkProduct: null
});

export default function integrationsReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_PRODUCT_VARIANTS_ASYNC':
      return state.withMutations((mutableState) => {
        mutableState.set('productVariants', List(action.data));
      });
    case 'GET_PRODUCT_VARIANTS_ASYNC_LOADING':
      return state.withMutations((mutableState) => {
        mutableState.set('loading', action.loading);
      });
    case types.LINK_PRODUCT:
      return state.withMutations((mutableState) => {
        mutableState.set('linkProduct', action.data);
      });
    case types.UNLINK_PRODUCT:
      return state.withMutations((mutableState) => {
        mutableState.set('unLinkProduct', action.data);
      });
    case types.SET_LOADING:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', action.loading);
      });
    default:
      return state;
  }
}
