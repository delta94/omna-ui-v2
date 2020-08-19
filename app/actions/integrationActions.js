import * as actionConstants from './actionConstants';

export const getIntegrations = query => ({
  type: actionConstants.GET_INTEGRATIONS,
  query
});

export const getChannels = query => ({
  type: actionConstants.GET_CHANNELS,
  query
});

export const createIntegration = ({
  authorized, channel, name, enqueueSnackbar
}) => ({
  type: actionConstants.CREATE_INTEGRATION,
  authorized,
  channel,
  name,
  enqueueSnackbar
});

export const updateIntegration = integration => ({
  type: actionConstants.UPDATE_INTEGRATION,
  integration
});

export const deleteIntegration = (integrationId, enqueueSnackbar) => ({
  type: actionConstants.DELETE_INTEGRATION,
  integrationId,
  enqueueSnackbar
});

export const unauthorizeIntegration = id => ({
  type: actionConstants.UNAUTHORIZE_INTEGRATION,
  id
});

export const importResource = query => ({
  type: actionConstants.IMPORT_RESOURCE_ASYNC,
  query
});

export const setLoading = query => ({
  type: actionConstants.SET_LOADING,
  query
});
