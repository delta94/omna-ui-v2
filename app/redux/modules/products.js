import { Map, fromJS, List } from 'immutable';
import * as types from 'dan-actions/actionConstants';

const initialState = fromJS({
  products: { data: [], pagination: { total: 0 } },
  loading: false,
  disabledForm: false,
  deleted: false,
  task: null,
  error: null,
  properties: [],
  category: null,
  remoteIds: [],
  bulkEditData: Map({
    remoteIds: [],
    integration: '',
    category: '',
    properties: [],
    baseProperties: []
  }),
  filters: List([])
});

export default function integrationsReducer(state = initialState, action) {
  switch (action.type) {
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
    case types.BULK_LINK_PRODUCTS:
      return state.withMutations((mutableState) => {
        mutableState.set('task', action.data);
      });
    case types.BULK_UNLINK_PRODUCTS:
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
    case types.GET_PRODUCTS_FAILED:
      return state.withMutations(mutableState => {
        mutableState.set('error', action.error);
      });
    case types.UNSUBSCRIBE_PRODUCTS:
      return state.withMutations((mutableState) => {
        mutableState.set('products', { data: [], pagination: { total: 0 } });
      });
    case types.INIT_BULK_EDIT_PRODUCTS_DATA:
      return state.withMutations(mutableState => {
        mutableState.set('bulkEditData', Map(action.payload));
      });
    case types.GET_BULK_EDIT_PROPERTIES_SUCCESS:
      return state.withMutations(mutableState => {
        const { properties } = action.data;
        mutableState.setIn(['bulkEditData', 'properties'], properties);
      });
    case types.BULK_EDIT_PROPERTIES_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState.set('task', action.data).set('products', { data: [], pagination: { total: 0 } });
      });
    case types.IMPORT_PRODUCT_FROM_INTEGRATION_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState.set('task', action.data);
      });
    case types.GET_PRODUCT_CATEGORY_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState.set('category', Map(action.data));
      });
    case types.UPDATE_PRODUCT_FILTERS:
      return state.withMutations(mutableState => {
        mutableState.set('filters', List(action.filters));
      });
    case types.SET_LOADING:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', action.loading);
      });
    default:
      return state;
  }
}
