import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Container } from '@material-ui/core';
import { withSnackbar } from 'notistack';
// import Alert from 'dan-components/Notification/Alert';
import LoadingState from 'dan-containers/Common/LoadingState';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
import PlansBoard from './PlansBoard';
import { getPlanInfoAvailablePlans } from '../Services/ShopifyService';

// import CurrentPlan from './CurrentPlan';
// import {
//   pushNotification
// } from '../../../actions/NotificationActions';

function InstallShopify(props) {
  const { tenantName, enqueueSnackbar, history } = props;
  const [planCurrent, setPlanCurrent] = useState({});
  const [planCurrentStatus, setPlanCurrentStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [plansAvailable, setPlansAvailable] = useState([]);

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
  }, [tenantName]);

  function handleCurrentPlan(plan) {
    setPlanCurrent(plan);
    // printNotification();
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
  history: PropTypes.object.isRequired,
  tenantName: PropTypes.string.isRequired,
};


const mapStateToProps = state => ({
  tenantName: state.getIn(['user', 'tenantName']),
  ...state
});

const InstallShopifyMapped = connect(
  mapStateToProps,
  null
)(InstallShopify);

export default withSnackbar(InstallShopifyMapped);
