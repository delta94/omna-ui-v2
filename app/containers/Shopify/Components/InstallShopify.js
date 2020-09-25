import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container} from '@material-ui/core';
import { withSnackbar } from 'notistack';
// import Alert from 'dan-components/Notification/Alert';
import LoadingState from 'dan-containers/Common/LoadingState';
import { currentTenant } from 'dan-containers/Common/Utils';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
import PlansBoard from './PlansBoard';
import { getPlanInfoAvailablePlans } from '../Services/ShopifyService';

// import CurrentPlan from './CurrentPlan';
// import {
//   pushNotification
// } from '../../../actions/NotificationActions';

function InstallShopify(props) {
  const { enqueueSnackbar, history } = props;
  const [planCurrent, setPlanCurrent] = useState({});
  const [planCurrentStatus, setPlanCurrentStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [plansAvailable, setPlansAvailable] = useState([]);
  const store = currentTenant ? currentTenant.name : '';


  async function getPlans() {

    const result = await getPlanInfoAvailablePlans(store, enqueueSnackbar);

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
    getPlans();
  }, [])

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
          <LoadingState
            loading={loading}
            // text="OMNA App is loading for Shopify"
          />
        </div>
      ) : (
          <Container maxWidth="md">
            {/* {JSON.stringify(planCurrent) !== '{}' && <Alert
              variant="info"
              open={planCurrent.status === 'active'}
              message={`You have the app active into trial days. You have: ${planCurrent.trial_days} days left`}
            />}
            <Alert
              variant="info"
              open={JSON.stringify(planCurrent) === '{}'}
              message="You must select and active an available OMNA plan to use the app"
            /> */}
            {/* {JSON.stringify(planCurrent) !== '{}' && (<div> <CurrentPlan planCurrent={planCurrent} /> <Divider /> </div>)} */}

            <PlansBoard
              store={store}
              history={history}
              plansAvailable={plansAvailable}
              planCurrent={planCurrent}
              planCurrentStatus={planCurrentStatus}
              currentPlanAction={handleCurrentPlan}
              currentPlanStatusAction={handleCurrentPlanStatus}
            />{' '}
          </Container>
        )}
    </div>
  );
}

InstallShopify.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default withSnackbar(InstallShopify);

// const mapDispatchToProps = dispatch => ({
//   onPushNotification: bindActionCreators(pushNotification, dispatch)
// });

// const InstallShopifyMapped = withSnackbar(InstallShopify);

// export default connect(
//   null,
//   mapDispatchToProps
// )(InstallShopifyMapped);
