import React from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { isOmnaShopify } from 'dan-containers/Common/Utils';
import AuthGuardRoute from '../Common/AuthGuardRoute';
import Dashboard from '../Templates/Dashboard';
import { LockScreen, Logout, NotFound } from '../pageListAsync';
import {
  OmnaAppRoutes as omnaRoutes,
  OmnaShopifyRoutes as shopifyRoutes
} from './routes';

class Application extends React.Component {
  render() {
    const { changeMode, history, appStore } = this.props;
    const availableRoutes = !isOmnaShopify ? omnaRoutes : shopifyRoutes;

    return (
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Dashboard
          history={history}
          changeMode={changeMode}
          appStore={appStore}
        >
          <Switch>
            {availableRoutes.map(route => (
              <AuthGuardRoute
                key={route.link}
                exact
                path={route.link}
                component={route.component}
                appStore={appStore}
              />
            ))}
            <Route
              path="/lock-screen"
              history={history}
              component={LockScreen}
            />
            <Route path="/logout" component={Logout} />
            {/* Default */}
            <Route component={NotFound} />
          </Switch>
        </Dashboard>
      </SnackbarProvider>
    );
  }
}

Application.propTypes = {
  changeMode: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  appStore: PropTypes.object.isRequired
};

export default Application;
