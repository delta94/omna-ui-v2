import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Utils from '../../Common/Utils';
import PlansBoard from './PlansBoard';
import ShopifyService from '../Services/ShopifyService';

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

  const [plans, setPlans] = useState([]);

  useEffect(() => {
    async function getPlans() {
      const result = await ShopifyService.getPlanInfo(
        'omnatesting2.myshopify.com'
      );
      setPlans(result);
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
      {plans.length > 0 && <PlansBoard plans={plans} />}
    </div>
  );
}

export default InstallShopify;
