import React, { useState, useEffect } from 'react';
import { Container, Divider } from '@material-ui/core';
// import Loading from 'dan-components/Loading';
// import Utils from '../../Common/Utils';
import PlansBoard from './PlansBoard';
import ShopifyService from '../Services/ShopifyService';
import CurrentPlan from './CurrentPlan';
import LoadingState from '../../Common/LoadingState';
import MySnackBar from '../../Common/SnackBar';

// const useStyles = makeStyles({
//   circularProgress: {
//     zIndex: 1500,
//     position: 'fixed',
//     top: 'calc(50% - 45px)',
//     left: 'calc(50% - 45px)'
//   },
//   circularProgressText: {
//     zIndex: 1500,
//     position: 'fixed',
//     top: 'calc(64% - 55px)',
//     left: 'calc(40% - 45px)'
//   }
// });

function InstallShopify() {
  // const classes = useStyles();
  // const isAuthenticated = Utils.isAuthenticated();

  const [planCurrent, setPlanCurrent] = useState({});
  const [planCurrentStatus, setPlanCurrentStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [plansAvailable, setPlansAvailable] = useState([]);
  const [store, setStore] = useState('');
  // const { store } = location.state;

  useEffect(() => {
    // const storeName = JSON.parse(localStorage.getItem('currentTenant')).name;
    const storeName = JSON.parse(localStorage.getItem('currentTenant')).name;

    setStore(storeName);

    async function getPlans() {
      const result = await ShopifyService.getPlanInfoAvailablePlans(storeName);

      if (result) {
        setPlansAvailable(result[0]);
        setPlanCurrent(result[1]);
        setPlanCurrentStatus(result[1].status);
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
          {planCurrent && planCurrent.trial_days !== 0 && (
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
          <CurrentPlan planCurrent={planCurrent} />
          <Divider />
          <PlansBoard
            store={store}
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

export default InstallShopify;
