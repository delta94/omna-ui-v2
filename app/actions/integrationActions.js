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

export const getIntegration = () => {};
