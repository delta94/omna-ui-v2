import React, { Component } from 'react';
import API from './../Utils/api';
import LoadingState from './../Common/LoadingState';
import { Link } from "react-router-dom";
import get from 'lodash/get';
import {PapperBlock} from 'dan-components';

//material-ui
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import PrintIcon from '@material-ui/icons/Print';
import ArrowIcon from '@material-ui/icons/ArrowLeft';
import classNames from 'classnames';

import './orderDetails.css';


const styles = theme => ({
    root: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    subRoot: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
        overflowX: 'auto',
    },
    paper: {
        marginBottom: theme.spacing.unit * 2,
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    button: {
        margin: theme.spacing.unit,
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    },
    marginLeft2u: {
        marginLeft: theme.spacing.unit * 2,
    },
    marginLeft: {
        marginLeft: theme.spacing.unit,
    },
    marginRight: {
        marginRight: theme.spacing.unit,
    },
    marginRight2u: {
        marginRight: theme.spacing.unit * 2,
    },
});

class OrderDetails extends Component {

    state = {
        loading: true,
        orderDetails: {}
    };

    componentDidMount() {
        const store_id = this.props.match.params["store_id"];
        const number = this.props.match.params["number"];
        this.callAPI(store_id, number);
    };

    getAPIorders(params) {
        API.get(`/orders/${params.store_id}/${params.number}`).then(response => {
            this.setState({ orderDetails: response.data, loading: false });
        }).catch((error) => {
            // handle error
            console.log(error);
        }).then(() => {
            this.setState({ loading: false });
        });
    };

    callAPI = (store_id, number) => {
        const params = {
            store_id: store_id,
            number: number
        };

        this.getAPIorders(params);
    };

