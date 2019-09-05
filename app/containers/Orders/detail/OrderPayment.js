import React, { Component } from 'react';
import classNames from 'classnames';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';

export default class OrderPayment extends Component {
  render() {
    const { classes, totalPrice, status } = this.props;

    return (
      <Card className={classes.subRoot}>
        <Typography variant="subtitle1" className={classes.marginLeft}>
          <strong>Payment</strong>
        </Typography>
        <div className="display-flex justify-content-space-between">
          <div className={classes.marginLeft2u}>
            <Typography variant="caption">Amount</Typography>
          </div>
          <div>
            <Typography variant="caption">
$
              {totalPrice}
            </Typography>
          </div>
          <div className={classes.marginRight}>
            <Typography variant="caption">{status}</Typography>
          </div>
        </div>
      </Card>
    );
  }
}
