import * as types from './actionConstants';

export const getTenant = () => ({
  type: types.GET_TENANT
});

export const setTenantStatus = (isReadyToOmna) => ({
  type: types.SET_TENANT_STATUS,
  isReadyToOmna
});
