import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Loading from 'dan-components/Loading';
import styles from '../../../components/Forms/user-jss';
import API from '../../Utils/api';
import Utils from '../../Common/Utils';

class LockScreen extends React.Component {
  componentDidMount() {
    const { history } = this.props;
    const { location } = this.props;
    const { redirect, code, pathname } = location.state;
    if (code) {
      API.post('get_access_token', { code }).then(response => {
        const { data } = response.data;
        const currentTenant = { secret: data.secret, token: data.token, user: data.user.name };
        Utils.setUser(currentTenant);
        if (pathname) {
          history.push(pathname);
        }
      });
    } else {
      window.location.replace(redirect);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Loading />
      </div>
    );
  }
}

LockScreen.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withStyles(styles)(LockScreen);
