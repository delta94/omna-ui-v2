import { updateObject } from '../utility';
import { AUTH_LOGOUT } from '../../actions/actionConstants';

const initialState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  authRedirectPath: '/'
};

const authLogout = state => {
  return updateObject(state, { token: null, userId: null });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTH_LOGOUT:
      return authLogout(state);
    default:
      return state;
  }
};

export default reducer;
