import * as types from './actionConstants';

export const getTenant = () => ({
  type: types.GET_TENANT
});

export const getTenantAction = tenant => ({
  type: types.GET_TENANT,
  tenant
});
