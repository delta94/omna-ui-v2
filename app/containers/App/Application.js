import React from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
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
            <Route exact path="/app/order-list" component={Orders} />
            <Route exact path="/app/orders/:store_id/:number/order-details" component={OrderDetails} />
            <Route exact path="/app/tasks-list" component={Tasks} />
            <Route exact path="/app/tasks/:task_id/task-details" component={TaskDetails} />
            <Route exact path="/app/products-list" component={Products} />
            <Route exact path="/app/settings/stores" component={Stores} />
            <Route exact path="/app/settings/stores/add-store" component={AddStoreForm} />
            <Route exact path="/app/settings/Workflows" component={Workflows} />
            <Route exact path="/app/settings/Workflows/add-workflow" component={AddWorkflow} />
            { /* Home */ }
            <Route exact path="/app" component={Analytics} />
            <Route exact path="/" component={Analytics} />
            <Route path="/app/widgets/analytics" component={Analytics} />
            { /* Pages */ }
            <Route exact path="/app/pages" component={Parent} />
            <Route path="/app/pages/not-found" component={NotFound} />
            <Route path="/app/pages/error" component={Error} />
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
