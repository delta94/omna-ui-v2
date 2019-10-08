import { fromJS } from 'immutable';
import * as types from '../../actions/actionConstants';
import Utils from '../../containers/Common/Utils';

const initialState = fromJS({
  isReadyToOmna: Utils.getUser() ? Utils.getUser().isReadyToOmna : false,
  tenantId: Utils.getUser() ? Utils.getUser().tenantId : '',
  reloadTenants: false,
  reloadLandingPage: false
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
    case types.GET_RELOAD_TENANTS:
      return state.withMutations((mutableState) => {
        mutableState.set('reloadTenants', action.reloadTenants);
      });
    case types.SET_RELOAD_TENANTS:
      return state.withMutations((mutableState) => {
        mutableState.set('reloadTenants', action.reloadTenants);
      });
    case types.GET_RELOAD_LANDING_PAGE:
      return state.withMutations((mutableState) => {
        mutableState.set('reloadLandingPage', action.reloadLandingPage);
      });
    case types.SET_RELOAD_LANDING_PAGE:
      return state.withMutations((mutableState) => {
        mutableState.set('reloadLandingPage', action.reloadLandingPage);
      });
    default:
      return state;
  }
}
