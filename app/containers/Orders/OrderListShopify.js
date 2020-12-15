import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import MUIDataTable from 'mui-datatables';
import CheckIcon from '@material-ui/icons/Check';
import { Loading, EmptyState } from 'dan-components';
import { getCurrencySymbol, delay, getOrderStatusOptions } from 'dan-containers/Common/Utils';
import AutoSuggestion from 'dan-components/AutoSuggestion';
import {
  getOrders,
  updateFilters,
  changePage,
  changeRowsPerPage,
  changeSearchTerm
} from 'dan-actions/orderActions';
import reExportOrder from 'dan-api/services/orders';
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
    serverSideFilterList: [],
    filtering: false,
    columnSortDirection: ['none', 'none', 'none', 'none', 'none', 'none', 'none'],
    sortCriteria: '',
    loadingShopify: true
  };

  componentDidMount() {
    this.makeQuery();
  }

  componentDidUpdate(prevProps) {
    const { params } = this.props;
    if (params && params !== prevProps.params) {
      this.makeQuery();
    }
  }

  makeQuery = () => {
    const {
      enqueueSnackbar,
      error,
      onGetOrders,
      params
    } = this.props;

    onGetOrders(params.toJS());

    if (error) {
      enqueueSnackbar(error, {
        variant: 'error'
      });
    }
  };

  handleDetailsViewClick = order => {
    const { history } = this.props;
    history.push(`/shopify-orders/${get(order, 'id', 0)}`, {
      order
    });
  };

  handleChangePage = (page) => {
    const { onChangePage } = this.props;
    onChangePage(page);
  };

  handleChangeRowsPerPage = rowsPerPage => {
    const { onChangeRowsPerPage } = this.props;
    onChangeRowsPerPage(rowsPerPage);
  };

  handleSearch = searchTerm => {
    const { params, onChangeSearchTerm } = this.props;
    if (searchTerm) {
      delay(() => onChangeSearchTerm(searchTerm));
    } else if (params.get('term')) {
      onChangeSearchTerm('');
    }
  };

  onHandleCloseSearch = () => {
    const { onChangeSearchTerm } = this.props;
    onChangeSearchTerm('');
  };

  handleResetFilters = () => {
    this.setState({ statusFilter: null });
  };

  handleFilterSubmit = () => {
    const { statusFilter } = this.state;
    const { onUpdateFilters } = this.props;
    const objectFilters = {};
    statusFilter ? objectFilters.statusFilter = [statusFilter] : null;
    onUpdateFilters(objectFilters);
  };

  handleReExportOrder = async (number, id) => {

    const { store, enqueueSnackbar } = this.props;

    const data = reExportOrder({ id, number, store, enqueueSnackbar });

    this.setState({ loadingShopify: true });
    if (data) {
      this.makeQuery();
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
        sortCriteria: column
      },
      this.makeQuery()
    );
  };

  handleStatusChange = (e, value) => {
    this.setState({ statusFilter: value });
  };

  render() {
    const { loadingShopify } = this.state;
    const { classes, history, orders, loading, params, filters, onUpdateFilters } = this.props;
    const {
      columnSortDirection,
      filtering,
      serverSideFilterList,
      sortCriteria
    } = this.state;
    const { data: orderList, pagination } = orders.toJS();
    const { total: count } = pagination;
    const page = params.get('offset') / params.get('limit');

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
          filterType: 'custom',
          filterList: filters.getIn(['statusFilter']),
          customFilterListOptions: {
            render: v => v[0].name
          },
          filterOptions: {
            display: () => {
              const { statusFilter } = this.state;
              return (
                <AutoSuggestion
                  id="status"
                  label="Status"
                  className={classes.select}
                  options={getOrderStatusOptions()}
                  onChange={(e, value) => this.handleStatusChange(e, value)}
                  value={statusFilter}
                />
              );
            }
          },
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
      searchText: params.get('term'),
      serverSideFilterList,
      searchPlaceholder: 'Search by number or status',
      rowsPerPage: params.get('limit'),
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
      onCellClick: (rowData, { colIndex, dataIndex }) => {
        if (colIndex !== 5) {
          const order = orderList[dataIndex];
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
      }),
      customFilterDialogFooter: () => (
        <div style={{ padding: '16px' }}>
          <Button variant="contained" onClick={this.handleFilterSubmit}>Apply Filters</Button>
        </div>
      ),
      onFilterChipClose: (index) => {
        const fltrs = filters.toJS();
        switch (index) {
          case 2:
            fltrs.statusFilter = null;
            break;
          default:
            break;
        }
        onUpdateFilters(fltrs);
      }
    };

    return (
      <div>
        <PageHeader title="Shopify Orders" history={history} />
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
  params: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  onUpdateFilters: PropTypes.func.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  onChangeSearchTerm: PropTypes.func.isRequired,
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
  params: state.getIn(['order', 'params']),
  filters: state.getIn(['order', 'filters']),
  error: state.getIn(['order', 'error']),
  store: state.getIn(['user', 'tenantName'])
});

const mapDispatchToProps = dispatch => ({
  onGetOrders: params => dispatch(getOrders(params)),
  onUpdateFilters: bindActionCreators(updateFilters, dispatch),
  onChangePage: bindActionCreators(changePage, dispatch),
  onChangeRowsPerPage: bindActionCreators(changeRowsPerPage, dispatch),
  onChangeSearchTerm: bindActionCreators(changeSearchTerm, dispatch),
});

const OrderShopifyListMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderShopifyList);

export default withSnackbar(withStyles(styles)(OrderShopifyListMapped));
