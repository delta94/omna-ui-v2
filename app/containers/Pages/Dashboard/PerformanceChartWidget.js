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
import LocalActivity from '@material-ui/icons/LocalActivity';
import Typography from '@material-ui/core/Typography';
import styles from './widget-jss';

class PerformanceChartWidget extends PureComponent {
  render() {
    const { classes, integrations, orders, products, tasks } = this.props;

    return (
      <Paper style={{ padding: '8px 16px', marginBottom: 16 }}>
        <ul className={classes.bigResume} style={{ margin: 0 }}>
          <li>
            <Button color="primary" component={Link} to="/app/orders">
              <Avatar
                className={classNames(classes.avatar, classes.blueAvatar)}
                onClick={this.handleClick}
              >
                <Dvr />
              </Avatar>
              <Typography variant="h6">
                <span className={classes.blueText}>
                  {orders.pagination.total}
                </span>
                <Typography>Orders</Typography>
              </Typography>
            </Button>
          </li>
          <li>
            <Button color="primary" component={Link} to="/app/products">
              <Avatar
                className={classNames(classes.avatar, classes.tealAvatar)}
              >
                <CheckCircle />
              </Avatar>
              <Typography variant="h6">
                <span className={classes.tealText}>
                  {products.pagination.total}
                </span>
                <Typography>Products</Typography>
              </Typography>
            </Button>
          </li>
          <li>
            <Button color="primary" component={Link} to="/app/integrations">
              <Avatar
                className={classNames(classes.avatar, classes.pinkAvatar)}
              >
                <Healing />
              </Avatar>
              <Typography variant="h6">
                <span className={classes.pinkText}>
                  {integrations.pagination.total}
                </span>
                <Typography>Integrations</Typography>
              </Typography>
            </Button>
          </li>
          <li>
            <Button color="primary" component={Link} to="/app/tasks">
              <Avatar
                className={classNames(classes.avatar, classes.purpleAvatar)}
              >
                <LocalActivity />
              </Avatar>
              <Typography variant="h6">
                <span className={classes.purpleText}>
                  {tasks.pagination.total}
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
  orders: PropTypes.object,
  products: PropTypes.object,
  integrations: PropTypes.object,
  tasks: PropTypes.object
};

export default withStyles(styles)(PerformanceChartWidget);
