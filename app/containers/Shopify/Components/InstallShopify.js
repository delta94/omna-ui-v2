import React, { useState, useEffect } from 'react';
import { CircularProgress, Container, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Utils from '../../Common/Utils';
import PlansBoard from './PlansBoard';
import ShopifyService from '../Services/ShopifyService';
import CurrentPlan from './CurrentPlan';

const useStyles = makeStyles({
  circularProgress: {
    zIndex: 1500,
    position: 'fixed',
    top: 'calc(50% - 45px)',
    left: 'calc(50% - 45px)'
  },
  circularProgressText: {
    zIndex: 1500,
    position: 'fixed',
    top: 'calc(64% - 55px)',
    left: 'calc(40% - 45px)'
  }
});

function InstallShopify() {
  const classes = useStyles();
  const isAuthenticated = Utils.isAuthenticated();

  const [plansAvailable, setPlansAvailable] = useState([]);
  const [planCurrent, setPlanCurrent] = useState({});

  useEffect(() => {
    async function getPlans() {
      const result = await ShopifyService.getPlanInfoAvailablePlans(
        'omnatesting3.myshopify.com'
      );
      if (result) {
        setPlansAvailable(result[0]);
        setPlanCurrent(result[1]);
      }
    }
    getPlans();
  }, []);

  return (
    <div>
      {!isAuthenticated && (
        <div>
          <CircularProgress
            className={classes.circularProgress}
            size={70}
            thickness={2}
            color="secondary"
          />
          <h2 className={classes.circularProgressText}>
            OMNA App is loading for Shopify
          </h2>
        </div>
      )}
      {/* {planCurrent.null && <CurrentPlan />} */}

      {planCurrent && plansAvailable.length > 0 ? (
        <Container maxWidth="md">
          <CurrentPlan planCurrent={planCurrent} />
          <Divider />
          <PlansBoard plansAvailable={plansAvailable} />{' '}
        </Container>
      ) : (
        <h1>Loading</h1>
      )}
    </div>
  );
}

export default InstallShopify;
