import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import PricingCard from '../CardPaper/PricingCard';
import Title from './Title';
import styles from './landingStyle-jss';

class Pricing extends React.Component {
  render() {
    const { classes, slideMode } = this.props;
    return (
      <div className={classes.pricing}>
        <div className={slideMode ? classes.fullWidth : classes.container}>
          <Title
            title="Pricing"
            desc=""
            align="center"
            monocolor={slideMode && true}
          />
          <Grid container className={classes.root} spacing={5}>
            <Grid item md={4} xs={12}>
              <PricingCard
                title="For Learn"
                price="FREE"
                tier="free"
                feature={[
                  '1 Month trial',
                  'No credit card required',
                  'Not limitation in the use of the app'
                ]}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <PricingCard
                title="Small Bussines"
                price="$15 USD"
                tier="cheap"
                feature={['Price per tenant*', 'Only system support']}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <PricingCard
                title="Grow Up"
                price="$99 USD"
                tier="expensive"
                feature={[
                  'Price per tenant*',
                  'VIP Support including business logic'
                ]}
              />
            </Grid>
          </Grid>
          <Typography component="p" className={classes.contactText}>
            * Think in your tenant as your database, OMNA is a multi-tenant
            solution.
          </Typography>
        </div>
      </div>
    );
  }
}

Pricing.propTypes = {
  classes: PropTypes.object.isRequired,
  slideMode: PropTypes.bool
};

Pricing.defaultProps = {
  slideMode: false
};

export default withStyles(styles)(Pricing);
