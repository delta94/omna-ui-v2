import { fromJS } from 'immutable';
import * as types from 'dan-actions/actionConstants';

const initialState = fromJS({
  variantList: { data: [], pagination: {} },
  variant: null,
  create: null,
  update: null,
  link: null,
  unlink: null,
  bulkEdit: null,
  properties: [],
  loading: true,
  remoteIds: []
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
    case types.DELETE_VARIANT:
      return state.withMutations((mutableState) => {
        mutableState.updateIn(['variantList', 'data'], list => list.filter(item => item.get('id') !== action.id));
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
    case types.GET_BULK_EDIT_VARIANT_PROPERTIES_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState.set('properties', action.data);
      });
    case types.BULK_EDIT_VARIANT_PROPERTIES_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState.set('bulkEdit', action.data);
      });
    case types.UPDATE_VARIANT_REMOTE_IDS:
      return state.withMutations(mutableState => {
        mutableState.set('remoteIds', action.remoteIds);
      });
    case types.SET_LOADING:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', action.loading);
      });
    default:
      return state;
  }
}
