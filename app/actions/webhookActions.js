import { GET_WEBHOOKS } from './actionConstants';

export const getWebhooks = query => ({
  type: GET_WEBHOOKS,
  query
});

export const createWebhook = () => {};
