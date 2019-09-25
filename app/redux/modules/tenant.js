import { fromJS } from 'immutable';
import * as types from '../../actions/actionConstants';
import Utils from '../../containers/Common/Utils';

const initialState = fromJS({
  isReadyToOmna: Utils.getUser() ? Utils.getUser().isReadyToOmna : false,
  tenantId: Utils.getUser() ? Utils.getUser().tenantId : ''
});

export default function tenantReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_TENANT:
      return state.withMutations((mutableState) => {
        mutableState.set('isReadyToOmna', action.isReadyToOmna);
      });
    case types.GET_TENANT_ID:
      return state.withMutations((mutableState) => {
        mutableState.set('tenantId', action.tenant);
      });
    case types.SET_TENANT_STATUS:
      return state.withMutations((mutableState) => {
        mutableState.set('isReadyToOmna', action.isReadyToOmna);
      });
    case types.SET_TENANT_ID:
      return state.withMutations((mutableState) => {
        mutableState.set('tenantId', action.tenantId);
      });
    default:
      return state;
  }
}
