import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import PlanInfo from './PlanInfo';

const useStyles = makeStyles(() => ({
  container: {
    padding: '20px',
    width: '100%',
    border: 'none'
  }
}));

function PlansBoard({ plansAvailable }) {
  const containerStyles = useStyles();

  return (
    <div className={containerStyles.container}>
      {plansAvailable
        && plansAvailable.map(item => (
          <PlanInfo
            key={item.id}
            name={item.name}
            price={item.price}
            costByOrder={item.cost_by_order}
            orderLimit={item.order_limit}
            trialDays={item.trial_days}
            cappedAmount={item.capped_amount}
            actionLabel="Get It Now"
          />
        ))}
    </div>
  );
}

export default PlansBoard;

PlansBoard.propTypes = {
  plansAvailable: PropTypes.array.isRequired
};
