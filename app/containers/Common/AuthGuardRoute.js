import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import { baseApiUrl, baseAppUrl, isAuthenticated } from './Utils';

const AuthGuardRoute = ({ component: Component, location, path, appStore, ...rest }) => {
  let code = null;
  let store = null;

  if (location.search.includes('store')) {
    const searchParams = new URLSearchParams(location.search);
    store = searchParams.get('store');
  }

  if (location.search.includes('code') && !isAuthenticated) {
    const searchParams = new URLSearchParams(location.search);
    code = searchParams.get('code');
  }

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? (
          <Component {...props} appStore={appStore} />
        ) : (
          <Redirect
            to={{
              pathname: '/lock-screen',
              state: {
                redirect: `${baseApiUrl}/sign_in?redirect_uri=${baseAppUrl}${path}`,
                code,
                path,
                store
              }
            }}
          />
        )
      }
    />
  );
};

AuthGuardRoute.propTypes = {
  component: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  appStore: PropTypes.object.isRequired,
  location: PropTypes.object
};

AuthGuardRoute.defaultProps = {
  location: null
};

export default AuthGuardRoute;
