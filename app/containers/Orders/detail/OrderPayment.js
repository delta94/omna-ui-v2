import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';

export default class OrderPayment extends Component {
  render() {
    const { classes, totalPrice, status } = this.props;

    return (
      <Card
        className={classes.subRoot}
        style={{ flex: '1 1 auto', paddingBottom: '8px' }}
      >
        <CardHeader title="Payment" />
        <div className="display-flex justify-content-space-between">
          <div className={classes.marginLeft2u}>
            <Typography variant="caption">Amount</Typography>
          </div>
          <div>
            <Typography variant="caption">${totalPrice}</Typography>
          </div>
          <div className={classes.marginRight}>
            <Typography variant="caption">{status}</Typography>
          </div>
        </div>
      </Card>
    );
  }
}

OrderPayment.propTypes = {
  classes: PropTypes.object.isRequired,
  totalPrice: PropTypes.number,
  status: PropTypes.string
};
