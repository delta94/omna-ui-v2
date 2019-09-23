import { fromJS } from 'immutable';
import * as types from '../../actions/actionConstants';

const initialState = fromJS({
  isReadyToOmna: false
});

export default function tenantReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_TENANT:
      return state.withMutations((mutableState) => {
        mutableState.set('type', action.tenant);
      });
    default:
      return state;
  }
}
