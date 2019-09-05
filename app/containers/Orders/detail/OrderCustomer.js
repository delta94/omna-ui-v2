import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

class OrderCustomer extends Component {
  render() {
    const {
      classes, customerFirstName, shipAddress, billAddress
    } = this.props;

    return (
      <Card
        style={{ flex: '1 1 auto' }}
        className={classNames(classes.subRoot, classes.marginLeft)}
      >
        <CardHeader title={customerFirstName} subheader="Customer" />
        <Divider variant="middle" />
        <div
          className="display-flex justify-content-space-between"
          style={{ flexFlow: 'row wrap' }}
        >
          <List
            className={classes.root}
            dense
            subheader={(
              <ListSubheader component="div" id="nested-list-subheader">
                Shipping Address
              </ListSubheader>
            )}
          >
            <ListItem>
              <Typography variant="subtitle2">Country:</Typography>
              <ListItemText primary={shipAddress.country} />
            </ListItem>
            <ListItem>
              <Typography variant="subtitle2">State:</Typography>
              <ListItemText primary={shipAddress.state} />
            </ListItem>
            <ListItem>
              <Typography variant="subtitle2">City:</Typography>
              <ListItemText primary={shipAddress.city} />
            </ListItem>
            <ListItem>
              <Typography variant="subtitle2">Phone:</Typography>
              <ListItemText primary={shipAddress.phone} />
            </ListItem>
            <ListItem>
              <Typography variant="subtitle2">ZIP Code:</Typography>
              <ListItemText primary={shipAddress.zip_code} />
            </ListItem>
            <ListItem>
              <Typography variant="subtitle2">Address:</Typography>
              <ListItemText primary={shipAddress.address} />
            </ListItem>
          </List>

          <List
            className={classes.root}
            dense
            subheader={(
              <ListSubheader component="div" id="nested-list-subheader">
                Billing Address
              </ListSubheader>
            )}
          >
            <ListItem>
              <Typography variant="subtitle2">Country:</Typography>
              <ListItemText primary={billAddress.country} />
            </ListItem>
            <ListItem>
              <Typography variant="subtitle2">State:</Typography>
              <ListItemText primary={billAddress.state} />
            </ListItem>
            <ListItem>
              <Typography variant="subtitle2">City:</Typography>
              <ListItemText primary={billAddress.city} />
            </ListItem>
            <ListItem>
              <Typography variant="subtitle2">Phone:</Typography>
              <ListItemText primary={billAddress.phone} />
            </ListItem>
            <ListItem>
              <Typography variant="subtitle2">ZIP Code:</Typography>
              <ListItemText primary={billAddress.zip_code} />
            </ListItem>
            <ListItem>
              <Typography variant="subtitle2">Address:</Typography>
              <ListItemText primary={billAddress.address} />
            </ListItem>
          </List>
        </div>
      </Card>
    );
  }
}

OrderCustomer.propTypes = {
  classes: PropTypes.object.isRequired,
  customerFirstName: PropTypes.string.isRequired,
  shipAddress: PropTypes.object.isRequired,
  billAddress: PropTypes.object.isRequired
};

export default OrderCustomer;