    render() {
        const { classes } = this.props;
        const { orderDetails, loading } = this.state;

        return (
            <div>
                {/********* HEAD *********/}
                <div>
                    <Typography variant="h4" gutterBottom>
                        Order Details
                    </Typography>
                </div>

                {
                    //********* BODY *********
                }
                <div>
                    {loading ? <LoadingState loading={loading} /> : null}
                    {loading ? null :
                        <Paper className={classes.root}>

                            {
                                //********* BUTTONS *********
                            }
                            <div className="display-flex justify-content-space-between">
                                <Button variant="text" size="small" color="primary" component={Link} to={"/orders"}>
                                    <ArrowIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                                    Orders
                            </Button>
                                <Button variant="text" size="small" color="primary">
                                    <PrintIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                                    Print Order
                            </Button>
                            </div>

                            {
                                //********* SUB-HEAD *********
                            }
                            <div className="display-flex align-items-baseline">
                                <Typography variant="h6" gutterBottom className={classes.marginLeft2u}>
                                    <strong>{get(orderDetails, "data.order_id", null)}</strong>
                                </Typography>
                                <Typography variant="caption" gutterBottom className={classes.marginLeft}>
                                    <strong>{get(orderDetails, "data.updated_date", null)}</strong>
                                </Typography>
                            </div>
                            <Divider />

                            {
                                //********* SUB-BODY *********
                            }
                            <div className="display-flex justify-content-space-between flex-wrap-wrap">
                                <div className="orderItem">
                                    {
                                        //********* STORE, ITEMS, PYMENT *********
                                    }
                                    <div>
                                        {
                                            //********* STORE *********
                                        }
                                        <Paper className={classNames(classes.subRoot, classes.marginLeft)}>
                                            <div className="display-flex justify-content-space-between">
                                                <Typography variant="subtitle1" className={classes.marginLeft}>
                                                    <strong>Store</strong>
                                                </Typography>
                                                <Typography variant="caption" className={classes.marginRight}>
                                                    {get(orderDetails, "data.payment_method", null)}
                                                </Typography>
                                            </div>
                                            <div>
                                                <Typography variant="caption" className={classes.marginLeft2u}>
                                                    <strong>ID:</strong> {get(orderDetails, "data.store.id", null)},<br />
                                                    <strong>Name:</strong> {get(orderDetails, "data.store.name", null)},<br />
                                                    <strong>Channel:</strong> {get(orderDetails, "data.store.channel", null)},<br />
                                                    <strong>Authorized:</strong> {get(orderDetails, "data.store.authorized", "").toString()},<br />
                                                    <strong>Last Import Orders Date:</strong> {get(orderDetails, "data.store.last_import_orders_date", null)},<br />
                                                    <strong>Created at:</strong> {get(orderDetails, "data.store.created_at", null)},<br />
                                                    <strong>Updated at:</strong> {get(orderDetails, "data.store.updated_at", null)}
                                                </Typography>
                                            </div>
                                        </Paper>
                                    </div>
                                    <div>
                                        {
                                            //********* ITEMS *********
                                        }
                                        <Paper className={classNames(classes.subRoot, classes.marginLeft)}>
                                            <Typography variant="subtitle1" className={classes.marginLeft}>
                                                <strong>Items</strong>
                                            </Typography>
                                            <div>
                                                {
                                                    orderDetails && orderDetails.data ? orderDetails.data.line_items.map(row => (
                                                        <div>
                                                            <div className="display-flex justify-content-space-between">
                                                                <div className={classes.marginLeft2u}>
                                                                    <Typography variant="caption">
                                                                        {row.id}
                                                                    </Typography>
                                                                </div>
                                                                <div>
                                                                    <Typography variant="caption" color="primary">
                                                                        <strong>Name:</strong> {row.name}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="secondary">
                                                                        <strong>SKU:</strong> {row.sku}
                                                                    </Typography>
                                                                </div>
                                                                <div>
                                                                    <Typography variant="caption" color="inherit">
                                                                        ${row.price} x {row.quantity}
                                                                    </Typography>
                                                                </div>
                                                                <div className={classes.marginRight}>
                                                                    <Typography variant="caption">
                                                                        ${row.price * row.quantity}
                                                                    </Typography>
                                                                </div>
                                                            </div>
                                                            <Divider />
                                                        </div>
                                                    )) : null
                                                }
                                            </div>
                                        </Paper>
                                    </div>
                                    <div>
                                        {
                                            //********* PYMENT *********
                                        }
                                        <Paper className={classNames(classes.subRoot, classes.marginLeft)}>
                                            <Typography variant="subtitle1" className={classes.marginLeft}>
                                                <strong>Payment</strong> <br />
                                            </Typography>
                                            <div className="display-flex justify-content-space-between">
                                                <div className={classes.marginLeft2u}>
                                                    <Typography variant="caption">
                                                        Amount
                                                </Typography>
                                                </div>
                                                <div>
                                                    <Typography variant="caption">
                                                        ${get(orderDetails, "data.total_price", null)}
                                                    </Typography>
                                                </div>
                                                <div className={classes.marginRight}>
                                                    <Typography variant="caption">
                                                        {get(orderDetails, "data.status", null)}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </Paper>
                                    </div>
                                </div>
                                <div>
                                    {
                                        //********* CUSTOMER *********
                                    }
                                    <Paper className={classNames(classes.subRoot, classes.marginLeft, classes.marginRight)}>
                                        <Typography variant="subtitle1" className={classes.marginLeft}>
                                            <strong>Customer</strong> <br />
                                        </Typography>
                                        <Typography variant="caption" className={classes.marginLeft2u}>
                                            {get(orderDetails, "data.customer.firstname", null)}
                                        </Typography>
                                        <Divider variant="middle" /> <br />
                                        <Typography variant="subtitle1" className={classNames(classes.marginLeft, classes.marginRight)}>
                                            <strong>Shipping Address</strong> <br />
                                        </Typography>
                                        <Typography variant="caption" className={classNames(classes.marginLeft2u, classes.marginRight)}>
                                            <strong>Country:</strong> {get(orderDetails, "data.ship_address.country", null)},<br />
                                            <strong>State:</strong> {get(orderDetails, "data.ship_address.state", null)},<br />
                                            <strong>City:</strong> {get(orderDetails, "data.ship_address.city", null)},<br />
                                            <strong>Phone:</strong> {get(orderDetails, "data.ship_address.phone", null)},<br />
                                            <strong>ZIP Code:</strong> {get(orderDetails, "data.ship_address.zip_code", null)},<br />
                                            <strong>Address:</strong> {get(orderDetails, "data.ship_address.address", null)}
                                        </Typography>
                                        <Divider variant="middle" /> <br />
                                        <Typography variant="subtitle1" className={classes.marginLeft}>
                                            <strong>Billing Address</strong> <br />
                                        </Typography>
                                        <Typography variant="caption" className={classNames(classes.marginLeft2u, classes.marginRight)}>
                                            <strong>Country:</strong> {get(orderDetails, "data.bill_address.country", null)},<br />
                                            <strong>State:</strong> {get(orderDetails, "data.bill_address.state", null)},<br />
                                            <strong>City:</strong> {get(orderDetails, "data.bill_address.city", null)},<br />
                                            <strong>Phone:</strong> {get(orderDetails, "data.bill_address.phone", null)},<br />
                                            <strong>ZIP Code:</strong> {get(orderDetails, "data.bill_address.zip_code", null)},<br />
                                            <strong>Address:</strong> {get(orderDetails, "data.bill_address.address", null)}
                                        </Typography>
                                    </Paper>
                                </div>
                            </div>
                        </Paper>
                    }
                </div>
            </div>
        );
    }

}

export default withStyles(styles)(OrderDetails);
