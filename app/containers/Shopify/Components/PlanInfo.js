import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button
} from '@material-ui/core';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import styles from '../../../components/CardPaper/cardStyle-jss';

const useStyles = makeStyles(() => ({
  card: {
    display: 'inline-block',
    width: '30%',
    minWidth: '250px',
    maxWidth: 'unset !important',
    marginLeft: '1.5% !important',
    marginRight: '1.5% !important'
  },
  cardSelected: {
    display: 'inline-block',
    width: '30%',
    minWidth: '250px',
    maxWidth: 'unset !important',
    marginLeft: '1.5% !important',
    marginRight: '1.5% !important',
    border: 1
  },
  monthly: {
    fontSize: '18px'
  },
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  },
  planSelected: {
    color: '#070038',
    fontSize: '18px'
  }
}));

function PlanInfo(props) {
  const {
    name,
    price,
    costByOrder,
    orderLimit,
    actionLabel,
    classes,
    CreatePlanAction,
    ActivatePlanAction,
    planCurrentStatus,
    planCurrent,
    ConfirmPlanAction,
    CancelPlanAction
  } = props;

  const planStyles = useStyles();

  const getType = n => {
    switch (n) {
      case 'Bronze':
        return classes.cheap;
      case 'Silver':
        return classes.expensive;
      case 'Gold':
        return classes.moreExpensive;
      default:
        return classes.free;
    }
  };

  return (
    <Card
      className={classNames(
        classes.priceCard,
        getType(name),
        planCurrent.name === name ? planStyles.cardSelected : planStyles.card
      )}
    >
      <div className={classes.priceHead}>
        <Typography variant="h5">{name}</Typography>
        {planCurrent.name === name && (
          <span className={planStyles.planSelected}>-Plan Selected-</span>
        )}
        <Typography component="h4" variant="h2">
          $
          {price}
        </Typography>
        <span className={planStyles.monthly}>monthly</span>
      </div>
      <CardContent className={classes.featureList}>
        <ul>
          <li>Unlimited Marketplaces</li>
          <li>Unlimited Products Sync</li>
          <li>Real-Time Inventory Sync</li>
          <li>
            Includes
            {' '}
            {orderLimit}
            {' '}
            orders per month
          </li>
          <li>
            Additional order at US$
            {costByOrder}
            /order
          </li>
        </ul>
      </CardContent>
      <CardActions className={classes.btnArea}>
        {planCurrent.name !== name && (
          <Button
            variant="outlined"
            size="large"
            className={classes.lightButton}
            onClick={() => {
              CreatePlanAction(name);
            }}
          >
            {actionLabel}
          </Button>
        )}

        {planCurrent.name === name && (planCurrent.status === 'cancelled' || planCurrent.status === 'expired') && (
          <Button
            variant="outlined"
            size="large"
            className={classes.lightButton}
            onClick={() => {
              CreatePlanAction(name);
            }}
          >
            {actionLabel}
          </Button>
        )}

        {planCurrentStatus === 'pending' && planCurrent.name === name && (
          <div>
            <Button
              variant="outlined"
              size="large"
              className={classes.lightButton}
              onClick={() => {
                ConfirmPlanAction(name);
              }}
            >
              Confirm it
            </Button>
          </div>
        )}

        {planCurrentStatus === 'accepted' && planCurrent.name === name && (
          <div>
            {' '}
            <Button
              variant="outlined"
              size="small"
              className={classes.lightButton}
              onClick={() => {
                ActivatePlanAction(planCurrent.id);
              }}
            >
              Activate it
            </Button>
          </div>
        )}

        {planCurrentStatus === 'active' && planCurrent.name === name && (
          <div>
            {' '}
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              className={classes.lightButton}
              onClick={() => {
                CancelPlanAction(planCurrent.id);
              }}
            >
              Cancel it
            </Button>
          </div>
        )}
      </CardActions>
    </Card>
  );
}

PlanInfo.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  costByOrder: PropTypes.number.isRequired,
  orderLimit: PropTypes.number.isRequired,
  actionLabel: PropTypes.string,
  classes: PropTypes.object.isRequired,
  CreatePlanAction: PropTypes.func,
  ActivatePlanAction: PropTypes.func,
  planCurrent: PropTypes.object,
  planCurrentStatus: PropTypes.string,
  ConfirmPlanAction: PropTypes.func,
  CancelPlanAction: PropTypes.func
};

PlanInfo.defaultProps = {
  actionLabel: '',
  planCurrent: {},
  planCurrentStatus: '',
  CreatePlanAction: () => {},
  ActivatePlanAction: () => {},
  ConfirmPlanAction: () => {},
  CancelPlanAction: () => {}
};

export default withStyles(styles)(PlanInfo);
