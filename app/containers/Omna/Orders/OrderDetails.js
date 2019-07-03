import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import get from 'lodash/get';
import moment from 'moment';
import Ionicon from 'react-ionicons';

// material-ui
// core
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
// our
import API from '../Utils/api';
import LoadingState from '../Common/LoadingState';
import GenericErrorMessage from '../Common/GenericErrorMessage';
import './orderDetails.css';

const variantIcon = {
  success: 'md-checkmark-circle',
  warning: 'md-warning',
  error: 'md-alert',
  info: 'ios-information-circle',
  delete: 'md-trash',
  add: 'md-add-circle',
  schedule: 'md-time',
  refresh: 'md-refresh',
  arrowBack: 'md-arrow-back',
  play: 'md-play',
  filter: 'md-funnel',
  print: 'md-print',
  view: 'md-eye',
};

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
});

class OrderDetails extends Component {
  state = {
    loading: true,
    order: { data: {} },
    success: true,
    messageError: '',
  };

  componentDidMount() {
    const storeId = get(this.props, 'match.params.store_id', null);
    const number = get(this.props, 'match.params.number', null);

    const order = get(this.props, 'location.state.order', null);
    if (order !== null && storeId === get(order, 'data.integration.id', null) && number === get(order, 'data.number', null)) {
      this.setState({ order, loading: false });
    } else {
      this.callAPI(storeId, number);
    }
  }

