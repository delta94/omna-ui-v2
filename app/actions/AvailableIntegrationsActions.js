import * as types from './actionConstants';

export const getAvailableIntegrationList = (params, enqueueSnackbar) => ({
  type: types.GET_AVAILABLE_INTEGRATIONS_ASYNC,
  params,
  enqueueSnackbar
});

export const installAvailableIntegration = (id, enqueueSnackbar) => ({
  type: types.INSTALL_AVAILABLE_INTEGRATION_ASYNC,
  id,
  enqueueSnackbar
});

export const uninstallAvailableIntegration = (id, enqueueSnackbar) => ({
  type: types.UNINSTALL_AVAILABLE_INTEGRATION_ASYNC,
  id,
  enqueueSnackbar
});
