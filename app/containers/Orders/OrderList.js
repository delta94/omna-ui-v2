import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Paper from '@material-ui/core/Paper';
// import classNames from 'classnames';
// import Ionicon from 'react-ionicons';
import moment from 'moment';

// material-ui
import { withStyles } from '@material-ui/core/styles';

import MUIDataTable from 'mui-datatables';
import API from '../Utils/api';
// import Utils from '../Common/Utils';
import LoadingState from '../Common/LoadingState';
// const variantIcon = Utils.iconVariants();

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
    messageError: '',
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
    // const { classes } = this.props;
    const { pagination, data } = get(this.state, 'orders', {
      data: [],
      pagination: {}
    });
    const { isLoading, page } = this.state;
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
            <div>{moment(value).format('Y-MM-DD H:mm:ss')}</div>
          )
        }
      },
      {
        name: 'status',
        label: 'Status',
        options: {
          sort: false
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
          customBodyRender: value => <div>{value.name}</div>
        }
      }
    ];

    const options = {
      selectableRows: 'none',
      responsive: 'stacked',
      download: false,
      print: false,
      serverSide: true,
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
          <MUIDataTable data={data} columns={columns} options={options} />
        )}
      </div>
    );
  }
}

OrderList.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

export default withStyles(styles)(OrderList);
