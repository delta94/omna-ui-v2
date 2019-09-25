import * as types from './actionConstants';

export const getTenant = () => ({
  type: types.GET_TENANT
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
