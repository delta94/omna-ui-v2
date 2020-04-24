import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import moment from 'moment';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';

import MUIDataTable from 'mui-datatables';
import Loading from 'dan-components/Loading';
import { getOrders } from 'dan-actions/orderActions';
import { getIntegrations } from 'dan-actions/integrationActions';
import Utils from '../Common/Utils';

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

class OrderList extends Component {
  state = {
    limit: 10,
    page: 0,
    serverSideFilterList: [],
    searchTerm: ''
  };

  componentDidMount() {
    this.callAPI();
  }

  callAPI = () => {
    const {
      enqueueSnackbar,
      error,
      onGetIntegrations,
      onGetOrders
    } = this.props;
    const { searchTerm, limit, page, serverSideFilterList } = this.state;
    const params = {
      offset: page * limit,
      limit,
      term: searchTerm || '',
      integration_id: serverSideFilterList[5] ? serverSideFilterList[5][0] : ''
    };

    onGetIntegrations({ limit: 100, offset: 0 });
    onGetOrders(params);

    if (error)
      enqueueSnackbar(error, {
        variant: 'error'
      });
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
      // const mappedList = filterList.map(i => i.name);
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
    const { classes, history, orders, loading, integrations } = this.props;
    const { limit, page, serverSideFilterList, searchTerm } = this.state;
    const { data, pagination } = orders.toJS();
    const { total: count } = pagination;

    const integrationFilterOptions = integrations.get('data')
      ? integrations
          .get('data')
          .toJS()
          .map(integration => integration.id)
      : [];

    const columns = [
      {
        name: 'number',
        label: 'Order',
        options: {
          filter: false
        }
      },
      {
        name: 'created_date',
        label: 'Created at',
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
          display: 'excluded'
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
          filterList: serverSideFilterList[5],
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
          {loading ? (
            <Loading />
          ) : (
            <MUIDataTable columns={columns} data={data} options={options} />
          )}
        </div>
      </div>
    );
  }
}

OrderList.propTypes = {
  orders: PropTypes.object.isRequired,
  onGetOrders: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
  integrations: PropTypes.object.isRequired,
  onGetIntegrations: PropTypes.func.isRequired,
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
  integrations: state.getIn(['integration', 'integrations'])
});

const mapDispatchToProps = dispatch => ({
  onGetOrders: params => dispatch(getOrders(params)),
  onGetIntegrations: params => dispatch(getIntegrations(params))
});

const OrderListMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderList);

export default withSnackbar(withStyles(styles)(OrderListMapped));
