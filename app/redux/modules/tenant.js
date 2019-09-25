import { fromJS } from 'immutable';
import * as types from '../../actions/actionConstants';
import Utils from '../../containers/Common/Utils';

const initialState = fromJS({
  isReadyToOmna: Utils.getUser() ? Utils.getUser().isReadyToOmna : false,
  secret: 'secret',
  token: 'token'
});

export default function tenantReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_TENANT:
      return state.withMutations((mutableState) => {
        mutableState.set('isReadyToOmna', action.tenant);
      });
    case types.SET_TENANT_STATUS:
      return state.withMutations((mutableState) => {
        mutableState.set('isReadyToOmna', action.tenant);
      });

    default:
      return state;
  }
}
