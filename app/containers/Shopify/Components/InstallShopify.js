import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Utils from '../../Common/Utils';
import PlansBoard from './PlansBoard';

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

const plans = [{
    name: 'Bronze',
    price: 18,
    cost_by_order: 0.18,
    order_limit: 100,
    terms: '$18 monthly, manage until 100 orders, $0.18 per Order',
    capped_amount: 1000,
    trial_days: 14
},
{
    name: 'Silver',
    price: 48,
    cost_by_order: 0.10,
    order_limit: 500,
    terms: '$48 monthly, manage until 500 orders, $0.10 per Order',
    capped_amount: 1000,
    trial_days: 14
},
{
    name: 'Gold',
    price: 78,
    cost_by_order: 0.08,
    order_limit: 1000,
    terms: '$78 monthly, manage until 1000 orders, $0.08 per Order',
    capped_amount: 1000,
    trial_days: 14
}];

function InstallShopify() {
  const classes = useStyles();
  const isAuthenticated = Utils.isAuthenticated();
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
      {isAuthenticated && (
        <div>{<PlansBoard plans={plans} />}</div>
      )}
    </div>
  );
}

export default InstallShopify;
