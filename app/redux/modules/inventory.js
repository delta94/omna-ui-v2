import { fromJS } from 'immutable';
import * as actionConstants from 'dan-actions/actionConstants';

const initialState = fromJS({
  inventoryEntries: { data: [], pagination: { total: 0 } },
  inventoryEntry: {},
  loading: false,
  error: ''
});

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionConstants.ACTION_INVENTORY_START:
      return state.withMutations(mutableState => {
        mutableState.set('loading', true);
      });
    case actionConstants.GET_INVENTORY_ENTRIES_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState
          .set('inventoryEntries', fromJS(action.data))
          .set('loading', false);
      });
    case actionConstants.GET_INVENTORY_ENTRIES_FAILED:
      return state.withMutations(mutableState => {
        mutableState.set('error', action.error).set('loading', false);
      });
    case actionConstants.GET_INVENTORY_ENTRY_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState
          .set('inventoryEntry', fromJS(action.data))
          .set('loading', false);
      });
    case actionConstants.GET_INVENTORY_ENTRY_FAILED:
      return state.withMutations(mutableState => {
        mutableState.set('error', action.error).set('loading', false);
      });
    default:
      return state;
  }
};
