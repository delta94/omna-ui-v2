import React from 'react';
import { PropTypes } from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import Outer from '../Templates/Outer';
import {
  // Login,
  // Register,
  // ResetPassword,
  // ComingSoon,
  // Maintenance,
  NotFound,
  LockScreen,
  Logout
} from '../pageListAsync';

class Auth extends React.Component {
  render() {
    const { history } = this.props;
    return (
      <Outer>
        <Switch>
          {/* <Route path="/login" component={Login} /> */}
          {/* <Route path="/register" component={Register} /> */}
          {/* <Route path="/reset-password" component={ResetPassword} /> */}
          <Route path="/lock-screen" history={history} component={LockScreen} />
          <Route path="/logout" component={Logout} />
          {/* <Route path="/maintenance" component={Maintenance} /> */}
          {/* <Route path="/coming-soon" component={ComingSoon} /> */}
          <Route component={NotFound} />
        </Switch>
      </Outer>
    );
  }
}

Auth.propTypes = {
  history: PropTypes.object.isRequired
};

export default Auth;
