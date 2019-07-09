import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Paper from '@material-ui/core/Paper';
import classNames from 'classnames';
import Ionicon from 'react-ionicons';
import moment from 'moment';

/* material-ui */
// core
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Button from '@material-ui/core/Button';
// our
import API from '../Utils/api';
import LoadingState from '../Common/LoadingState';
import GenericTablePagination from '../Common/GenericTablePagination';
import GenericTableHead from '../Common/GenericTableHead';
import GenericErrorMessage from '../Common/GenericErrorMessage';
import GenericTableToolBar from '../Common/GenericTableToolBar';

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

const actionList = ['Filter'];
const filterList = ['Integration'];

const headColumns = [
  {
    id: 'number', first: true, last: false, label: 'Number'
  },
  {
    id: 'date', first: false, last: false, label: 'Date'
  },
  {
    id: 'status', first: false, last: false, label: 'Status'
  },
  {
    id: 'total', first: false, last: false, label: 'Total'
  },
  {
    id: 'store', first: false, last: false, label: 'Integration'
  },
  {
    id: 'action', first: false, last: false, label: 'Action'
  },
];

const styles = () => ({
  table: {
    minWidth: 700,
  },
});

/* ======= Principal Class ======= */
class OrderList extends React.Component {
  state = {
    loading: true,
    orders: { data: [], pagination: {} },
    limit: 5,
    page: 0,
    success: true,
    messageError: '',
    selectedRow: -1,
  };

  componentDidMount() {
    this.callAPI();
  }

  getAPIorders(params) {
    API.get('/orders', { params }).then(response => {
      this.setState({ orders: get(response, 'data', { data: [], pagination: {} }), limit: get(response, 'data.pagination.limit', 0) });
    }).catch((error) => {
      // handle error
      console.log(error);
      this.setState({ success: false, messageError: error.message });
    }).finally(() => {
      this.setState({ loading: false });
    });
  }

  callAPI = () => {
    const { limit, page } = this.state;
    const params = {
      offset: page * limit,
      limit
    };

    this.getAPIorders(params);
  };

  handleChangePage = (event, page) => {
    this.setState({ page }, this.callAPI);
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ limit: parseInt(event.target.value, 10) }, this.callAPI);
  };

  handleDetailsViewClick = (order) => () => {
    const { history } = this.props;
    history.push(`/app/orders-list/${get(order, 'integration.id', 0)}/${get(order, 'number', 0)}/order-details`, { order: { data: order } });
  }

  handleSearchClick = (currentTerm, filters) => {
    const { limit, page } = this.state;
    const params = {
      offset: page * limit,
      limit,
      term: currentTerm,
      integration_id: filters.Integration,
    };

    this.setState({ loading: true });
    this.getAPIorders(params);
  };

  render() {
    const { classes } = this.props;
    const { pagination, data } = get(this.state, 'orders', { data: [], pagination: {} });
    const {
      loading, limit, page, success, messageError
    } = this.state;

    const count = get(pagination, 'total', 0);

    return (
      <Paper>
        <div className="item-padding">
          {loading ? <LoadingState loading={loading} /> : null}
          {loading ? null : !success ? (
            <GenericErrorMessage messageError={messageError} />
          ) : (
            <Fragment>
              <div className={classes.rootTable}>
                <GenericTableToolBar
                  rowCount={count > limit ? limit : count}
                  actionList={actionList}
                  onSearchFilterClick={this.handleSearchClick}
                  filterList={filterList}
                />
                <Table className={classNames(classes.table, classes.hover)}>
                  <GenericTableHead
                    rowCount={count > limit ? limit : count}
                    headColumns={headColumns}
                  />
                  <TableBody>
                    {data && data.map(row => (
                      <TableRow
                        hover
                        key={get(row, 'order_id', 0)}
                      >
                        <TableCell align="left" component="th" scope="row">
                          {get(row, 'number', 0)}
                        </TableCell>
                        <TableCell align="center">
                          {
                            get(row, 'created_date', null) != null
                              ? (moment(row.updated_at).format('Y-MM-DD H:mm:ss')
                              ) : (
                                '--'
                              )
                          }
                        </TableCell>
                        <TableCell align="center">{get(row, 'status', null)}</TableCell>
                        <TableCell align="center">{get(row, 'total_price', null)}</TableCell>
                        <TableCell align="center">{get(row, 'integration.name', null)}</TableCell>
                        <TableCell align="center">
                          <Button variant="text" size="small" color="primary" onClick={this.handleDetailsViewClick(row)} className={classes.button}>
                            <Ionicon icon={variantIcon.view} className={classes.rightIcon} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        colSpan={5}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        count={count}
                        rowsPerPage={limit}
                        page={page}
                        SelectProps={{
                          native: true,
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        ActionsComponent={GenericTablePagination}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </Fragment>
          )
          }
        </div>
      </Paper>
    );
  }
}
OrderList.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default withStyles(styles)(OrderList);
