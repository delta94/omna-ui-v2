import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import classNames from 'classnames';
import Dvr from '@material-ui/icons/Dvr';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Healing from '@material-ui/icons/Healing';
import FilterCenterFocus from '@material-ui/icons/FilterCenterFocus';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import LocalActivity from '@material-ui/icons/LocalActivity';
import Typography from '@material-ui/core/Typography';
import colorfull from 'dan-api/palette/colorfull';
import styles from './widget-jss';

class PerformanceChartWidget extends PureComponent {

  render() {
    const { classes, orders, products } = this.props;
  
    console.log(orders);

    return (
      <Paper
        style={{ padding: '8px 16px', marginBottom: 16 }}
      >
        <ul className={classes.bigResume} style={{ margin: 0 }}>
          <li>
            <Avatar className={classNames(classes.avatar, classes.blueAvatar)}>
              <Dvr />
            </Avatar>
            <Typography variant="h6">
              <span className={classes.blueText}>{orders.pagination.total}</span>
              <Typography>Orders</Typography>
            </Typography>
          </li>
          <li>
            <Avatar className={classNames(classes.avatar, classes.tealAvatar)}>
              <CheckCircle />
            </Avatar>
            <Typography variant="h6">
              <span className={classes.tealText}>{products.pagination.total}</span>
              <Typography>Products</Typography>
            </Typography>
          </li>
          <li>
            <Avatar className={classNames(classes.avatar, classes.pinkAvatar)}>
              <Healing />
            </Avatar>
            <Typography variant="h6">
              <span className={classes.pinkText}>17</span>
              <Typography>Complaints</Typography>
            </Typography>
          </li>
          <li>
            <Avatar
              className={classNames(classes.avatar, classes.purpleAvatar)}
            >
              <LocalActivity />
            </Avatar>
            <Typography variant="h6">
              <span className={classes.purpleText}>18</span>
              <Typography>Referrals</Typography>
            </Typography>
          </li>
        </ul>
      </Paper>
    );
  }
}

PerformanceChartWidget.propTypes = {
  classes: PropTypes.object.isRequired,
  orders: PropTypes.array,
  products: PropTypes.array
};

export default withStyles(styles)(PerformanceChartWidget);
