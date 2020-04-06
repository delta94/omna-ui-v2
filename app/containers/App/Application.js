import React from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import AuthGuardRoute from '../Common/AuthGuardRoute';
import Dashboard from '../Templates/Dashboard';
import { LockScreen, Logout, NotFound } from '../pageListAsync';
import { AllRoutes as routes } from './routes';

class Application extends React.Component {
  render() {
    const { changeMode, history } = this.props;
    return (
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Dashboard history={history} changeMode={changeMode}>
          <Switch>
            {routes.map(route => (
              <AuthGuardRoute
                exact
                path={route.link}
                component={route.component}
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
  history: PropTypes.object.isRequired
};

export default Application;
