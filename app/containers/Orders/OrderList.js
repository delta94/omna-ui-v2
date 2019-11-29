import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
// import classNames from 'classnames';
import moment from 'moment';
// import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';

// material-ui
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider
} from '@material-ui/core/styles';

import MUIDataTable from 'mui-datatables';
import Loading from 'dan-components/Loading';
import API from '../Utils/api';

import PageHeader from '../Common/PageHeader';
// const variantIcon = Utils.iconVariants();
// import { getOrders } from '../../actions/orderActions';

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
      }
    }
  }
});

class OrderList extends React.Component {
  state = {
    isLoading: true,
    orders: { data: [], pagination: {} },
    integrationFilterOptions: [],
    limit: 10,
    page: 0,
    serverSideFilterList: [],
    searchTerm: ''
  };

  componentDidMount() {
    this.getIntegrations();
    this.callAPI();
  }

  getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableToolbar: {
        filterPaper: {
          width: '50%'
        }
      }
    }
  });

  getOrders(params) {
    const { enqueueSnackbar } = this.props;
    API.get('/orders', { params })
      .then(response => {
        this.setState({
          orders: get(response, 'data', { data: [], pagination: {} }),
          limit: get(response, 'data.pagination.limit', 0)
        });
      })
      .catch(error => {
        enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
          variant: 'error'
        });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  getIntegrations() {
    API.get('/integrations', { params: { limit: 100, offset: 0 } })
      .then(response => {
        const { data } = response.data;
        const integrations = data.map(item => item.id);
        this.setState({ integrationFilterOptions: integrations });
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
  }

  callAPI = () => {
    const {
      searchTerm, limit, page, serverSideFilterList
    } = this.state;

    const params = {
      offset: page * limit,
      limit,
      term: searchTerm || '',
      integration_id: serverSideFilterList[4] ? serverSideFilterList[4][0] : ''
    };

    this.setState({ isLoading: true });
    this.getOrders(params);
    // this.props.onGetOrders(params);
  };

  handleChangePage = (page, searchTerm) => {
    this.setState({ page, searchTerm }, this.callAPI);
  };

  handleChangeRowsPerPage = rowsPerPage => {
    this.setState({ limit: rowsPerPage }, this.callAPI);
  };

  handleDetailsViewClick = order => {
    const { history } = this.props;
    history.push(
      `/app/orders/${get(
        order,
        'number',
        0
      )}`,
      { order: { data: order } }
    );
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
      this.setState({ serverSideFilterList: filterList }, this.callAPI);
    } else {
      this.setState({ serverSideFilterList: [] }, this.callAPI);
    }
  };

  handleResetFilters = () => {
    const { serverSideFilterList } = this.state;
    if (serverSideFilterList.length > 0) {
      this.setState({ serverSideFilterList: [] }, this.callAPI);
    }
  };

  getCurrencySymbol = currency => {
    switch (currency) {
      case 'EUR':
        return '€';
      case 'GBP':
        return '£';
      case 'CNY':
        return '¥';
      case 'RUB':
        return '₽';
      case 'JPY':
        return '¥';
      default:
        return '$';
    }
  };

  render() {
    const { classes, history } = this.props;
    const {
      integrationFilterOptions,
      isLoading,
      limit,
      orders,
      page,
      serverSideFilterList,
      searchTerm
    } = this.state;
    const { pagination, data } = orders;

    console.log(data);
    const count = get(pagination, 'total', 0);

    const columns = [
      {
        name: 'number',
        label: 'Number',
        options: {
          filter: false
        }
      },
      {
        name: 'updated_date',
        label: 'Date',
        options: {
          filter: false,
          customBodyRender: value => (
            <div>{moment(value).format('Y-MM-DD')}</div>
          )
        }
      },
      {
        name: 'status',
        label: 'Status',
        options: {
          filter: false,
          sort: false,
          customBodyRender: value => <div>{value.toUpperCase()}</div>
        }
      },
      {
        name: 'total_price',
        label: 'Total',
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => {
            const { currency } = tableMeta.rowData;
            return <div>{this.getCurrencySymbol(currency) + value}</div>;
          }
        }
      },
      {
        name: 'integration',
        label: 'Integration',
        options: {
          sort: true,
          filterType: 'dropdown',
          filterList: serverSideFilterList[4],
          filterOptions: {
            names: integrationFilterOptions
          },
          customBodyRender: value => <div>{value.name}</div>
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
      onRowClick: (rowData, { dataIndex }) => {
        const order = data[dataIndex];
        this.handleDetailsViewClick(order);
      },
      customSort: (customSortData, colIndex, order) => customSortData.sort((a, b) => {
        switch (colIndex) {
          case 3:
            return (
              (parseFloat(a.customSortData[colIndex])
                < parseFloat(b.customSortData[colIndex])
                ? -1
                : 1) * (order === 'desc' ? 1 : -1)
            );
          case 4:
            return (
              (a.customSortData[colIndex].name.toLowerCase()
                < b.customSortData[colIndex].name.toLowerCase()
                ? -1
                : 1) * (order === 'desc' ? 1 : -1)
            );
          default:
            return (
              (a.customSortData[colIndex] < b.customSortData[colIndex]
                ? -1
                : 1) * (order === 'desc' ? 1 : -1)
            );
        }
      })
    };

    return (
      <div>
        <PageHeader title="Orders" history={history} />
        <div className={classes.table}>
          {isLoading ? <Loading /> : null}
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable columns={columns} data={data} options={options} />
          </MuiThemeProvider>
        </div>
      </div>
    );
  }
}

OrderList.propTypes = {
  // orders: PropTypes.array.isRequired,
  // onGetOrders: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

// const mapStateToProps = state => ({
//   orders: state.orders.orders
// });

// const mapDispatchToProps = dispatch => ({
//   onGetOrders: params => dispatch(getOrders(params))
// });

// const OrderListMapped = connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(OrderList);

export default withSnackbar(withStyles(styles)(OrderList));
