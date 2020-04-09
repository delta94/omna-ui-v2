import API from 'dan-containers/Utils/api';
import { baseAppUrl } from 'dan-containers/Common/Utils';
import { AUTH_LOGOUT } from './actionConstants';

const logout = () => {
  const { location } = window;
  window.location = baseAppUrl() + location.pathname;

  const params = {
    redirect_uri: window.location
  };

  API.get('/sign_out', { params });

  return {
    type: AUTH_LOGOUT
  };
};

export default logout;
