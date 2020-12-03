import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Button, Paper } from '@material-ui/core';
import classNames from 'classnames';
import Dvr from '@material-ui/icons/Dvr';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Healing from '@material-ui/icons/Healing';
import Avatar from '@material-ui/core/Avatar';
import TasksIcon from '@material-ui/icons/PlaylistAddCheck';
import Typography from '@material-ui/core/Typography';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import styles from './widget-jss';

class PerformanceChartWidget extends PureComponent {
  render() {
    const { classes, flows, orders, webhooks, tasks, products, fromShopifyApp } = this.props;

    return (
      <Paper style={{ padding: '8px 16px', marginBottom: 16 }}>
        <ul className={classes.bigResume} style={{ margin: 0 }}>
          <li>
            <Button color="primary" component={Link} to="/orders">
              <Avatar
                className={classNames(classes.avatar, classes.blueAvatar)}
                onClick={this.handleClick}
              >
                <Dvr />
              </Avatar>
              <Typography variant="h6">
                <span className={classes.blueText}>
                  {orders.getIn(['pagination', 'total'])}
                </span>
                <Typography>Orders</Typography>
              </Typography>
            </Button>
          </li>
          <li>
            <Button color="primary" component={Link} to="/products">
              <Avatar
                className={classNames(classes.avatar, classes.orangeAvatar)}
                onClick={this.handleClick}
              >
                <ShoppingCartIcon />
              </Avatar>
              <Typography variant="h6">
                <span className={classes.orangeText}>
                  {products.pagination ? `${products.pagination.total}` : '0'}
                </span>
                <Typography>Products</Typography>
              </Typography>
            </Button>
          </li>
          {!fromShopifyApp && (
            <li>
              <Button color="primary" component={Link} to="/webhooks">
                <Avatar
                  className={classNames(classes.avatar, classes.tealAvatar)}
                >
                  <CheckCircle />
                </Avatar>
                <Typography variant="h6">
                  <span className={classes.tealText}>
                    {webhooks.getIn(['pagination', 'total'])}
                  </span>
                  <Typography>Webhooks</Typography>
                </Typography>
              </Button>
            </li>
          )}
          {!fromShopifyApp && (
            <li>
              <Button color="primary" component={Link} to="/workflows">
                <Avatar
                  className={classNames(classes.avatar, classes.pinkAvatar)}
                >
                  <Healing />
                </Avatar>
                <Typography variant="h6">
                  <span className={classes.pinkText}>
                    {flows.getIn(['pagination', 'total'])}
                  </span>
                  <Typography>Workflows</Typography>
                </Typography>
              </Button>
            </li>
          )}
          <li>
            <Button color="primary" component={Link} to="/tasks">
              <Avatar
                className={classNames(classes.avatar, classes.purpleAvatar)}
              >
                <TasksIcon />
              </Avatar>
              <Typography variant="h6">
                <span className={classes.purpleText}>
                  {tasks.getIn(['pagination', 'total'])}
                </span>
                <Typography>Tasks</Typography>
              </Typography>
            </Button>
          </li>
        </ul>
      </Paper>
    );
  }
}

PerformanceChartWidget.propTypes = {
  classes: PropTypes.object.isRequired,
  orders: PropTypes.object.isRequired,
  webhooks: PropTypes.object.isRequired,
  flows: PropTypes.object.isRequired,
  tasks: PropTypes.object.isRequired,
  products: PropTypes.object.isRequired,
  fromShopifyApp: PropTypes.bool.isRequired
};

export default withStyles(styles)(PerformanceChartWidget);
