import { fromJS, List } from 'immutable';
import * as types from '../../actions/actionConstants';

const initialState = fromJS({
  collections: [],
  task: null,
  total: 0,
  loading: true
});

export default function collectionsReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_COLLECTIONS:
      return state.withMutations((mutableState) => {
        mutableState.set('collections', List(action.data));
      });
    case types.INSTALL_COLLECTION:
      return state.withMutations((mutableState) => {
        mutableState.set('task', action.data);
      });
    case types.UNINSTALL_COLLECTION:
      return state.withMutations((mutableState) => {
        mutableState.set('task', action.data);
      });
    case types.SET_TOTAL:
      return state.withMutations((mutableState) => {
        mutableState.set('total', action.data);
      });
    case types.SET_LOADING:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', action.data);
      });
    default:
      return state;
  }
}
