import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';
import {
  baseApiUrl,
  baseAppUrl,
  getter
} from './Utils';

const AuthGuardRoute = ({
  changeMode,
  component: Component,
  history,
  layout: Layout,
  location,
  path,
  ...rest
}) => {
  const isAuth = getter.IS_AUTHENTICATED;
  let code = null;
  let store = null;

  if (location.search.includes('store')) {
    const searchParams = new URLSearchParams(location.search);
    store = searchParams.get('store');
  }

  if (location.search.includes('code') && !isAuth) {
    const searchParams = new URLSearchParams(location.search);
    code = searchParams.get('code');
  }

  return (
    <Route
      {...rest}
      render={props =>
        isAuth ? (
          <Layout history={history} changeMode={changeMode}>
            <Component {...props} />
          </Layout>
        ) : (
            <Redirect
              to={{
                pathname: '/lock-screen',
                state: {
                  redirect:
                    !location.pathname.includes('shopify') && !getter.STORE
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
  changeMode: PropTypes.func.isRequired,
  component: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  layout: PropTypes.object.isRequired,
  location: PropTypes.object,
  path: PropTypes.string.isRequired
};

AuthGuardRoute.defaultProps = {
  location: null
};

export default AuthGuardRoute;
