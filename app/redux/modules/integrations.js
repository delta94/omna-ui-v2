import { fromJS, List } from 'immutable';
import * as types from '../../actions/actionConstants';

const initialState = fromJS({
  productVariants: [],
  loadingState: false,
  disabledForm: false,
  product: null
});

export default function integrationsReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_PRODUCT_VARIANTS_ASYNC':
      return state.withMutations((mutableState) => {
        mutableState.set('productVariants', List(action.data));
      });
    case 'GET_PRODUCT_VARIANTS_ASYNC_LOADING':
      return state.withMutations((mutableState) => {
        mutableState.set('loadingState', action.loading);
      });
    case types.SET_PRODUCT:
      return state.withMutations((mutableState) => {
        mutableState.set('product', action.product);
      });
    default:
      return state;
  }
}
