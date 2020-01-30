import { AUTH_LOGOUT } from './actionConstants';
import API from '../containers/Utils/api';
import Utils from '../containers/Common/Utils';

const logout = () => {
  const { location } = window;
  window.location = Utils.baseAppUrl() + location.pathname;

  const params = {
    redirect_uri: window.location
  };

  const response = API.get('/sign_out', { params });

  return {
    type: AUTH_LOGOUT
  };
};

export default logout;
