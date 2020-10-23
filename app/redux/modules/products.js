import { Map, fromJS, List } from 'immutable';
import * as types from 'dan-actions/actionConstants';

const initialState = fromJS({
  products: { data: [], pagination: { total: 0 } },
  page: 0,
  limit: 10,
  term: '',
  loading: false,
  disabledForm: false,
  task: null,
  error: null,
  bulkEditData: Map({
    remoteIds: [],
    integration: '',
    category: '',
    properties: []
  }),
  filters: List([])
});

export default function integrationsReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_PRODUCTS_START:
      return state.withMutations(mutableState => {
        mutableState.set('loading', action.loading);
      });
    case types.GET_PRODUCTS_SUCCESS:
      return state.withMutations((mutableState) => {
        mutableState.set('products', action.data).set('loading', false);
      });
    case types.GET_PRODUCTS_FAILED:
      return state.withMutations(mutableState => {
        mutableState.set('error', action.error).set('loading', false);
      });
    case types.DELETE_PRODUCT_START:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', action.loading);
      });
    case types.DELETE_PRODUCT_SUCCESS:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', action.loading);
      });
    case types.DELETE_PRODUCT_FAILED:
      return state.withMutations((mutableState) => {
        mutableState.set('error', action.error).set('loading', false);
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
        mutableState.setIn(['bulkEditData', 'properties'], action.data);
      });
    case types.BULK_EDIT_PROPERTIES_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState.set('task', action.data).set('products', { data: [], pagination: { total: 0 } });
      });
    case types.IMPORT_PRODUCT_FROM_INTEGRATION_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState.set('task', action.data);
      });
    case types.UPDATE_PRODUCT_FILTERS:
      return state.withMutations(mutableState => {
        mutableState.set('filters', List(action.filters));
      });
    case types.CHANGE_PRODUCTS_PAGE:
      return state.withMutations(mutableState => {
        mutableState.set('page', action.page);
      });
    case types.CHANGE_PRODUCTS_ROWS_PER_PAGE:
      return state.withMutations(mutableState => {
        mutableState.set('limit', action.limit);
      });
    case types.CHANGE_PRODUCTS_SEARCH_TERM:
      return state.withMutations(mutableState => {
        mutableState.set('term', action.term);
      });
    case types.RESET_PRODUCTS_TABLE:
      return state.withMutations(mutableState => {
        mutableState.set('limit', 10)
          .set('page', 0)
          .set('term', '')
          .set('filters', List([]));
      });
    case types.SET_LOADING:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', action.loading);
      });
    default:
      return state;
  }
}
