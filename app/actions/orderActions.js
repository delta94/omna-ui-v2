import { GET_ORDER, GET_ORDERS, } from './actionConstants';

export const getOrders = query => ({
  type: GET_ORDERS,
  query
});

export const getOrder = id => ({
  type: GET_ORDER,
  id
});
