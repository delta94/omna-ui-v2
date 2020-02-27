import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Card, CardContent, CardActions, Button } from '@material-ui/core';
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
    monthly: {
        fontSize: '18px'
    }
}));

function PlanInfo(props) {    
    
    const { name, price, costByOrder, orderLimit, cappedAmount, trialDays, actionLabel, classes } = props;

    const planStyles = useStyles();   

    const getType = (n) => {
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
        <Card className={classNames(classes.priceCard, getType(name), planStyles.card)}>
            <div className={classes.priceHead}>
                <Typography variant="h5">
                    {name}
                </Typography>
                <Typography component="h4" variant="h2">
                    ${price}
                </Typography>
                <span className={planStyles.monthly}>monthly</span>
            </div>
            <CardContent className={classes.featureList}>
                <ul>
                    <li>${costByOrder} per Order</li>
                    <li>Manage until {orderLimit} orders</li>
                    <li>Maximum price of ${cappedAmount}</li>
                    <li>{trialDays} trial days</li>
                </ul>
            </CardContent>
            <CardActions className={classes.btnArea}>
                <Button variant="outlined" 
                        size="large" 
                        className={classes.lightButton}>

                    {actionLabel}
                </Button>
            </CardActions>
        </Card>
    );
}

export default withStyles(styles)(PlanInfo);

PlanInfo.propTypes = {
    name: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    costByOrder: PropTypes.string.isRequired,
    orderLimit: PropTypes.string.isRequired,
    cappedAmount: PropTypes.string.isRequired,
    trialDays: PropTypes.string.isRequired,
    actionLabel: PropTypes.string,
    classes: PropTypes.object.isRequired
};
