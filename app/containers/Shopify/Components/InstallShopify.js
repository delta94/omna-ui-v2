import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Container } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import LoadingState from 'dan-containers/Common/LoadingState';
import { pushNotification, clearNotifications } from 'dan-actions/NotificationActions';
import { subscribeShopifyPlanAction } from 'dan-components/Notification/AlertActions';
import { getSetPlanStatus, getSetPlanName } from 'dan-actions/UserActions';
import { planStatusNotification } from 'dan-containers/Shopify/Services/ShopifyService';
import PlansBoard from './PlansBoard';
import { getPlanInfoAvailablePlans } from '../Services/ShopifyService';

function InstallShopify(props) {
  const { tenantName, enqueueSnackbar, history, onSetPlanStatus, planName, planStatus, onSetPlanName, onPushNotification, onClearNotifications } = props;
  const [planCurrent, setPlanCurrent] = useState({});
  const [planCurrentStatus, setPlanCurrentStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [plansAvailable, setPlansAvailable] = useState([]);


  const handleNotification = (name, status) => {
    onClearNotifications();
    onSetPlanStatus(status);
    onSetPlanName(name);
    const notif = planStatusNotification(name, status, subscribeShopifyPlanAction);
    notif ? onPushNotification(notif) : null;
  };

  async function getPlans() {
    const result = await getPlanInfoAvailablePlans(tenantName, enqueueSnackbar);
    if (result) {
      const { availablePlans, currentPlan } = result;
      setPlansAvailable(availablePlans);
      if (currentPlan) {
        setPlanCurrent(currentPlan);
        setPlanCurrentStatus(currentPlan.status);
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    tenantName ? getPlans() : null;
    handleNotification(planName, planStatus);
  }, [tenantName]);


  useEffect(() => {
    if (planCurrentStatus && JSON.stringify(planCurrent) !== '{}') {
      handleNotification(planCurrent.name, planCurrentStatus);
    }
  }, [planCurrent, planCurrentStatus]);

  function handleCurrentPlan(plan) {
    setPlanCurrent(plan);
  }

  function handleCurrentPlanStatus(status) {
    setPlanCurrentStatus(status);
  }

  return (
    <div>
      {loading ? (
        <div className="item-padding">
          <LoadingState loading={loading} />
        </div>
      ) : (
        <Container maxWidth="md">
          <PlansBoard
            store={tenantName}
            history={history}
            plansAvailable={plansAvailable}
            planCurrent={planCurrent}
            planCurrentStatus={planCurrentStatus}
            currentPlanAction={handleCurrentPlan}
            currentPlanStatusAction={handleCurrentPlanStatus}
          />
          {' '}
        </Container>
      )}
    </div>
  );
}

InstallShopify.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  onSetPlanStatus: PropTypes.func.isRequired,
  onSetPlanName: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  tenantName: PropTypes.string.isRequired,
  planName: PropTypes.string.isRequired,
  planStatus: PropTypes.string.isRequired,
  onPushNotification: PropTypes.func.isRequired,
  onClearNotifications: PropTypes.func.isRequired
};


const mapStateToProps = state => ({
  tenantName: state.getIn(['user', 'tenantName']),
  planName: state.getIn(['user', 'planName']),
  planStatus: state.getIn(['user', 'planStatus']),
  ...state
});
// getSetPlanStatus
const mapDispatchToProps = dispatch => ({
  onSetPlanStatus: bindActionCreators(getSetPlanStatus, dispatch),
  onSetPlanName: bindActionCreators(getSetPlanName, dispatch),
  onPushNotification: bindActionCreators(pushNotification, dispatch),
  onClearNotifications: bindActionCreators(clearNotifications, dispatch)
});

const InstallShopifyMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(InstallShopify);

export default withSnackbar(InstallShopifyMapped);
