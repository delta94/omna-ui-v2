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
  EditProduct,
  AddProduct,
  AvailableIntegrations,
  Integrations,
  AddIntegrationForm,
  Workflows,
  AddWorkflow,
  EditWorkflow,
  Webhooks,
  AddWebhook,
  EditWebhook,
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
            <AuthGuardRoute exact path="/app/orders" component={Orders} />
            <AuthGuardRoute
              exact
              path="/app/orders/:number"
              component={OrderDetails}
            />
            <AuthGuardRoute exact path="/app/tasks" component={Tasks} />
            <AuthGuardRoute
              exact
              path="/app/tasks/:id"
              component={TaskDetails}
            />
            <AuthGuardRoute
              exact
              path="/app/products"
              component={Products}
            />
            <AuthGuardRoute
              exact
              path="/app/products/add-product"
              component={AddProduct}
            />
            <AuthGuardRoute
              exact
              path="/app/products/:id"
              component={EditProduct}
            />
            <AuthGuardRoute
              exact
              path="/app/available-integrations"
              component={AvailableIntegrations}
            />
            <AuthGuardRoute
              exact
              path="/app/integrations"
              component={Integrations}
            />
            <AuthGuardRoute
              exact
              path="/app/integrations/add-integration"
              component={AddIntegrationForm}
            />
            <AuthGuardRoute
              exact
              path="/app/workflows"
              component={Workflows}
            />
            <AuthGuardRoute
              exact
              path="/app/workflows/add-workflow"
              component={AddWorkflow}
            />
            <AuthGuardRoute
              exact
              path="/app/workflows/:id"
              component={EditWorkflow}
            />
            <AuthGuardRoute
              exact
              path="/app/add-tenant"
              component={AddTenant}
            />
            <AuthGuardRoute
              exact
              path="/app/webhooks"
              component={Webhooks}
            />
            <AuthGuardRoute
              exact
              path="/app/webhooks/add-webhook"
              component={AddWebhook}
            />
            <AuthGuardRoute
              exact
              path="/app/webhooks/:id"
              component={EditWebhook}
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
