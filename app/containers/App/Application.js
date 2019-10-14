import React from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import AuthGuardRoute from '../Common/AuthGuardRoute';
import Dashboard from '../Templates/Dashboard';
import {
  NotFound,
  Tasks,
  TaskDetails,
  Orders,
  OrderDetails,
  Products,
  Integrations,
  AddIntegrationForm,
  Workflows,
  AddWorkflow,
  EditWorkflow,
  Webhooks,
  AddWebhook,
  DashboardPage,
  TenantConfiguration,
  AddTenant
} from '../pageListAsync';

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
            <AuthGuardRoute
              exact
              path="/app/dashboard"
              component={DashboardPage}
            />
            <AuthGuardRoute exact path="/app/orders-list" component={Orders} />
            <AuthGuardRoute
              exact
              path="/app/orders-list/:store_id/:number/order-details"
              component={OrderDetails}
            />
            <AuthGuardRoute exact path="/app/tasks-list" component={Tasks} />
            <AuthGuardRoute
              exact
              path="/app/tasks-list/:task_id/task-details"
              component={TaskDetails}
            />
            <AuthGuardRoute
              exact
              path="/app/products-list"
              component={Products}
            />
            <AuthGuardRoute
              exact
              path="/app/settings/integrations"
              component={Integrations}
            />
            <AuthGuardRoute
              exact
              path="/app/settings/integrations/add-integration"
              component={AddIntegrationForm}
            />
            <AuthGuardRoute
              exact
              path="/app/settings/Workflows"
              component={Workflows}
            />
            <AuthGuardRoute
              exact
              path="/app/settings/Workflows/add-workflow"
              component={AddWorkflow}
            />
            <AuthGuardRoute
              exact
              path="/app/settings/Workflows/edit-workflow/:id"
              component={EditWorkflow}
            />
            <AuthGuardRoute
              exact
              path="/app/settings/add-tenant"
              component={AddTenant}
            />
            <AuthGuardRoute
              exact
              path="/app/settings/webhook-list"
              component={Webhooks}
            />
            <AuthGuardRoute
              exact
              path="/app/settings/webhook-list/add-webhook"
              component={AddWebhook}
            />
            {/* Home */}
            <AuthGuardRoute exact path="/app" component={DashboardPage} />
            <AuthGuardRoute exact path="/" component={DashboardPage} />
            <AuthGuardRoute exact path="/app/tenant-configuration" component={TenantConfiguration} />
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
