import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Paper from '@material-ui/core/Paper';
// import classNames from 'classnames';
// import Ionicon from 'react-ionicons';
import moment from 'moment';
// import { connect } from 'react-redux';

// material-ui
import { withStyles } from '@material-ui/core/styles';

import MUIDataTable from 'mui-datatables';
import API from '../Utils/api';
// import Utils from '../Common/Utils';
import LoadingState from '../Common/LoadingState';
// const variantIcon = Utils.iconVariants();
// import { getOrders } from '../../actions/orderActions';

const styles = () => ({
  table: {
    minWidth: 700
  }
});

class OrderList extends React.Component {
  state = {
    isLoading: true,
    orders: { data: [], pagination: {} },
    limit: 10,
    page: 0,
    success: true,
    messageError: ''
    // selectedRow: -1
  };

  componentDidMount() {
    this.callAPI();
  }

  getOrders(params) {
    API.get('/orders', { params })
      .then(response => {
        this.setState({
          orders: get(response, 'data', { data: [], pagination: {} }),
          limit: get(response, 'data.pagination.limit', 0)
        });
      })
      .catch(error => {
        // handle error
        console.log(error);
        this.setState({ success: false, messageError: error.message });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  callAPI = () => {
    const { limit, page } = this.state;
    const params = {
      offset: page * limit,
      limit
    };

    this.getOrders(params);
    // this.props.onGetOrders(params);
  };

  handleChangePage = page => {
    this.setState({ page }, this.callAPI);
  };

  handleChangeRowsPerPage = rowsPerPage => {
    this.setState({ limit: rowsPerPage }, this.callAPI);
  };

  handleDetailsViewClick = order => {
    const { history } = this.props;
    history.push(
      `/app/orders-list/${get(order, 'integration.id', 0)}/${get(
        order,
        'number',
        0
      )}/order-details`,
      { order: { data: order } }
    );
  };

  handleSearchClick = (currentTerm, filters) => {
    const { limit, page } = this.state;
    const params = {
      offset: page * limit,
      limit,
      term: currentTerm,
      integration_id: filters.Integration
    };

    this.setState({ isLoading: true });
    this.getOrders(params);
  };

  render() {
    // const { classes, orders } = this.props;
    const { isLoading, page, orders } = this.state;
    const { pagination, data } = orders;

    console.log(data);
    const count = get(pagination, 'total', 0);

    const columns = [
      {
        name: 'number',
        label: 'Number',
        options: {
          filter: true
        }
      },
      {
        name: 'updated_date',
        label: 'Date',
        options: {
          filter: false,
          customBodyRender: value => (
            <div>{moment(value).format('Y-MM-DD H:mm:ss')}</div>
          )
        }
      },
      {
        name: 'status',
        label: 'Status',
        options: {
          sort: false,
          customBodyRender: value => <div>{value.toUpperCase()}</div>
        }
      },
      {
        name: 'total_price',
        label: 'Total',
        options: {
          filter: false
        }
      },
      {
        name: 'integration',
        label: 'Integration',
        options: {
          filter: false,
          sort: true,
          customBodyRender: value => <div>{value.name}</div>
        }
      }
    ];

    const options = {
      filter: true,
      filterType: 'textField',
      selectableRows: 'none',
      responsive: 'stacked',
      download: false,
      print: false,
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
          default:
            break;
        }
      },
      onRowClick: (rowData, { dataIndex }) => {
        const order = data[dataIndex];
        this.handleDetailsViewClick(order);
      },
      customSort: (customSortData, colIndex, order) => {
        return customSortData.sort((a, b) => {
          switch (colIndex) {
            case 3:
              return (
                (parseFloat(a.customSortData[colIndex]) <
                parseFloat(b.customSortData[colIndex])
                  ? -1
                  : 1) * (order === 'desc' ? 1 : -1)
              );
            case 4:
              return (
                (a.customSortData[colIndex].name.toLowerCase() <
                b.customSortData[colIndex].name.toLowerCase()
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
        });
      }
    };

    return (
      <div>
        {isLoading ? (
          <Paper>
            <div className="item-padding">
              <LoadingState loading={isLoading} text="Loading" />
            </div>
          </Paper>
        ) : (
          <MUIDataTable
            title="Orders"
            columns={columns}
            data={data}
            options={options}
          />
        )}
      </div>
    );
  }
}

OrderList.propTypes = {
  // orders: PropTypes.array.isRequired,
  // onGetOrders: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
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

export default withStyles(styles)(OrderList);
