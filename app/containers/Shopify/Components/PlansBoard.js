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

function PlansBoard({ plans }) {

    const containerStyles = useStyles();

    return (
        <div className={containerStyles.container}>
            {
                plans.map((item, index) => (
                    <PlanInfo key={(index + 1).toString()} 
                              name={item.name}
                              price={item.price.toString()}
                              costByOrder={item.cost_by_order.toString()}
                              orderLimit={item.order_limit.toString()}
                              trialDays={item.trial_days.toString()}
                              cappedAmount={item.capped_amount.toString()}
                              actionLabel="Get It Now"
                    />
                ))
            }
        </div>
    );
}

export default PlansBoard;

PlansBoard.propTypes = {
    plans: PropTypes.array.isRequired
};
