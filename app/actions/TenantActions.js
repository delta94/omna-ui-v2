import * as types from './actionConstants';

export const getTenant = () => ({
  type: types.GET_TENANT
});

export const getReloadTenants = () => ({
  type: types.GET_RELOAD_TENANTS
});

export const setReloadTenants = (reloadTenants) => ({
  type: types.SET_RELOAD_TENANTS,
  reloadTenants
});

export const getReloadLandingPage = () => ({
  type: types.GET_RELOAD_LANDING_PAGE
});

export const setReloadLandingPage = (reloadLandingPage) => ({
  type: types.SET_RELOAD_LANDING_PAGE,
  reloadLandingPage
});

export const getTenantList = () => ({
  type: types.GET_TENANT_LIST
});

export const setTenantList = () => ({
  type: types.SET_TENANT_LIST
});

export const setTenantStatus = (isReadyToOmna) => ({
  type: types.SET_TENANT_STATUS,
  isReadyToOmna
});

export const getTenantId = () => ({
  type: types.GET_TENANT_ID
});

export const setTenantId = (tenantId) => ({
  type: types.SET_TENANT_ID,
  tenantId
});
