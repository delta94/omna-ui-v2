import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container, Divider } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import Alert from 'dan-components/Notification/Alert';
import LoadingState from 'dan-containers/Common/LoadingState';
import { currentTenant } from 'dan-containers/Common/Utils';
import PlansBoard from './PlansBoard';
import { getPlanInfoAvailablePlans } from '../Services/ShopifyService';
import CurrentPlan from './CurrentPlan';

function InstallShopify(props) {
  const { enqueueSnackbar } = props;
  const [planCurrent, setPlanCurrent] = useState({});
  const [planCurrentStatus, setPlanCurrentStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [plansAvailable, setPlansAvailable] = useState([]);
  const store = currentTenant ? currentTenant.name : '';

  useEffect(() => {

    // verify Shopify entry

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
    getPlans();
  }, []);

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
          <LoadingState
            loading={loading}
            text="OMNA App is loading for Shopify"
          />
        </div>
      ) : (
          <Container maxWidth="md">
            {JSON.stringify(planCurrent) !== '{}' && <Alert
              variant="info"
              open={planCurrent.status === 'active'}
              message={`You have the app active into trial days. You have: ${planCurrent.trial_days} days left`}
            />}
            <Alert
              variant="info"
              open={JSON.stringify(planCurrent) === '{}'}
              message="You must select and active an available OMNA plan to use the app"
            />
            {JSON.stringify(planCurrent) !== '{}' && (<div> <CurrentPlan planCurrent={planCurrent} /> <Divider /> </div>)}

            <PlansBoard
              store={store}
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
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(InstallShopify);
