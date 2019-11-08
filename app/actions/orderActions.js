// import get from 'lodash/get';
import { GET_ORDERS } from './actionConstants';
import api from '../containers/Utils/api';

export const getOrdersSuccess = orders => ({
  type: GET_ORDERS,
  payload: orders
});

export const getOrders = params => dispatch => {
  api
    .get('/orders', { params })
    .then(response => {
      setTimeout(() => {
        dispatch(getOrdersSuccess(response.data));
      }, 1000);
    })
    .catch(error => {
      console.log(error);
    });
};
