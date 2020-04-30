import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { baseApiUrl, baseAppUrl } from '../Common/Utils';
import logout from '../../actions/auth';

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
            redirect: `${baseApiUrl}/sign_in?redirect_uri=${baseAppUrl}${
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
