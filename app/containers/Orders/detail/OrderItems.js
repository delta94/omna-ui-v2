import React, { Component } from 'react';
import get from 'lodash/get';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';

class OderItems extends Component {
  render() {
    const { classes, order } = this.props;

    return (
      <Card className={classes.subRoot}>
        <Typography variant="subtitle1" className={classes.marginLeft}>
          <strong>Items</strong>
        </Typography>
        <div>
          {order && order.data && order.data.line_items
            ? order.data.line_items.map(row => (
              <div key={get(row, 'id', 0)}>
                <div className="display-flex justify-content-space-between">
                  <div className={classes.marginLeft2u}>
                    <Typography variant="caption">{row.id}</Typography>
                  </div>
                  <div>
                    <Typography variant="caption" color="primary">
                      <strong>Name:</strong>
                      {' '}
                      {get(row, 'name', null)}
                    </Typography>
                    <Typography variant="caption" color="secondary">
                      <strong>SKU:</strong>
                      {' '}
                      {get(row, 'sku', null)}
                    </Typography>
                  </div>
                  <div>
                    <Typography variant="caption" color="inherit">
                        $
                      {get(row, 'price', 0) + 'x' + get(row, 'quantity', 0)}
                    </Typography>
                  </div>
                  <div className={classes.marginRight}>
                    <Typography variant="caption">
                        $
                      {row.price * row.quantity}
                    </Typography>
                  </div>
                </div>
                <Divider />
              </div>
            ))
            : null}
        </div>
      </Card>
    );
  }
}

export default OderItems;
