import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import {
  baseApiUrl,
  baseAppUrl,
  isAuthenticated,
  isOmnaShopify
} from './Utils';

const AuthGuardRoute = ({
  appStore,
  changeMode,
  component: Component,
  history,
  layout: Layout,
  location,
  path,
  ...rest
}) => {
  let code = null;
  let store = null;

  if (location.search.includes('store')) {
    const searchParams = new URLSearchParams(location.search);
    store = searchParams.get('store');
    console.log(`store ${store}`)
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
          <Layout history={history} changeMode={changeMode}>
            <Component {...props} appStore={appStore} />
          </Layout>
        ) : (
          <Redirect
            to={{
              pathname: '/lock-screen',
              state: {
                redirect:
                  !location.pathname.includes('shopify') && !isOmnaShopify
                    ? `${baseApiUrl}/sign_in?redirect_uri=${baseAppUrl}${path}`
                    : `${location.pathname}`,
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
  appStore: PropTypes.object.isRequired,
  changeMode: PropTypes.func.isRequired,
  component: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  location: PropTypes.object,
  path: PropTypes.string.isRequired
};

AuthGuardRoute.defaultProps = {
  location: null
};

export default AuthGuardRoute;
