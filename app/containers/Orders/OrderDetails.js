import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import get from 'lodash/get';
import moment from 'moment';
import Ionicon from 'react-ionicons';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { getOrder } from 'dan-actions';
import api from '../Utils/api';
import LoadingState from '../Common/LoadingState';
import { variantIcon } from '../Common/Utils';
import OrderPayment from './detail/OrderPayment';
import OrderCustomer from './detail/OrderCustomer';
import OrderIntegration from './detail/OrderIntegration';
import OrderItems from './detail/OrderItems';
import DocumentTypesDialog from './DocumentTypesDialog';
import PageHeader from '../Common/PageHeader';
import styles from './order-details-jss';

class OrderDetails extends Component {
  state = {
    loading: true,
    orderFromState: null,
    // success: true,
    // messageError: '',
    openDialog: false,
    selectedDocumentType: {},
    documentTypes: []
  };

  async componentDidMount() {
    const { location, match } = this.props;

    const order = get(location, 'state.order', null);
    const id = get(match, 'params.id', null);

    if (order && id === get(order, 'data.id', null)) {
      this.setState({ orderFromState: order, loading: false });
    } else {
      const { onGetOrder } = this.props;
      await onGetOrder(id);
      this.setState({ loading: false });
    }
  }

  getOrderDocumentTypes = async params => {
    const { enqueueSnackbar } = this.props;
    const response = await api.get(
      `/integrations/${params.storeId}/orders/${params.number}/doc/types`
    );

    try {
      this.setState({ documentTypes: response.data.data });
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
  };

  onPrintHandler = () => {
    this.getOrderDocumentTypes();
    this.handleClickOpen();
  };

  handleClickOpen = () => {
    this.setState({ openDialog: true });
  };

  handleClose = value => {
    this.setState({ openDialog: false });
    this.setState({ selectedDocumentType: value });
  };

  render() {
    const { classes, history, order: orderFromProps } = this.props;
    const {
      orderFromState,
      loading,
      openDialog,
      selectedDocumentType,
      documentTypes
    } = this.state;

    const order = orderFromState || orderFromProps.toJS();

    const integrationId = get(order, 'data.integration.id', null);
    const dataNumber = get(order, 'data.number', null);

    return (
      <div>
        <PageHeader title="Order Details" history={history} />
        <div className="item-padding">
          {loading || !Object.keys(order).length ? (
            <LoadingState loading={loading} />
          ) : (
            <div>
              <Paper>
                <div className="display-flex justify-content-space-between">
                  <Button
                    variant="text"
                    size="small"
                    color="primary"
                    component={Link}
                    to="/orders"
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
                      onClick={() =>
                        this.onClickGetAPIorder(integrationId, dataNumber)
                      }
                    >
                      <Ionicon icon={variantIcon.refresh} />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Print order">
                    <Button
                      size="small"
                      onClick={() =>
                        this.onPrintHandler(integrationId, dataNumber)
                      }
                    >
                      <Ionicon icon={variantIcon.print} />
                    </Button>
                  </Tooltip>
                </div>
                <div className="display-flex align-items-baseline">
                  <Typography
                    variant="h6"
                    color="primary"
                    gutterBottom
                    className={classes.marginLeft2u}
                  >
                    <strong>{get(order, 'data.number', null)}</strong>
                  </Typography>
                  <Typography
                    variant="caption"
                    gutterBottom
                    className={classes.marginLeft}
                  >
                    <strong>
                      {get(order, 'data.updated_date', null) != null
                        ? moment(order.data.updated_date).format('Y-MM-DD H:mm')
                        : ''}
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

              <DocumentTypesDialog
                integrationId={integrationId}
                orderNumber={dataNumber}
                types={documentTypes}
                selectedValue={selectedDocumentType}
                open={openDialog}
                onClose={this.handleClose}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

OrderDetails.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  onGetOrder: PropTypes.func.isRequired,
  order: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  order: state.getIn(['order', 'order'])
});

const mapDispatchToProps = dispatch => ({
  onGetOrder: id => dispatch(getOrder(id))
});

const OrderDetailsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderDetails);

export default withSnackbar(withStyles(styles)(OrderDetailsMapped));
