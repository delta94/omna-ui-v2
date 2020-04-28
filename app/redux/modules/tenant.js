import { fromJS } from 'immutable';
import * as types from 'dan-actions/actionConstants';
import { getTenant } from 'dan-containers/Common/Utils';

const initialState = fromJS({
  isReadyToOmna: getTenant() ? getTenant().isReadyToOmna : false,
  tenantId: getTenant() ? getTenant().tenantId : '',
  tenantName: getTenant() ? getTenant().name : '',
  reloadTenants: false,
  reloadLandingPage: false,
  deactivationDate: null,
  enabled: getTenant() ? getTenant().enabled : false
});

export default function tenantReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_TENANT:
      return state.withMutations(mutableState => {
        mutableState.set('isReadyToOmna', action.isReadyToOmna);
      });
    case types.GET_TENANT_ID:
      return state.withMutations(mutableState => {
        mutableState.set('tenantId', action.tenant);
      });
    case types.SET_TENANT_STATUS:
      return state.withMutations(mutableState => {
        mutableState.set('isReadyToOmna', action.isReadyToOmna);
      });
    case types.SET_TENANT_ID:
      return state.withMutations(mutableState => {
        mutableState.set('tenantId', action.tenantId);
      });
    case types.GET_RELOAD_TENANTS:
      return state.withMutations(mutableState => {
        mutableState.set('reloadTenants', action.reloadTenants);
      });
    case types.SET_RELOAD_TENANTS:
      return state.withMutations(mutableState => {
        mutableState.set('reloadTenants', action.reloadTenants);
      });
    case types.GET_RELOAD_LANDING_PAGE:
      return state.withMutations(mutableState => {
        mutableState.set('reloadLandingPage', action.reloadLandingPage);
      });
    case types.SET_RELOAD_LANDING_PAGE:
      return state.withMutations(mutableState => {
        mutableState.set('reloadLandingPage', action.reloadLandingPage);
      });
    case types.SET_DEACTIVATION_DATE:
      return state.withMutations(mutableState => {
        mutableState.set('deactivationDate', action.deactivationDate);
      });
    case types.SET_ENABLED_TENANT:
      return state.withMutations(mutableState => {
        mutableState.set('enabled', action.enabled);
      });
    case types.SET_TENANT_NAME:
      return state.withMutations(mutableState => {
        mutableState.set('tenantName', action.tenantName);
      });
    default:
      return state;
  }
}
