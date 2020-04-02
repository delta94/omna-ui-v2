import React, { useState, useEffect } from 'react';
import { Container, Divider } from '@material-ui/core';
// import Loading from 'dan-components/Loading';
// import Utils from '../../Common/Utils';
import PlansBoard from './PlansBoard';
import ShopifyService from '../Services/ShopifyService';
import CurrentPlan from './CurrentPlan';
import LoadingState from '../../Common/LoadingState';
import MySnackBar from '../../Common/SnackBar';

function InstallShopify() {
  const [planCurrent, setPlanCurrent] = useState({});
  const [planCurrentStatus, setPlanCurrentStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [plansAvailable, setPlansAvailable] = useState([]);
  const [store, setStore] = useState('');

  useEffect(() => {
    const storeName = JSON.parse(localStorage.getItem('currentTenant')).name;
    setStore(storeName);

    async function getPlans() {
      const result = await ShopifyService.getPlanInfoAvailablePlans(storeName);

      if (result) {
        if (result.length > 0) {
          setPlansAvailable(result[0]);
          if (result[1] !== null) {
            setPlanCurrent(result[1]);
            setPlanCurrentStatus(result[1].status);
          }
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
          {JSON.stringify(planCurrent) !== '{}' && (
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

export default InstallShopify;
