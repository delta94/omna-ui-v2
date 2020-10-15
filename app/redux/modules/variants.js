import { fromJS, Map, List } from 'immutable';
import * as types from 'dan-actions/actionConstants';

const initialState = fromJS({
  variantList: { data: [], pagination: {} },
  variant: null,
  create: null,
  update: null,
  link: null,
  unlink: null,
  bulkEdit: null,
  bulkEditData: Map({
    remoteIds: [],
    integration: '',
    category: '',
    properties: []
  }),
  filters: List([]),
  loading: true
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
    case types.LINK_VARIANT:
      return state.withMutations((mutableState) => {
        mutableState.set('link', action.data);
      });
    case types.UNLINK_VARIANT:
      return state.withMutations((mutableState) => {
        mutableState.set('unlink', action.data);
      });
    case types.GET_PRODUCT_CATEGORY_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState.set('bulkEditData', Map(action.bulkEditData));
      });
    case types.GET_BULK_EDIT_VARIANT_PROPERTIES_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState.setIn(['bulkEditData', 'properties'], action.data);
      });
    case types.BULK_EDIT_VARIANT_PROPERTIES_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState.set('bulkEdit', action.data);
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