  getAPIorders(params) {
    API.get(`/integrations/${params.store_id}/orders/${params.number}`)
      .then(response => {
        this.setState({ order: get(response, 'data', { data: {} }) });
      })
      .catch(error => {
        // handle error
        console.log(error);
        this.setState({ success: false, messageError: error.message });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  callAPI = (StoreId, number) => {
    const params = {
      store_id: StoreId,
      number
    };

    this.getAPIorders(params);
  };

  render() {
    const { classes } = this.props;
    const {
      order, loading, success, messageError
    } = this.state;

    return (
      <Paper>
        <div className="item-padding">
          {loading ? <LoadingState loading={loading} /> : null}
          {loading ? null : !success ? (
            <GenericErrorMessage messageError={messageError} />
          ) : (
            <Paper className={classes.root}>
              {
                // ******** BUTTONS *********
              }
              <div className="display-flex justify-content-space-between">
                <Button variant="text" size="small" color="primary" component={Link} to="/app/orders">
                  <Ionicon icon={variantIcon.arrowBack} className={classNames(classes.leftIcon, classes.iconSmall)} />
                  Orders
                </Button>
                <Button variant="text" size="small" color="primary">
                  <Ionicon icon={variantIcon.print} className={classNames(classes.leftIcon, classes.iconSmall)} />
                  Print Order
                </Button>
              </div>
              {
                // ********* SUB-HEAD *********
              }
              <div className="display-flex align-items-baseline">
                <Typography variant="h6" color="primary" gutterBottom className={classes.marginLeft2u}>
                  <strong>{get(order, 'data.order_id', null)}</strong>
                </Typography>
                <Typography variant="caption" gutterBottom className={classes.marginLeft}>
                  <strong>
                    {
                      get(order, 'data.updated_date', null) != null
                        ? (moment(order.data.updated_date).format('Y-MM-DD H:mm:ss')
                        ) : (
                          '--'
                        )
                    }
                  </strong>
                </Typography>
              </div>
              <Divider />

              {
                // ********* SUB-BODY *********
              }
              <div className="display-flex justify-content-space-between flex-wrap-wrap">
                <div className="orderItem">
                  {
                    // ********* STORE, ITEMS, PYMENT *********
                  }
                  <div>
                    {
                      // ********* STORE *********
                    }
                    <Paper className={classNames(classes.subRoot, classes.marginLeft)}>
                      <div className="display-flex justify-content-space-between">
                        <Typography variant="subtitle1" className={classes.marginLeft}>
                          <strong>Integration</strong>
                          {' '}
                        </Typography>
                        <Typography variant="caption" className={classes.marginRight}>
                          {get(order, 'data.payment_method', null)}
                        </Typography>
                      </div>
                      <div>
                        <Typography variant="caption" className={classes.marginLeft2u}>
                          <strong>ID:</strong>
                          {' '}
                          {get(order, 'data.integration.id', null)}
                          <br />
                          <strong>Name:</strong>
                          {' '}
                          {get(order, 'data.integration.name', null)}
                          <br />
                          <strong>Channel:</strong>
                          {' '}
                          {get(order, 'data.integration.channel', null)}
                          <br />
                          <strong>Authorized:</strong>
                          {' '}
                          {get(order, 'data.integration.authorized', '').toString()}
                          <br />
                          <strong>Last Import Orders Date:</strong>
                          {' '}
                          {
                            get(order, 'data.integration.last_import_orders_date', null) != null
                              ? (moment(order.data.integration.last_import_orders_date).format('Y-MM-DD H:mm:ss')
                              ) : (
                                '--'
                              )
                          }
                          <br />
                          <strong>Created at:</strong>
                          {' '}
                          {
                            get(order, 'data.integration.created_at', null) != null
                              ? (moment(order.data.integration.created_at).format('Y-MM-DD H:mm:ss')
                              ) : (
                                '--'
                              )
                          }
                          ,
                          <br />
                          <strong>Updated at:</strong>
                          {' '}
                          {
                            get(order, 'data.integration.updated_at', null) != null
                              ? (moment(order.data.integration.updated_at).format('Y-MM-DD H:mm:ss')
                              ) : (
                                '--'
                              )
                          }
                        </Typography>
                      </div>
                    </Paper>
                  </div>
                  <div>
                    {
                      // ********* ITEMS *********
                    }
                    <Paper className={classNames(classes.subRoot, classes.marginLeft)}>
                      <Typography variant="subtitle1" className={classes.marginLeft}>
                        <strong>Items</strong>
                      </Typography>
                      <div>
                        {order && order.data && order.data.line_items
                          ? (order.data.line_items.map(row => (
                            <div key={get(row, 'id', 0)}>
                              <div className="display-flex justify-content-space-between">
                                <div className={classes.marginLeft2u}>
                                  <Typography variant="caption">
                                    {row.id}
                                  </Typography>
                                </div>
                                <div>
                                  <Typography variant="caption" color="primary">
                                    <strong>Name:</strong>
                                    {' '}
                                    {get(row, 'name', null)}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="secondary"
                                  >
                                    <strong>SKU:</strong>
                                    {' '}
                                    {get(row, 'sku', null)}
                                  </Typography>
                                </div>
                                <div>
                                  <Typography
                                    variant="caption"
                                    color="inherit"
                                  >
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
                          ) : (
                            null
                          )
                        }
                      </div>
                    </Paper>
                  </div>
                  <div>
                    {
                      // ********* PYMENT *********
                    }
                    <Paper className={classNames(classes.subRoot, classes.marginLeft)}>
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
                            {get(order, 'data.total_price', null)}
                          </Typography>
                        </div>
                        <div className={classes.marginRight}>
                          <Typography variant="caption">
                            {get(order, 'data.status', null)}
                          </Typography>
                        </div>
                      </div>
                    </Paper>
                  </div>
                </div>
                <div>
                  {
                    // ********* CUSTOMER *********
                  }
                  <Paper className={classNames(classes.subRoot, classes.marginLeft, classes.marginRight)}>
                    <Typography variant="subtitle1" className={classes.marginLeft}>
                      <strong>Customer</strong>
                      <br />
                    </Typography>
                    <Typography variant="caption" className={classes.marginLeft2u}>
                      {get(order, 'data.customer.firstname', null)}
                    </Typography>
                    <Divider variant="middle" />
                    <Typography variant="subtitle2" className={classNames(classes.marginLeft, classes.marginRight)}>
                      <strong>Shipping Address</strong>
                    </Typography>
                    <Typography variant="caption" className={classNames(classes.marginLeft2u, classes.marginRight)}>
                      <strong>Country:</strong>
                      {' '}
                      {get(order, 'data.ship_address.country', null)}
                      <br />
                      <strong>State:</strong>
                      {' '}
                      {get(order, 'data.ship_address.state', null)}
                      <br />
                      <strong>City:</strong>
                      {' '}
                      {get(order, 'data.ship_address.city', null)}
                      <br />
                      <strong>Phone:</strong>
                      {' '}
                      {get(order, 'data.ship_address.phone', null)}
                      <br />
                      <strong>ZIP Code:</strong>
                      {' '}
                      {get(order, 'data.ship_address.zip_code', null)}
                      <br />
                      <strong>Address:</strong>
                      {' '}
                      {get(order, 'data.ship_address.address', null)}
                    </Typography>
                    <Divider variant="middle" />
                    <Typography variant="subtitle2" className={classes.marginLeft}>
                      <strong>Billing Address</strong>
                    </Typography>
                    <Typography variant="caption" className={classNames(classes.marginLeft2u, classes.marginRight)}>
                      <strong>Country:</strong>
                      {' '}
                      {get(order, 'data.bill_address.country', null)}
                      <br />
                      <strong>State:</strong>
                      {' '}
                      {get(order, 'data.bill_address.state', null)}
                      <br />
                      <strong>City:</strong>
                      {' '}
                      {get(order, 'data.bill_address.city', null)}
                      <br />
                      <strong>Phone:</strong>
                      {' '}
                      {get(order, 'data.bill_address.phone', null)}
                      <br />
                      <strong>ZIP Code:</strong>
                      {' '}
                      {get(order, 'data.bill_address.zip_code', null)}
                      <br />
                      <strong>Address:</strong>
                      {' '}
                      {get(order, 'data.bill_address.address', null)}
                    </Typography>
                  </Paper>
                </div>
              </div>
            </Paper>
          )}
        </div>
      </Paper>
    );
  }
}

OrderDetails.propTypes = {
  classes: PropTypes.shape({}).isRequired,
};

export default withStyles(styles)(OrderDetails);
