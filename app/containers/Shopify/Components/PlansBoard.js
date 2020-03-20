import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import PlanInfo from './PlanInfo';
import ShopifyService from '../Services/ShopifyService';
import LoadingState from '../../Common/LoadingState';

const useStyles = makeStyles(() => ({
  container: {
    padding: '20px',
    width: '100%',
    border: 'none'
  }
}));

function PlansBoard(props) {
  const {
    plansAvailable,
    planCurrent,
    planCurrentStatus,
    currentPlanAction,
    currentPlanStatusAction,
    store
  } = props;
  const containerStyles = useStyles();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [planCurrent]);

  async function handleCreatePlan(name) {

    const result = await ShopifyService.CreatePlan(name, store);
    if (result) {
      currentPlanAction(result);
      currentPlanStatusAction(result.status);
    }
  }

  function handleConfirmPlan() {
    window.location.replace(planCurrent.confirmation_url);
  }
  async function handleActivatePlan(id) {

    const planAccepted = await ShopifyService.ActivatePlan(id, store);
    if (planAccepted) {
      currentPlanAction(planAccepted);
      currentPlanStatusAction(planAccepted.status);
    }
  }

  async function handelCancelPlan(planId) {
    const planCancelled = await ShopifyService.CancelPlan(planId, store);
    if (planCancelled) {
      currentPlanAction(planCancelled);
      currentPlanStatusAction(planCancelled.status);
    }
  }
  return (
    <div className={containerStyles.container}>
      {loading && <LoadingState loading={loading} text="Loading Plan info" />}

      {!loading && (plansAvailable
        && plansAvailable.map(item => (
          <PlanInfo
            key={item.id}
            planId={item.id}
            name={item.name}
            price={item.price}
            costByOrder={item.cost_by_order}
            orderLimit={item.order_limit}
            trialDays={item.trial_days}
            cappedAmount={item.capped_amount}
            actionLabel="Get It Now"
            CreatePlanAction={handleCreatePlan}
            ActivatePlanAction={handleActivatePlan}
            planCurrent={planCurrent}
            planCurrentStatus={planCurrentStatus}
            ConfirmPlanAction={handleConfirmPlan}
            CancelPlanAction={handelCancelPlan}
          />
        )))
      }
    </div>
  );
}

PlansBoard.propTypes = {
  store: PropTypes.string,
  plansAvailable: PropTypes.array,
  planCurrent: PropTypes.object,
  planCurrentStatus: PropTypes.string,
  currentPlanAction: PropTypes.function,
  currentPlanStatusAction: PropTypes.function

};

PlansBoard.defaultProps = {
  store: '',
  plansAvailable: [],
  planCurrent: {},
  planCurrentStatus: '',
  currentPlanAction: () => {},
  currentPlanStatusAction: () => {},
};

export default PlansBoard;
