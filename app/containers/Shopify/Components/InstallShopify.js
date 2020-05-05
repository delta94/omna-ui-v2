import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container, Divider } from '@material-ui/core';
import { withSnackbar } from 'notistack';
import PlansBoard from './PlansBoard';
import { getPlanInfoAvailablePlans } from '../Services/ShopifyService';
import CurrentPlan from './CurrentPlan';
import LoadingState from '../../Common/LoadingState';
import MySnackBar from '../../Common/SnackBar';

function InstallShopify(props) {
  const { enqueueSnackbar } = props;
  const [planCurrent, setPlanCurrent] = useState({});
  const [planCurrentStatus, setPlanCurrentStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [plansAvailable, setPlansAvailable] = useState([]);
  const store = JSON.parse(localStorage.getItem('currentTenant')).name;;

  useEffect(() => {
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
      {loading === true && (
        <div className="item-padding">
          <LoadingState
            loading={loading}
            text="OMNA App is loading for Shopify"
          />
        </div>
      )}
      {loading === false && (
        <Container maxWidth="md">
          {JSON.stringify(planCurrent) === '{}' && (
            <div style={{ marginTop: '10px' }}>
              <MySnackBar
                variant="info"
                info
                open
                message={`You have the app active into trial days. You have: ${
                  planCurrent.trial_days
                  } days left`}
              />
            </div>
          )}
          {JSON.stringify(planCurrent) === '{}' && (
            <div style={{ marginTop: '10px' }}>
              <MySnackBar
                variant="info"
                info
                open
                message="You must select an available OMNA plan to use the app"
              />
            </div>
          )}
          <CurrentPlan planCurrent={planCurrent} />
          <Divider />
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
  enqueueSnackbar: PropTypes.function.isRequired
};

export default withSnackbar(InstallShopify);
