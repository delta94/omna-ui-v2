import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loading from 'dan-components/Loading';
import styles from '../../../components/Forms/user-jss';
import API from '../../Utils/api';
import Utils from '../../Common/Utils';
import InstallShopify from '../../Shopify/Components/InstallShopify';
import getSettingsInfo from '../../Shopify/Services/ShopifyService';

import {
  setTenantStatus,
  setTenantId,
  setDeactivationDate,
  setEnabledTenant,
  setTenantName
} from '../../../actions/TenantActions';

class LockScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { installShopify: false };
  }

  async componentDidMount() {
    const {
      history,
      location,
      changeTenantStatus,
      changeTenantId,
      changeDeactivationDate,
      changeEnabledTenant,
      changeTenantName
    } = this.props;
    const { redirect, code, pathname, store } = location.state;

    // let plansResult = [];

    if (code) {
      API.post('get_access_token', { code }).then(response => {
        const { data } = response.data;
        const currentTenant = {
          secret: data.secret,
          token: data.token,
          name: data.name,
          user: {
            name: data.user.name,
            picture: data.user.picture
          },
          isReadyToOmna: data.is_ready_to_omna,
          enabled: Utils.isTenantEnabled(data.deactivation),
          tenantId: data.id
        };
        Utils.setTenant(currentTenant);
        changeTenantStatus(currentTenant.isReadyToOmna);
        changeTenantId(data.id);
        changeTenantName(data.name);
        changeDeactivationDate(data.deactivation);
        changeEnabledTenant(currentTenant.enabled);
        pathname ? history.push(pathname) : history.push('/');
      });
    }

    if (store) {
      const result = await getSettingsInfo.getSettingsInfo(this.props);
      if (result) {
        // plansResult = await getSettingsInfo.getPlanInfo(store);

        // if (plansResult) {
        this.setState({
          installShopify: result
        });
        pathname ? history.push(pathname) : history.push('/');
        // }
      }
    }

    if (!code && !store) {
      window.location.replace(redirect);
    }
  }

  render() {
    const { classes } = this.props;
    const { installShopify } = this.state;
    return (
      <div>
        {installShopify ? (
          <div className={classes.root}>
            <Loading />
          </div>
        ) : (
          <div>
            {' '}
            <InstallShopify />
          </div>
        )}
      </div>
    );
  }
}

LockScreen.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  changeTenantStatus: PropTypes.func.isRequired,
  changeTenantId: PropTypes.func.isRequired,
  changeDeactivationDate: PropTypes.func.isRequired,
  changeEnabledTenant: PropTypes.func.isRequired,
  changeTenantName: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isReadyToOmna: state.getIn(['tenant', 'isReadyToOmna']),
  tenantId: state.getIn(['tenant', 'tenantId']),
  ...state
});

const dispatchToProps = dispatch => ({
  changeTenantStatus: bindActionCreators(setTenantStatus, dispatch),
  changeTenantId: bindActionCreators(setTenantId, dispatch),
  changeDeactivationDate: bindActionCreators(setDeactivationDate, dispatch),
  changeEnabledTenant: bindActionCreators(setEnabledTenant, dispatch),
  changeTenantName: bindActionCreators(setTenantName, dispatch)
});

const LockScreenMapped = connect(
  mapStateToProps,
  dispatchToProps
)(LockScreen);

export default withStyles(styles)(LockScreenMapped);
