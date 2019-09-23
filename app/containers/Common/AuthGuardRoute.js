import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import Utils from './Utils';

const AuthGuardRoute = ({ component: Component, ...rest }) => {
  const { location } = window;
  const uri = location.href;
  let code = null;
  let pathname = null;
  if (uri.includes('code') && !Utils.isAuthenticated()) {
    const url = new URL(uri);
    const searchParams = new URLSearchParams(url.search);
    ({ pathname } = url.pathname);
    code = searchParams.get('code');
  }
  return (
    <Route
      {...rest}
      render={props => (
        Utils.isAuthenticated() ? <Component {...props} />
          : <Redirect to={{ pathname: '/lock-screen', state: { redirect: `${Utils.baseAPIURL()}/sign_in?redirect_uri=${Utils.baseAppUrl()}${location.pathname}`, code, pathname } }} />
      )}
    />
  );
};

AuthGuardRoute.propTypes = {
  component: PropTypes.func.isRequired
};

export default AuthGuardRoute;
