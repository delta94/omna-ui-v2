import * as actionConstants from './actionConstants';

export const getIntegrations = query => ({
  type: actionConstants.GET_INTEGRATIONS,
  query
});

export const getIntegration = () => {};
