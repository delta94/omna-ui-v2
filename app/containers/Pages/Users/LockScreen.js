import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loading from 'dan-components/Loading';
import styles from '../../../components/Forms/user-jss';
import API from '../../Utils/api';
import Utils from '../../Common/Utils';
import { setTenantStatus, setTenantId } from '../../../actions/TenantActions';

class LockScreen extends React.Component {
  componentDidMount() {
    const {
      history, location, changeTenantStatus, changeTenantId
    } = this.props;
    const { redirect, code, pathname } = location.state;
    if (code) {
      API.post('get_access_token', { code }).then(response => {
        const { data } = response.data;
        const currentTenant = {
          secret: data.secret,
          token: data.token,
          user: data.user.name,
          isReadyToOmna: data.is_ready_to_omna,
          tenantId: data.id
        };
        Utils.setUser(currentTenant);
        changeTenantStatus(currentTenant.isReadyToOmna);
        changeTenantId(data.id);
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
  changeTenantStatus: PropTypes.func.isRequired,
  changeTenantId: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  isReadyToOmna: state.getIn(['tenant', 'isReadyToOmna']),
  tenantId: state.getIn(['tenant', 'tenantId']),
  ...state,
});

const dispatchToProps = dispatch => ({
  changeTenantStatus: bindActionCreators(setTenantStatus, dispatch),
  changeTenantId: bindActionCreators(setTenantId, dispatch)
});

const LockScreenMapped = connect(
  mapStateToProps,
  dispatchToProps
)(LockScreen);

export default withStyles(styles)(LockScreenMapped);
