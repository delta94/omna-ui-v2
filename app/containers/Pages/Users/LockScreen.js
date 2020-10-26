import React from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Loading from 'dan-components/Loading';
import styles from 'dan-components/Forms/user-jss';
import { pushNotification } from 'dan-actions/NotificationActions';
import { subscribeShopifyPlanAction } from 'dan-components/Notification/AlertActions';
import { setUser } from 'dan-actions/UserActions';
import { getSettingsInfo, planStatusNotification } from 'dan-containers/Shopify/Services/ShopifyService';
import API from 'dan-containers/Utils/api';
import warning from 'warning';
import get from 'lodash/get';

class LockScreen extends React.Component {
  state = { shopifyAppStatus: null };

  async componentDidMount() {
    const {
      history,
      location,
      enqueueSnackbar,
      onSetUser,
      onPushNotification
    } = this.props;

    const { redirect, code, path, store, admin } = location.state;

    if (code) {
      API.post('get_access_token', { code }).then(response => {
        const { data } = response.data;
        onSetUser(data);
        path ? history.push(path) : history.push('/');
      });
    }

    if (store) {
      const firstQuery = await getSettingsInfo(store, admin, enqueueSnackbar);
      if (firstQuery.shopifyAppStatus !== 'ready' || firstQuery.shopifyAppStatus !== 'ready_installation_with_error') {
        const intervalStatus = setInterval(async () => {
          const data = await getSettingsInfo(store, admin, enqueueSnackbar);
          const status = data.shopifyAppStatus;
          this.setState({ shopifyAppStatus: status });

          if (status === 'ready') {
            onSetUser(data);
            clearInterval(intervalStatus);
            const notif = planStatusNotification(data.plan_name, data.plan_status, subscribeShopifyPlanAction);
            notif ? onPushNotification(notif) : null;
            history.push('/shopify');
          }

          if (status === 'ready_installation_with_error') {

            onSetUser(data);
            clearInterval(intervalStatus);
            enqueueSnackbar(get(warning, 'response.data', 'Warning: The process installation was completed with some internal issues. Please contact with OMNA support'), {
              variant: 'warning'
            });
            history.push('/shopify');
          }
        }, 3000);
      } else {
        onSetUser(firstQuery);
        const notif = planStatusNotification(firstQuery.plan_name, firstQuery.plan_status, subscribeShopifyPlanAction);
        notif ? onPushNotification(notif) : null;
        history.push('/shopify');
      }
    }

    if (!code && !store) {
      window.location.replace(redirect);
    }
  }

  render() {
    const { classes } = this.props;
    const { shopifyAppStatus } = this.state;
    return (
      <div className={classes.root}>
        {shopifyAppStatus === 'ready_installing' ? <Loading text="Installing OMNA" /> : <Loading />}
      </div>
    );
  }
}

LockScreen.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  onSetUser: PropTypes.func.isRequired,
  onPushNotification: PropTypes.func.isRequired
};

const dispatchToProps = dispatch => ({
  onSetUser: bindActionCreators(setUser, dispatch),
  onPushNotification: bindActionCreators(pushNotification, dispatch),
});

const LockScreenMapped = connect(
  null,
  dispatchToProps
)(LockScreen);

export default withStyles(styles)(withSnackbar(LockScreenMapped));
