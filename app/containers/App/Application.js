import React from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import AuthGuardRoute from '../Common/AuthGuardRoute';
import Dashboard from '../Templates/Dashboard';
import { NotFound } from '../pageListAsync';
import routes from './routes';

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
