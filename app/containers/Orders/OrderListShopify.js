import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import moment from 'moment';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MUIDataTable from 'mui-datatables';
import CheckIcon from '@material-ui/icons/Check';
import { Loading, EmptyState } from 'dan-components';
import { getOrders } from 'dan-actions/orderActions';
import reExportOrder from 'dan-api/services/orders';
import { getCurrencySymbol } from '../Common/Utils';
import PageHeader from '../Common/PageHeader';

const styles = theme => ({
  table: {
    '& > div': {
      overflow: 'auto'
    },
    '& table': {
      minWidth: 300,
      [theme.breakpoints.down('md')]: {
        '& td': {
          height: 40
        }
      },
      '& tr': {
        cursor: 'pointer'
      }
    }
  }
});

class OrderShopifyList extends Component {
  state = {
    limit: 10,
    page: 0,
    serverSideFilterList: [],
    searchTerm: '',
    filtering: false,
    columnSortDirection: ['none', 'none', 'none', 'none', 'none', 'none', 'none'],
    sortCriteria: '',
    sortDirection: '',
    loadingShopify: true
  };

  componentDidMount() {
    this.callAPI();
  }

  callAPI = () => {
    const {
      enqueueSnackbar,
      error,
      onGetOrders,
      store
    } = this.props;
    const {
      searchTerm,
      limit,
      page,
      sortCriteria,
      sortDirection,
      serverSideFilterList
    } = this.state;

    let integrationId = store.replace('-', '_');
    integrationId = integrationId.replace('.myshopify.com', '');

    const statusFilter = serverSideFilterList[2] ? serverSideFilterList[2][0] : '';
    const params = {
      offset: page * limit,
      limit,
      term: searchTerm || '',
      integration_id: integrationId,
      status: statusFilter || ''
    };

    if (sortCriteria && sortDirection) {
      const sortParam = `{"${sortCriteria}":"${sortDirection.toUpperCase()}"}`;
      params.sort = JSON.parse(sortParam);
    }
    onGetOrders(params);

    if (error) {
      enqueueSnackbar(error, {
        variant: 'error'
      });
    }
    this.setState({ loadingShopify: false });
  };

  handleChangePage = (page, searchTerm) => {
    this.setState({ page, searchTerm }, this.callAPI);
  };

  handleChangeRowsPerPage = rowsPerPage => {
    this.setState({ limit: rowsPerPage }, this.callAPI);
  };

  handleDetailsViewClick = order => {
    const { history } = this.props;
    history.push(`/orders/${get(order, 'id', 0)}`, {
      order
    });
  };

  handleSearch = searchTerm => {
    if (searchTerm) {
      const timer = setTimeout(() => {
        this.setState({ searchTerm }, this.callAPI);
        clearTimeout(timer);
      }, 800);
      window.addEventListener('keydown', () => {
        clearTimeout(timer);
      });
    } else {
      const { searchTerm: _searchTerm } = this.state;
      if (_searchTerm) {
        this.setState({ searchTerm: '' }, this.callAPI);
      }
    }
  };

  onHandleCloseSearch = () => {
    this.setState({ searchTerm: '' }, this.callAPI);
  };

  handleFilterChange = filterList => {

    if (filterList) {
      this.setState(
        { filtering: true, serverSideFilterList: filterList },
        this.callAPI
      );
    } else {
      this.setState(
        { filtering: true, serverSideFilterList: [] },
        this.callAPI
      );
    }
  };

  handleResetFilters = () => {
    const { serverSideFilterList } = this.state;
    this.setState({ filtering: true });

    if (serverSideFilterList.length > 0) {
      this.setState({ serverSideFilterList: [] }, this.callAPI);
    }
  };

  handleReExportOrder = async (number, id) => {

    const { store, enqueueSnackbar } = this.props;

    const data = reExportOrder({ id, number, store, enqueueSnackbar });

    this.setState({ loadingShopify: true });
    if (data) {
      this.callAPI();
    }

  };

  sort = (column, order) => {
    const newColumnSortDirections = [
      'none',
      'none',
      'none',
      'none',
      'none',
      'none',
      'none'
    ];

    switch (column) {
      case 'number':
        newColumnSortDirections[0] = order;
        break;
      case 'created_date':
        newColumnSortDirections[1] = order;
        break;
      case 'status':
        newColumnSortDirections[2] = order;
        break;
      case 'total_price':
        newColumnSortDirections[4] = order;
        break;
      case 'integration':
        newColumnSortDirections[5] = order;
        break;
      case 'actions':
        newColumnSortDirections[6] = order;
        break;
      default:
        break;
    }

    newColumnSortDirections[column.index] = order;

    this.setState(
      {
        columnSortDirection: newColumnSortDirections,
        sortCriteria: column,
        sortDirection: order
      },
      this.callAPI
    );
  };

