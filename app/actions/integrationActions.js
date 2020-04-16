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

export const importResource = (query) => ({
  type: actionConstants.IMPORT_RESOURCE_ASYNC,
  query
});

export const setLoading = (query) => ({
  type: actionConstants.SET_LOADING,
  query
});

export const getIntegration = () => {};
