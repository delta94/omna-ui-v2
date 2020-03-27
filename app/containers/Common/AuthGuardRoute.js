import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import Utils from './Utils';

const AuthGuardRoute = ({
  component: Component, location, path, ...rest
}) => {
  let code = null;
  let store = null;
  // const tenant = Utils.getTenant();
  //  const isEnabled = tenant ? (tenant.enabled && tenant.isReadyToOmna) : false;
  const isAuthenticated = Utils.isAuthenticated();
  if (location.search.includes('store')) {
    const searchParams = new URLSearchParams(location.search);
    store = searchParams.get('store');
    /*  return (
      <Route
        {...rest}
        render={props => (
          <InstallShopify {...props} store={searchParams.get('store')} />
        )}
      />
    ); */
  }

  if (location.search.includes('code') && !isAuthenticated) {
    const searchParams = new URLSearchParams(location.search);
    code = searchParams.get('code');
  }
  /*   if (isAuthenticated && !isEnabled && path !== tenantconfigUrl && path !== createTenantUrl) {
    return (
      <Route
        render={() => (
          <Redirect to={{ pathname: tenantconfigUrl }} />
        )}
      />
    );
  } */
  return (
    <Route
      {...rest}
      render={props => (isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/lock-screen',
            state: {
              redirect: `${Utils.baseAPIURL()}/sign_in?redirect_uri=${Utils.baseAppUrl()}${path}`,
              code,
              path,
              store
            }
          }}
        />
      ))
      }
    />
  );
};

AuthGuardRoute.propTypes = {
  component: PropTypes.func.isRequired,
  path: PropTypes.string.isRequired,
  location: PropTypes.object
};

AuthGuardRoute.defaultProps = {
  location: null
};

export default AuthGuardRoute;