  render() {
    const { loadingShopify } = this.state;
    const { classes, history, orders, loading } = this.props;
    const {
      columnSortDirection,
      filtering,
      limit,
      page,
      serverSideFilterList,
      searchTerm,
      sortCriteria
    } = this.state;
    const { data: orderList, pagination } = orders.toJS();
    const { total: count } = pagination;

    const columns = [
      {
        name: 'number',
        label: 'Order',
        options: {
          sortDirection: columnSortDirection[0],
          filter: false,
          color: 'secondary'
        }
      },
      {
        name: 'created_date',
        label: 'Created at',
        options: {
          sortDirection: columnSortDirection[1],
          filter: false,
          customBodyRender: value => (
            <div>{moment(value).format('DD-MM-YYYY HH:mm')}</div>
          )
        }
      },
      {
        name: 'status',
        label: 'Status',
        options: {
          sortDirection: columnSortDirection[2],
          filter: true,
          customBodyRender: value => <div>{value.toUpperCase()}</div>
        }
      },
      {
        name: 'currency',
        options: {
          filter: false,
          display: 'excluded'
        }
      },
      {
        name: 'total_price',
        label: 'Total',
        options: {
          sortDirection: columnSortDirection[4],
          filter: false,
          customBodyRender: (value, tableMeta) => {
            const currency = tableMeta.rowData[3];

            return (
              <div>
                {`${getCurrencySymbol(currency)}
                  ${parseFloat(value).toFixed(2)} ${currency}`}
              </div>
            );
          }
        }
      },
      {
        name: 'actions',
        label: 'Actions',
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => {
            const status = tableMeta.rowData[2];
            const number = tableMeta.rowData[0];
            const id = tableMeta.rowData[6];
            if (status === 'fulfilled' || status === 'unfulfilled' || status === 'IN_PROGRESS') {
              return (
                <CheckIcon />
              );
            }
            return(
              <Button variant="contained" color="primary" className={classes.button} onClick={() => this.handleReExportOrder(number, id)}>
                    Re-export
              </Button>
            );

          }
        }
      },
      {
        name: 'id',
        options: {
          filter: false,
          display: 'excluded'
        }
      }
    ];

    const options = {
      filter: true,
      selectableRows: 'none',
      responsive: 'stacked',
      download: false,
      print: false,
      serverSide: true,
      searchText: searchTerm,
      serverSideFilterList,
      searchPlaceholder: 'Search by number or status',
      rowsPerPage: limit,
      count,
      page,
      onTableChange: (action, tableState) => {
        switch (action) {
          case 'changePage':
            this.handleChangePage(tableState.page);
            break;
          case 'changeRowsPerPage':
            this.handleChangeRowsPerPage(tableState.rowsPerPage);
            break;
          case 'search':
            this.handleSearch(tableState.searchText);
            break;
          case 'filterChange':
            this.handleFilterChange(tableState.filterList);
            break;
          case 'resetFilters':
            this.handleResetFilters();
            break;
          default:
            break;
        }
      },
      onCellClick: (rowData, { colIndex }) => {
        if (colIndex !== 5) {
          const order = orderList[colIndex];
          this.handleDetailsViewClick(order);
        }
      },

      onColumnSortChange: (changedColumn, direction) => {
        let order = 'desc';
        if (direction === 'ascending') {
          order = 'asc';
        }

        this.sort(changedColumn, order);
      },
      customSort: (data, colIndex, order) => data.sort((a, b) => {
        switch (colIndex) {
          case 4:
            return (
              (parseFloat(a.data[colIndex]) < parseFloat(b.data[colIndex])
                ? -1
                : 1) * (order === 'desc' ? 1 : -1)
            );
          case 5:
            return (
              (a.data[colIndex].name.toLowerCase()
                < b.data[colIndex].name.toLowerCase()
                ? -1
                : 1) * (order === 'desc' ? 1 : -1)
            );
          default:
            return 0;
        }
      })
    };

    return (
      <div>
        <PageHeader title="Shopify Order List" history={history} />
        <div className={classes.table}>
          {loadingShopify && <Loading />}
          {loading && !sortCriteria ? (
            <Loading fullPage={!filtering} />
          ) : count > 0 || filtering ? (
            <div>
              {sortCriteria && loading && <Loading />}
              <MUIDataTable
                columns={columns}
                data={orderList}
                options={options}
              />
            </div>
          ) : (
            <EmptyState text="There's nothing here now, but orders data will show up here later." />
          )}
        </div>
      </div>
    );
  }
}

OrderShopifyList.propTypes = {
  orders: PropTypes.object.isRequired,
  store: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  onGetOrders: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired,
  classes: PropTypes.shape({}).isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

const mapStateToProps = state => ({
  orders: state.getIn(['order', 'orders']),
  loading: state.getIn(['order', 'loading']),
  error: state.getIn(['order', 'error']),
  store: state.getIn(['user', 'tenantName'])
});

const mapDispatchToProps = dispatch => ({
  onGetOrders: params => dispatch(getOrders(params))
});

const OrderShopifyListMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderShopifyList);

export default withSnackbar(withStyles(styles)(OrderShopifyListMapped));
