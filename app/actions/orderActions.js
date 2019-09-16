import get from 'lodash/get';
import { GET_ORDERS } from './actionConstants';
import api from '../containers/Utils/api';

export const getOrders = (params) => (dispatch) => {
  api
    .get('/orders', { params })
    .then(response => {
      this.setState({
        orders: get(response, 'data', { data: [], pagination: {} }),
        limit: get(response, 'data.pagination.limit', 0)
      });

      dispatch({
        type: GET_ORDERS,
        payload: response.data
      });
    })
    .catch(error => {
      // handle error
      console.log(error);
    });
};

export const addFlows = () => {};
