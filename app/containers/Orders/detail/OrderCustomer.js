import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import styles from './order-detail-jss';

class OrderCustomer extends Component {
  render() {
    const { classes, customerFirstName, shipAddress, billAddress } = this.props;

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
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Shipping Address
              </ListSubheader>
            }
          >
            <ListItem>
              <ListItemText
                primary={
                  <Fragment>
                    <Typography className={classes.inline} variant="subtitle2">
                      {`Country: `}
                    </Typography>
                    {shipAddress.country}
                  </Fragment>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <Fragment>
                    <Typography classNanme={classes.inline} variant="subtitle2">
                      {`State: `}
                    </Typography>
                    {shipAddress.state}
                  </Fragment>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <Fragment>
                    <Typography className={classes.inline} variant="subtitle2">
                      {`City: `}
                    </Typography>
                    {shipAddress.city}
                  </Fragment>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <Fragment>
                    <Typography className={classes.inline} variant="subtitle2">
                      {`Phone: `}
                    </Typography>
                    {shipAddress.phone}
                  </Fragment>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <Fragment>
                    <Typography className={classes.inline} variant="subtitle2">
                      {`ZIP Code: `}
                    </Typography>
                    {shipAddress.zip_code}
                  </Fragment>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <Fragment>
                    <Typography clasName={classes.inline} variant="subtitle2">
                      {`Address: `}
                    </Typography>
                    {shipAddress.address}
                  </Fragment>
                }
              />
            </ListItem>
          </List>

          <List
            className={classes.root}
            dense
            subheader={
              <ListSubheader component="div" id="nested-list-subheader">
                Billing Address
              </ListSubheader>
            }
          >
            <ListItem>
              <ListItemText
                primary={
                  <Fragment>
                    <Typography classNanme={classes.inline} variant="subtitle2">
                      {`Country: `}
                    </Typography>
                    {billAddress.country}
                  </Fragment>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <Fragment>
                    <Typography className={classes.inline} variant="subtitle2">
                      {`State: `}
                    </Typography>
                    {billAddress.state}
                  </Fragment>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <Fragment>
                    <Typography className={classes.inline} variant="subtitle2">
                      {`City: `}
                    </Typography>
                    {billAddress.city}
                  </Fragment>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <Fragment>
                    <Typography className={classes.inline} variant="subtitle2">
                      {`Phone: `}
                    </Typography>
                    {billAddress.phone}
                  </Fragment>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <Fragment>
                    <Typography className={classes.inline} variant="subtitle2">
                      {`ZIP Code: `}
                    </Typography>
                    {billAddress.zip_code}
                  </Fragment>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary={
                  <Fragment>
                    <Typography className={classes.inline} variant="subtitle2">
                      {`Address: `}
                    </Typography>
                    {billAddress.address}
                  </Fragment>
                }
              />
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

export default withStyles(styles)(OrderCustomer);
