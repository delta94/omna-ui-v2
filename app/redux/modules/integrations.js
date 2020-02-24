import { fromJS, List } from 'immutable';
import * as types from '../../actions/actionConstants';

const initialState = fromJS({
  product: null,
  name: '',
  description: '',
  price: null,
  variants: null,
  integrations: [],
  properties: [],
  productVariants: [],
  loadingState: false,
  disabledForm: false,

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
    case types.SET_PRODUCT_NAME:
      return state.withMutations((mutableState) => {
        mutableState.set('name', action.name);
      });
    case types.SET_PRODUCT_DESCRIPTION:
      return state.withMutations((mutableState) => {
        mutableState.set('description', action.description);
      });
    case types.SET_PRODUCT_PRICE:
      return state.withMutations((mutableState) => {
        mutableState.set('price', action.price);
      });
    case types.SET_PRODUCT_INTEGRATIONS:
      return state.withMutations((mutableState) => {
        mutableState.set('integrations', action.integrations);
      });
    case types.SET_PRODUCT_PROPERTIES:
      return state.withMutations((mutableState) => {
        mutableState.set('properties', action.properties);
      });
    default:
      return state;
  }
}
