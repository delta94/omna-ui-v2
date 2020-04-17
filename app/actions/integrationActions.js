import * as actionConstants from './actionConstants';

export const getIntegrations = query => {
  return {
    type: actionConstants.GET_INTEGRATIONS,
    query
  };
};

export const getChannels = query => {
  return {
    type: actionConstants.GET_CHANNELS,
    query
  };
};

export const setLoading = query => ({
  type: actionConstants.SET_LOADING,
  query
});

export const deleteIntegration = integrationId => ({
  type: actionConstants.DELETE_INTEGRATION,
  integrationId
});
