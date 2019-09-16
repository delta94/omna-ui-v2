import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import Utils from './Utils';


const AuthGuardRoute = ({ component: Component, ...rest }) => {
  const { location } = window;
  const uri = location.href;
  if (uri.includes('token')) {
    const url = new URL(uri);
    const searchParams = new URLSearchParams(url.search);
    const token = searchParams.get('token');
    const secret = searchParams.get('secret');
    const user = searchParams.get('user');
    const currentTenant = { secret, token, user };
    sessionStorage.setItem('currentTenant', JSON.stringify(currentTenant));
  }
  return (
    <Route
      {...rest}
      render={props => (
        Utils.isAuthenticated() ? <Component {...props} />
          : <Redirect to={{ pathname: '/lock-screen', state: { redirect: `${Utils.baseAPIURL()}/sign_in?redirect_uri=${Utils.baseAppUrl()}${location.pathname}` } }} />
      )}
    />
  );
};

AuthGuardRoute.propTypes = {
  component: PropTypes.func.isRequired
};

export default AuthGuardRoute;
