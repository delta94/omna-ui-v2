// import get from 'lodash/get';
import { GET_ORDERS } from './actionConstants';
import api from '../containers/Utils/api';

export const getOrdersSuccess = orders => {
  return {
    type: GET_ORDERS,
    payload: orders
  };
};

export const getOrders = params => {
  api
    .get('/orders', { params })
    .then(response => {
      // this.setState({
      //   orders: get(response, 'data', { data: [], pagination: {} }),
      //   limit: get(response, 'data.pagination.limit', 0)
      // });
      debugger;

      return dispatch => {
        setTimeout(() => {
          dispatch(getOrdersSuccess(response.data));
        }, 1000);
      };
    })
    .catch(error => {
      // handle error
      console.log(error);
    });
};

export const addFlows = () => {};
