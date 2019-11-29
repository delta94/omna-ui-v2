import { fromJS, List } from 'immutable';
import * as types from '../../actions/actionConstants';

const initialState = fromJS({
  productVariants: [],
  properties: null,
  disabledForm: false
});

export default function integrationsReducer(state = initialState, action) {
  switch (action.type) {
    case 'GET_PRODUCT_VARIANTS_ASYNC':
      return state.withMutations((mutableState) => {
        mutableState.set('productVariants', List(action.data));
      });
    case types.GET_PRODUCT_PROPERTIES:
      return state.withMutations((mutableState) => {
        mutableState.set('properties', action.properties);
      });
    case types.SET_PRODUCT_PROPERTIES:
      return state.withMutations((mutableState) => {
        const { tabIndex, properties } = action.payload;
        mutableState.set('properties', { tabIndex, values: properties });
      });
    default:
      return state;
  }
}
