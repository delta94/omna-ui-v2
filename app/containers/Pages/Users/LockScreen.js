import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loading from 'dan-components/Loading';
import styles from '../../../components/Forms/user-jss';
import API from '../../Utils/api';
import Utils from '../../Common/Utils';
import { setTenantStatus } from '../../../actions/TenantActions';

class LockScreen extends React.Component {
  componentDidMount() {
    const { history, location, changeTenantStatus } = this.props;
    const { redirect, code, pathname } = location.state;
    if (code) {
      API.post('get_access_token', { code }).then(response => {
        const { data } = response.data;
        const currentTenant = {
          secret: data.secret, token: data.token, user: data.user.name, isReadyToOmna: data.isReadyToOmna
        };
        Utils.setUser(currentTenant);
        changeTenantStatus(data.isReadyToOmna);
        pathname ? history.push(pathname) : history.push('/');
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
  history: PropTypes.object.isRequired,
  changeTenantStatus: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  isReadyToOmna: state.getIn(['tenant', 'isReadyToOmna']),
  token: state.getIn(['tenant', 'token']),
  ...state,
});

const dispatchToProps = dispatch => ({
  changeTenantStatus: bindActionCreators(setTenantStatus, dispatch)
});

const LockScreenMapped = connect(
  mapStateToProps,
  dispatchToProps
)(LockScreen);

export default withStyles(styles)(LockScreenMapped);
