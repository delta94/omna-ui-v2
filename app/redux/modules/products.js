import { fromJS, List } from 'immutable';
import * as types from 'dan-actions/actionConstants';

const initialState = fromJS({
  products: { data: [], pagination: {} },
  productVariants: [],
  loading: false,
  disabledForm: false,
  deleted: false,
  task: null
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
    case types.GET_PRODUCTS:
      return state.withMutations((mutableState) => {
        mutableState.set('products', action.data);
      });
    case types.LINK_PRODUCT:
      return state.withMutations((mutableState) => {
        mutableState.set('task', action.data);
      });
    case types.UNLINK_PRODUCT:
      return state.withMutations((mutableState) => {
        mutableState.set('task', action.data);
      });
    case types.DELETE_PRODUCT:
      return state.withMutations((mutableState) => {
        mutableState.set('deleted', action.data);
      });
    case types.RESET_DELETE_PRODUCT_FLAG:
      return state.withMutations((mutableState) => {
        mutableState.set('deleted', false);
      });
    case types.SET_LOADING:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', action.loading);
      });
    default:
      return state;
  }
}
