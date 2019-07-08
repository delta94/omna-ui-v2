import React from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import AuthGuardRoute from '../Omna/Common/AuthGuardRoute';
import Dashboard from '../Templates/Dashboard';

import {
  Analytics, Parent, Error, NotFound,
  Tasks, TaskDetails, Orders, OrderDetails, Products,
  Stores, AddStoreForm, Workflows, AddWorkflow
} from '../pageListAsync';

//

class Application extends React.Component {
  render() {
    const { changeMode, history } = this.props;
    return (
      <SnackbarProvider maxSnack={3} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
        <Dashboard history={history} changeMode={changeMode}>
          <Switch>
            { /* OMNA */ }
            <AuthGuardRoute exact path="/app/orders-list" component={Orders} />
            <AuthGuardRoute exact path="/app/orders-list/:store_id/:number/order-details" component={OrderDetails} />
            <AuthGuardRoute exact path="/app/tasks-list" component={Tasks} />
            <AuthGuardRoute exact path="/app/tasks-list/:task_id/task-details" component={TaskDetails} />
            <AuthGuardRoute exact path="/app/products-list" component={Products} />
            <AuthGuardRoute exact path="/app/settings/stores" component={Stores} />
            <AuthGuardRoute exact path="/app/settings/stores/add-store" component={AddStoreForm} />
            <AuthGuardRoute exact path="/app/settings/Workflows" component={Workflows} />
            <AuthGuardRoute exact path="/app/settings/Workflows/add-workflow" component={AddWorkflow} />
            { /* Home */ }
            <AuthGuardRoute exact path="/app" component={Analytics} />
            <AuthGuardRoute exact path="/" component={Analytics} />
            <AuthGuardRoute exact path="/app/widgets/analytics" component={Analytics} />
            { /* Pages */ }
            <AuthGuardRoute exact path="/app/pages" component={Parent} />
            <Route path="/app/pages/not-found" component={NotFound} />
            <AuthGuardRoute path="/app/pages/error" component={Error} />
            { /* Default */ }
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
};

export default Application;
