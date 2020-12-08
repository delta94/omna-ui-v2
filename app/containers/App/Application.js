import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Switch, Route } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import Loading from 'dan-components/Loading';
import { pushNotification, clearNotifications } from 'dan-actions/NotificationActions';
import { getter } from 'dan-containers/Common/Utils';
import { subscribeShopifyPlanAction } from 'dan-components/Notification/AlertActions';
import { getSettingsInfo, planStatusNotification } from 'dan-containers/Shopify/Services/ShopifyService';
import API from 'dan-containers/Utils/api';
import { setUser } from 'dan-actions/UserActions';
import AuthGuardRoute from '../Common/AuthGuardRoute';
import Dashboard from '../Templates/Dashboard';
import { LockScreen, Logout, NotFound } from '../pageListAsync';
import {
  OmnaAppRoutes as omnaRoutes,
  OmnaShopifyRoutes as shopifyRoutes,
  OmnaShopifyAdminRoutes as shopifyAdminRoutes
} from './routes';

class Application extends React.Component {
  state = {
    loadingApp: false
  }

  async componentDidMount() {
    const {
      onSetUser, tenantId, fromShopifyAppAdmin, enqueueSnackbar, onPushNotification, history, onclearNotifications
    } = this.props;
    if (!tenantId && getter.IS_AUTHENTICATED) {
      this.setState({ loadingApp: true });
      if (getter.TENANT_ID) {
        const response = await API.get(`tenants/${getter.TENANT_ID}`);
        const { data } = response.data;
        onSetUser(data);
        this.setState({ loadingApp: false });
      } else if (getter.STORE) {
        const settings = await getSettingsInfo(getter.STORE, fromShopifyAppAdmin, enqueueSnackbar);
        onSetUser(settings);
        const status = settings.shopifyAppStatus;

        this.installingNotification(status);

        if (status !== 'ready') {
          const intervalStatus = setInterval(async () => {
            const data = await getSettingsInfo(getter.STORE, fromShopifyAppAdmin, enqueueSnackbar);
            const { shopifyAppStatus } = data;

            if (shopifyAppStatus === 'ready_installing_products') {
              this.installingNotification(shopifyAppStatus);
              onSetUser(data);
              // call to Cenit app to change the status.
            }else{
              clearInterval(intervalStatus);
              history.push('/dashboard');
            }
            this.setState({ loadingApp: false });

          }, 5000);
        }else{
          onclearNotifications();
          const notif = planStatusNotification(settings.plan_name, settings.plan_status, subscribeShopifyPlanAction);
          notif ? onPushNotification(notif) : null;
        }

        this.setState({ loadingApp: false });
      }
    }
  }

  installingNotification = (status) => {

    const { onPushNotification } = this.props;

    if (status === 'ready_installing_products') {
      const productNotification = {
        message: 'Please, wait a few minutes before using the app completly, the Shopify products are still importing to OMNA',
        variant: 'warning'
      };
      onPushNotification(productNotification);

    }
  }

  render() {
    const { loadingApp } = this.state;
    const {
      changeMode, history, fromShopifyApp, fromShopifyAppAdmin
    } = this.props;

    const availableRoutes = !fromShopifyApp ? omnaRoutes : fromShopifyAppAdmin
      ? [...shopifyAdminRoutes, ...shopifyRoutes] : shopifyRoutes;

    return (
      <div>
        {!loadingApp ? (
          <Switch>
            {availableRoutes.map(route => (
              <AuthGuardRoute
                key={route.link}
                exact
                path={route.link}
                component={route.component}
                fromShopifyApp={fromShopifyApp}
                layout={Dashboard}
                history={history}
                changeMode={changeMode}
              />
            ))}
            <Route path="/lock-screen" history={history} component={LockScreen} />
            <Route path="/logout" component={Logout} />
            {/* Default */}
            <Route component={NotFound} />
          </Switch>
        ) : <Loading />}
      </div>
    );
  }
}

Application.propTypes = {
  changeMode: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  fromShopifyApp: PropTypes.bool.isRequired,
  fromShopifyAppAdmin: PropTypes.bool.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  tenantId: PropTypes.string.isRequired,
  onSetUser: PropTypes.func.isRequired,
  onPushNotification: PropTypes.func.isRequired,
  onclearNotifications: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  fromShopifyApp: state.getIn(['user', 'fromShopifyApp']),
  fromShopifyAppAdmin: state.getIn(['user', 'fromShopifyAppAdmin']),
  tenantId: state.getIn(['user', 'tenantId']),
  ...state
});

const dispatchToProps = dispatch => ({
  onSetUser: bindActionCreators(setUser, dispatch),
  onPushNotification: bindActionCreators(pushNotification, dispatch),
  onclearNotifications: bindActionCreators(clearNotifications, dispatch)
});

const ApplicationMapped = connect(
  mapStateToProps,
  dispatchToProps
)(Application);

export default withSnackbar(ApplicationMapped);
