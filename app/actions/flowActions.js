import { GET_FLOWS } from './actionConstants';
import api from '../containers/Utils/api';

export const getFlows = () => async (dispatch, params) => {
  try {
    const response = await api.get('/flows', { params });
    console.log(`RESPONSE -> ${response}`);
    dispatch({
      type: GET_FLOWS,
      payload: response.data
    });
  } catch (error) {
    // show error
    // this.setState({ success: false, messageError: error.message });
    // enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
    //   variant: 'error'
    // });
  }
};

export const addFlows = () => {};
