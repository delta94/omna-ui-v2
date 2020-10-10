import { fromJS, Map } from 'immutable';
import * as types from 'dan-actions/actionConstants';
import { isTenantEnabled, setLocalStorage } from 'dan-containers/Common/Utils';

const initialState = fromJS({
  code: '',
  isReadyToOmna: false,
  tenantId: '',
  tenantName: '',
  reloadTenants: false,
  reloadLandingPage: false,
  deactivationDate: null,
  enabled: false,
  user: {
    name: '',
    picture: ''
  },
  // shopify
  shopifyAppStatus: 'ready_installing',
  fromShopifyApp: false,
  fromShopifyAppAdmin: false,
  trialDays: 14,
  planId: '',
  planName: '',
  planStatus: ''
});

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_USER:
      return state.withMutations(mutableState => {
        const { data } = action;
        const storage = { secret: data.secret, token: data.token };
        !data.fromShopifyApp ? storage.tenantId = data.id : storage.store = data.name;
        setLocalStorage(storage);
        mutableState.set('isReadyToOmna', data.isReadyToOmna)
          .set('tenantId', data.id)
          .set('tenantName', data.name)
          .set('deactivationDate', data.deactivation)
          .set('enabled', isTenantEnabled(data.deactivation))
          .set('user', Map(data.user))
          .set('shopifyAppStatus', data.shopifyAppStatus)
          .set('fromShopifyApp', data.fromShopifyApp || false)
          .set('fromShopifyAppAdmin', data.fromShopifyAppAdmin || false)
          .set('trialDays', data.trialDays)
          .set('planId', data.plan_id)
          .set('planName', data.plan_name)
          .set('planStatus', data.plan_status);
      });
    //
    case types.SET_CODE:
      return state.withMutations(mutableState => {
        mutableState.set('code', action.code);
      });
    case types.SET_TENANT_STATUS:
      return state.withMutations(mutableState => {
        mutableState.set('isReadyToOmna', action.isReadyToOmna);
      });
    case types.SET_TENANT_ID:
      return state.withMutations(mutableState => {
        mutableState.set('tenantId', action.tenantId);
      });
    case types.SET_TENANT_NAME:
      return state.withMutations(mutableState => {
        mutableState.set('tenantName', action.tenantName);
      });
    case types.SET_DEACTIVATION_DATE:
      return state.withMutations(mutableState => {
        mutableState.set('deactivationDate', action.deactivationDate);
      });
    case types.SET_ENABLED_TENANT:
      return state.withMutations(mutableState => {
        mutableState.set('enabled', action.enabled);
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
    default:
      return state;
  }
}
