import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withSnackbar } from 'notistack';
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import MUIDataTable from 'mui-datatables';
import { Loading } from 'dan-components';
import filterDlgSizeHelper from 'utils/mediaQueries';
import Button from '@material-ui/core/Button';
import {
  getOrders,
  updateFilters,
  changePage,
  changeRowsPerPage,
  changeSearchTerm
} from 'dan-actions/orderActions';
import AutoSuggestion from 'dan-components/AutoSuggestion';
import FiltersDlg from 'dan-components/Products/FiltersDlg';
import { getCurrencySymbol, delay, getOrderStatusOptions } from 'dan-containers/Common/Utils';

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
  },
  select: {
    margin: theme.spacing(1, 1, 1, 1)
  }
});

class OrderList extends Component {
  state = {
    integrationFilter: undefined,
    statusFilter: undefined,
    columnSortDirection: ['none', 'none', 'none', 'none', 'none', 'none'],
    /* filtering: false,
    sortCriteria: '',
    sortDirection: '', */
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

    /*     const params = {
          offset: page * limit,
          limit,
          term: searchTerm || '',
          integration_id: serverSideFilterList[5] ? serverSideFilterList[5][0] : ''
        };

        if (sortCriteria && sortDirection) {
          const sortParam = `{"${sortCriteria}":"${sortDirection.toUpperCase()}"}`;
          params.sort = JSON.parse(sortParam);
        } */

    onGetOrders(params.toJS());

    if (error) {
      enqueueSnackbar(error, {
        variant: 'error'
      });
    }
  };

  getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          cursor: 'pointer',
        }
      },
      MUIDataTableToolbar: {
        filterPaper: {
          width: filterDlgSizeHelper,
          minWidth: '300px'
        }
      },
      MuiGridListTile: {
        root: {
          width: filterDlgSizeHelper
        }
      }
    },
  });

  handleChangePage = (page) => {
    const { onChangePage } = this.props;
    onChangePage(page);
  };

  handleChangeRowsPerPage = rowsPerPage => {
    const { onChangeRowsPerPage } = this.props;
    onChangeRowsPerPage(rowsPerPage);
  };

  handleDetailsViewClick = order => {
    const { history } = this.props;
    history.push(`/orders/${get(order, 'id', 0)}`, {
      order
    });
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
    this.setState({ integrationFilter: null });
  };

  handleFilterSubmit = () => {
    const { integrationFilter, statusFilter } = this.state;
    const { onUpdateFilters } = this.props;
    const objectFilters = {};
    integrationFilter ? objectFilters.integrationFilter = [integrationFilter] : null;
    statusFilter ? objectFilters.statusFilter = [statusFilter] : null;
    onUpdateFilters(objectFilters);
  };

  /*  sort = (column, order) => {
    const newColumnSortDirections = [
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
      this.makeQuery
    );
  }; */

  handleIntegrationFilterChange = (integation) => {
    this.setState({ integrationFilter: integation });
  };

  handleStatusChange = (e, value) => {
    this.setState({ statusFilter: value });
  }

  render() {
    const { classes, history, orders, loading, params, filters, onUpdateFilters } = this.props;
    const {
      columnSortDirection,
    /* filtering,
      sortCriteria */
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
          filter: false
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
        name: 'integration',
        label: 'Channel / Integration',
        options: {
          filter: true,
          sort: false,
          filterType: 'custom',
          filterList: filters.getIn(['integrationFilter']),
          customFilterListOptions: {
            render: v => v[0].name
          },
          filterOptions: {
            display: () => {
              const { integrationFilter } = this.state;
              return (
                <FiltersDlg
                  integration={integrationFilter}
                  onIntegrationChange={this.handleIntegrationFilterChange}
                />
              );
            }
          },
          customBodyRender: value => <div>{value ? `${value.channel_title} / ${value.name}` : ''}</div>
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
      sort: false,
      serverSide: true,
      searchText: params.get('term'),
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
          case 'resetFilters':
            this.handleResetFilters();
            break;
          default:
            break;
        }
      },
      onRowClick: (rowData, { dataIndex }) => {
        const order = orderList[dataIndex];
        this.handleDetailsViewClick(order);
      },
      onColumnSortChange: (changedColumn, direction) => {
        let order = 'desc';
        if (direction === 'ascending') {
          order = 'asc';
        }

        this.sort(changedColumn, order);
      },
      /* customSort: (data, colIndex, order) => data.sort((a, b) => {
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
      }), */
      customFilterDialogFooter: () => (
        <div style={{ padding: '16px' }}>
          <Button variant="contained" onClick={this.handleFilterSubmit}>Apply Filters</Button>
        </div>
      ),
      onFilterChipClose: (index) => {
        const fltrs = filters.toJS();
        switch (index) {
          case 5:
            fltrs.integrationFilter = null;
            break;
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
        <PageHeader title="Order List" history={history} />
        <div className={classes.table}>
          {loading && <Loading />}
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable
              columns={columns}
              data={orderList}
              options={options}
            />
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}

OrderList.propTypes = {
  orders: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  onGetOrders: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  onUpdateFilters: PropTypes.func.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  onChangeSearchTerm: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

const mapStateToProps = state => ({
  orders: state.getIn(['order', 'orders']),
  params: state.getIn(['order', 'params']),
  filters: state.getIn(['order', 'filters']),
  loading: state.getIn(['order', 'loading']),
  error: state.getIn(['order', 'error']),
});

const mapDispatchToProps = dispatch => ({
  onGetOrders: params => dispatch(getOrders(params)),
  onUpdateFilters: bindActionCreators(updateFilters, dispatch),
  onChangePage: bindActionCreators(changePage, dispatch),
  onChangeRowsPerPage: bindActionCreators(changeRowsPerPage, dispatch),
  onChangeSearchTerm: bindActionCreators(changeSearchTerm, dispatch),
});

const OrderListMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderList);

export default withSnackbar(withStyles(styles)(OrderListMapped));
