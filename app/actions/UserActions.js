import * as types from './actionConstants';

export const setUser = (data) => ({
  type: types.SET_USER,
  data
});

export const getSetPlanStatus = (status) => ({
  type: types.SET_PLAN_STATUS,
  status
});

export const getSetPlanName = (name) => ({
  type: types.SET_PLAN_NAME,
  name
});

// ------------------------------------------------------
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

export const setDeactivationDate = (deactivationDate) => ({
  type: types.SET_DEACTIVATION_DATE,
  deactivationDate
});

export const setEnabledTenant = (enabled) => ({
  type: types.SET_ENABLED_TENANT,
  enabled
});

export const setTenantName = (tenantName) => ({
  type: types.SET_TENANT_NAME,
  tenantName
});

export const setCode = (code) => ({
  type: types.SET_CODE,
  code
});
