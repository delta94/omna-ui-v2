import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import get from 'lodash/get';
import moment from 'moment';
import Ionicon from 'react-ionicons';
import Tooltip from '@material-ui/core/Tooltip';
// material-ui
// core
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
// our
import API from '../Utils/api';
import LoadingState from '../Common/LoadingState';
import GenericErrorMessage from '../Common/GenericErrorMessage';
import './orderDetails.css';
import Utils from '../Common/Utils';
import OrderPayment from './detail/OrderPayment';
import OrderCustomer from './detail/OrderCustomer';
import OrderIntegration from './detail/OrderIntegration';
import OrderItems from './detail/OrderItems';

const variantIcon = Utils.iconVariants();

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  subRoot: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    overflowX: 'auto'
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  },
  marginLeft2u: {
    marginLeft: theme.spacing.unit * 2
  },
  marginLeft: {
    marginLeft: theme.spacing.unit
  },
  marginRight: {
    marginRight: theme.spacing.unit
  },
  orderDetailContainer: {
    display: 'flex',
    flexDirection: 'column'
  }
});

class OrderDetails extends Component {
  state = {
    loading: true,
    order: {},
    success: true,
    messageError: ''
  };

  componentDidMount() {
    const storeId = get(this.props, 'match.params.store_id', null);
    const number = get(this.props, 'match.params.number', null);

    const order = get(this.props, 'location.state.order', null);
    if (
      order !== null &&
      storeId === get(order, 'data.integration.id', null) &&
      number === get(order, 'data.number', null)
    ) {
      this.setState({ order, loading: false });
    } else {
      this.callAPI(storeId, number);
    }
  }

  getOrder = params => {
    API.get(`/integrations/${params.store_id}/orders/${params.number}`)
      .then(response => {
        this.setState({ order: get(response, 'data', {}) });
      })
      .catch(error => {
        // handle error
        console.log(error);
        this.setState({ success: false, messageError: error.message });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  callAPI = (StoreId, number) => {
    const params = {
      store_id: StoreId,
      number
    };

    this.getOrder(params);
  };

  onClickGetAPIorder = (StoreId, number) => () => {
    this.callAPI(StoreId, number);
  };

  render() {
    const { classes } = this.props;
    const { order, loading, success, messageError } = this.state;
    console.log(order);

    return (
      <div>
        <div className="item-padding">
          {loading ? <LoadingState loading={loading} /> : null}
          {loading ? null : !success ? (
            <GenericErrorMessage messageError={messageError} />
          ) : (
            <div>
              <Paper>
                <div className="display-flex justify-content-space-between">
                  <Button
                    variant="text"
                    size="small"
                    color="primary"
                    component={Link}
                    to="/app/orders-list"
                  >
                    <Ionicon
                      icon={variantIcon.arrowBack}
                      className={classNames(
                        classes.leftIcon,
                        classes.iconSmall
                      )}
                    />
                    Orders
                  </Button>
                  <Tooltip title="Reload information">
                    <Button
                      onClick={this.onClickGetAPIorder(
                        get(order, 'data.integration.id', null),
                        get(order, 'data.number', null)
                      )}
                    >
                      <Ionicon icon={variantIcon.refresh} />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Print order">
                    <Button size="small">
                      <Ionicon icon={variantIcon.print} />
                    </Button>
                  </Tooltip>
                </div>
                {
                  // ********* SUB-HEAD *********
                }
                <div className="display-flex align-items-baseline">
                  <Typography
                    variant="h6"
                    color="primary"
                    gutterBottom
                    className={classes.marginLeft2u}
                  >
                    <strong>{get(order, 'data.order_id', null)}</strong>
                  </Typography>
                  <Typography
                    variant="caption"
                    gutterBottom
                    className={classes.marginLeft}
                  >
                    <strong>
                      {get(order, 'data.updated_date', null) != null
                        ? moment(order.data.updated_date).format(
                            'Y-MM-DD H:mm:ss'
                          )
                        : '--'}
                    </strong>
                  </Typography>
                </div>
              </Paper>
              <div className="orderDetailContainer">
                <div className="display-flex" style={{ flexFlow: 'row wrap' }}>
                  <div className="orderDetailContainer">
                    <OrderIntegration
                      classes={classes}
                      integration={get(order, 'data.integration', null)}
                    />
                    <OrderPayment
                      classes={classes}
                      totalPrice={get(order, 'data.total_price', null)}
                      status={get(order, 'data.status', null)}
                    />
                  </div>
                  <OrderCustomer
                    classes={classes}
                    customerFirstName={get(
                      order,
                      'data.customer.first_name',
                      null
                    )}
                    shipAddress={order.data.ship_address}
                    billAddress={order.data.bill_address}
                  />
                </div>
                <div>
                  <OrderItems classes={classes} order={order} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

OrderDetails.propTypes = {
  classes: PropTypes.shape({}).isRequired
};

export default withStyles(styles)(OrderDetails);
