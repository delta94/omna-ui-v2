import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// import { bindActionCreators } from 'redux';
import { withSnackbar } from 'notistack';
// import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Loading from 'dan-components/Loading';
// import { activatePlan, createPlan, cancelPlan, shopifyNotification } from '../Services/ShopifyService';
import { activatePlan, createPlan, cancelPlan } from '../Services/ShopifyService';
import PlanInfo from './PlanInfo';
// import {
//   pushNotification
// } from '../../../actions/NotificationActions';


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
    store,
    // history,
    enqueueSnackbar,
    // onPushNotification
  } = props;
  const containerStyles = useStyles();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [planCurrent]);

  async function handleCreatePlan(name) {


    setLoading(true);
    const result = await createPlan(name, store, enqueueSnackbar);
    if (result) {
      currentPlanAction(result);
      currentPlanStatusAction(result.status);

      // const notification = {
      //   message: `test`,
      //   variant: 'warning',
      //   action: ''
      // };
      // onPushNotification(notification);


      setLoading(false);
    }
  }

  function handleConfirmPlan() {
    window.location.replace(planCurrent.confirmation_url);
  }
  async function handleActivatePlan(id) {
    setLoading(true);
    const plan = await activatePlan(id, store, enqueueSnackbar);
    if (plan) {
      currentPlanAction(plan);
      currentPlanStatusAction(plan.status);
    }
    setLoading(false);
  }

  async function handelCancelPlan(planId) {
    setLoading(true);
    const planCancelled = await cancelPlan(planId, store, enqueueSnackbar);

    if (planCancelled) {
      currentPlanAction(planCancelled);
      currentPlanStatusAction(planCancelled.status);
    }
    setLoading(false);
  }
  return (
    <div className={containerStyles.container}>
      {loading && <Loading />}

      {plansAvailable
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
        ))
      }
    </div>
  );
}

PlansBoard.propTypes = {
  store: PropTypes.string,
  plansAvailable: PropTypes.array,
  planCurrent: PropTypes.object,
  planCurrentStatus: PropTypes.string,
  enqueueSnackbar: PropTypes.func.isRequired,
  currentPlanAction: PropTypes.func,
  currentPlanStatusAction: PropTypes.func
  // onPushNotification: PropTypes.func.isRequired,
  // history: PropTypes.object.isRequired,
};

PlansBoard.defaultProps = {
  store: '',
  plansAvailable: [],
  planCurrent: {},
  planCurrentStatus: '',
  currentPlanAction: () => {},
  currentPlanStatusAction: () => {},

};

// const mapDispatchToProps = dispatch => ({
//   onPushNotification: bindActionCreators(pushNotification, dispatch)
// });

export default withSnackbar(PlansBoard);
// const PlansBoardMapped = withSnackbar(withStyles(useStyles)(PlansBoard));

// export default connect(
//   null,
//   mapDispatchToProps
// )(PlansBoardMapped);


