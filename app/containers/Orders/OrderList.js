import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
// import classNames from 'classnames';
import moment from 'moment';
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import { withSnackbar } from 'notistack';
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider
} from '@material-ui/core/styles';

import MUIDataTable from 'mui-datatables';
import Loading from 'dan-components/Loading';
import API from '../Utils/api';
import Utils from '../Common/Utils';

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
      },
      '& tr': {
        cursor: 'pointer'
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
    this.callAPI();
  }

  getMuiTheme = () =>
    createMuiTheme({
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
    const { enqueueSnackbar } = this.props;
    API.get('/integrations', { params: { limit: 100, offset: 0 } })
      .then(response => {
        const { data } = response.data;
        const integrations = data.map(item => item.id);
        this.setState({ integrationFilterOptions: integrations });
      })
      .catch(error => {
        enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
          variant: 'error'
        });
      });
  }

  callAPI = () => {
    // const { onGetOrders } = this.props;
    const { searchTerm, limit, page, serverSideFilterList } = this.state;
    const params = {
      offset: page * limit,
      limit,
      term: searchTerm || '',
      integration_id: serverSideFilterList[4] ? serverSideFilterList[4][0] : ''
    };

    this.setState({ isLoading: true });
    this.getIntegrations();
    this.getOrders(params);
    // onGetOrders(params);
  };

  handleChangePage = (page, searchTerm) => {
    this.setState({ page, searchTerm }, this.callAPI);
  };

  handleChangeRowsPerPage = rowsPerPage => {
    this.setState({ limit: rowsPerPage }, this.callAPI);
  };

  handleDetailsViewClick = order => {
    const { history } = this.props;
    history.push(`/app/orders/${get(order, 'number', 0)}`, {
      order: { data: order }
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
    const count = get(pagination, 'total', 0);

    const columns = [
      {
        name: 'number',
        label: 'Order',
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
            <div>{moment(value).format('DD-MM-YYYY HH:mm')}</div>
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
        name: 'currency',
        options: {
          filter: false,
          display: 'exclude'
        }
      },
      {
        name: 'total_price',
        label: 'Total',
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => {
            const currency = tableMeta.rowData[3];

            return (
              <div>
                {`${Utils.getCurrencySymbol(currency)}
                  ${parseFloat(value).toFixed(2)} ${currency}`}
              </div>
            );
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
          customBodyRender: value => <div>{value ? value.name : ''}</div>
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
      }
      // customSort: (data, colIndex, order) =>
      //   data.sort((a, b) => {
      //     debugger;
      //     switch (colIndex) {
      //       case 3:
      //         return (
      //           (parseFloat(a.data[colIndex]) <
      //           parseFloat(b.data[colIndex])
      //             ? -1
      //             : 1) * (order === 'desc' ? 1 : -1)
      //         );
      //       case 4:
      //         return (
      //           (a.data[colIndex].name.toLowerCase() <
      //           b.data[colIndex].name.toLowerCase()
      //             ? -1
      //             : 1) * (order === 'desc' ? 1 : -1)
      //         );
      //       default:
      //         return (
      //           (a.data[colIndex] < b.data[colIndex]
      //             ? -1
      //             : 1) * (order === 'desc' ? 1 : -1)
      //         );
      //     }
      //   })
    };

    return (
      <div>
        <PageHeader title="Order List" history={history} />
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
//   orders: state.getIn(['orders'])
// });

// const mapDispatchToProps = dispatch => ({
//   onGetOrders: bindActionCreators(params => getOrders(params), dispatch)
// });

// const OrderListMapped = connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(OrderList);

export default withSnackbar(withStyles(styles)(OrderList));
