import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import logout from '../../actions/auth';
import Utils from '../Common/Utils';

class Logout extends Component {
  componentDidMount() {
    const { onLogout } = this.props;
    onLogout();
  }

  render() {
    const { location } = window;

    return (
      <Redirect
        to={{
          pathname: '/lock-screen',
          state: {
            redirect: `${Utils.baseAPIURL()}/sign_in?redirect_uri=${Utils.baseAppUrl()}${
              location.pathname
            }`
          }
        }}
      />
    );
  }
}

Logout.propTypes = {
  onLogout: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(logout())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Logout);
