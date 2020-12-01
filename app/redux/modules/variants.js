import { fromJS, Map, List } from 'immutable';
import * as types from 'dan-actions/actionConstants';

const initialState = fromJS({
  variantList: { data: [], pagination: {} },
  params: Map({
    offset: 0,
    limit: 10,
    term: '',
    with_details: true,
    integration_id: ''
  }),
  variant: null,
  create: null,
  update: null,
  bulkEdit: null,
  bulkEditData: Map({
    remoteIds: [],
    integration: '',
    category: '',
    properties: []
  }),
  filters: List([]),
  loading: false
});

export default function variantsReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_VARIANTS:
      return state.withMutations((mutableState) => {
        mutableState.set('variantList', fromJS(action.data));
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
    case types.GET_PRODUCT_CATEGORY_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState.set('bulkEditData', Map(action.bulkEditData));
      });
    case types.INIT_BULK_EDIT_VARIANTS_DATA:
      return state.withMutations(mutableState => {
        const { remoteIds, category, integration, properties } = action.payload;
        mutableState.setIn(['bulkEditData', 'remoteIds'], remoteIds)
          .setIn(['bulkEditData', 'category'], category)
          .setIn(['bulkEditData', 'integration'], integration.value || integration)
          .setIn(['bulkEditData', 'properties'], properties);
      });
    case types.UPDATE_VARIANT_FILTERS:
      return state.withMutations(mutableState => {
        mutableState.set('filters', List(action.filters))
          .setIn(['params', 'integration_id'], action.filters[0] ? action.filters[0].value : '');
      });
    case types.CHANGE_VARIANTS_PAGE:
      return state.withMutations(mutableState => {
        mutableState.setIn(['params', 'offset'], action.page * mutableState.getIn(['params', 'limit']));
      });
    case types.CHANGE_VARIANTS_ROWS_PER_PAGE:
      return state.withMutations(mutableState => {
        mutableState.setIn(['params', 'limit'], action.limit);
      });
    case types.CHANGE_VARIANTS_SEARCH_TERM:
      return state.withMutations(mutableState => {
        mutableState.setIn(['params', 'term'], action.term);
      });
    case types.RESET_VARIANTS_TABLE:
      return state.withMutations(mutableState => {
        mutableState.setIn(['params', 'limit'], 10)
          .setIn(['params', 'offset'], 0)
          .setIn(['params', 'term'], '')
          .setIn(['params', 'integration_id'], '')
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
