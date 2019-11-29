import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
// import classNames from 'classnames';
import moment from 'moment';
// import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';

// material-ui
import {
  Avatar,
  Typography
} from '@material-ui/core';
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
    products: { data: [], pagination: {} },
    limit: 10,
    page: 0,
    serverSideFilterList: [],
    searchTerm: ''
  };

  componentDidMount() {
    // this.getIntegrations();
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
    API.get('/products', { params })
      .then(response => {
        this.setState({
          products: get(response, 'data', { data: [], pagination: {} }),
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

  // getIntegrations() {
  //   API.get('/integrations', { params: { limit: 100, offset: 0 } })
  //     .then(response => {
  //       const { data } = response.data;
  //       const integrations = data.map(item => item.id);
  //       this.setState({ integrationFilterOptions: integrations });
  //     })
  //     .catch(error => {
  //       // handle error
  //       console.log(error);
  //     });
  // }

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

  handleRowClick = id => {
    const { history } = this.props;
    history.push(`/app/products/${id}/`);
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
      isLoading,
      limit,
      products,
      page,
      serverSideFilterList,
      searchTerm
    } = this.state;
    const { pagination, data } = products;

    console.log(data);
    const count = get(pagination, 'total', 0);

    const columns = [
      {
        name: 'images',
        label: ' ',
        options: {
          filter: false,
          display: 'excluded',
        }
      },
      {
        name: 'name',
        label: 'Product',
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => {
            const [
              images,
              name
            ] = tableMeta.rowData;
            const imgSrc = images.length > 0 ? images[0] : '/images/image_placeholder.png';
            return (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={imgSrc} style={{ height: 72, width: 72, marginRight: 16 }} alt="product" />
                <Typography variant="body" component="p">{name}</Typography>
              </div>
            );
          }
        }
      },
      {
        name: 'description',
        label: 'Description',
        options: {
          display: 'exclude',
          filter: false,
          sort: false
        }
      },
      {
        name: 'price',
        label: 'Price',
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => {
            const { currency } = tableMeta.rowData;
            return <div>{this.getCurrencySymbol(currency) + value}</div>;
          }
        }
      },
      {
        name: 'last_import_date',
        label: 'Last import',
        options: {
          sort: true,
          customBodyRender: value => (
            <div>{moment(value).format('Y-MM-DD')}</div>
          )
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
      searchPlaceholder: 'Search by address & topic',
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
        const product = data[dataIndex];
        this.handleRowClick(product.id);
      },
      customSort: (customSortData, colIndex, product) => customSortData.sort((a, b) => {
        switch (colIndex) {
          case 3:
            return (
              (parseFloat(a.customSortData[colIndex])
              < parseFloat(b.customSortData[colIndex])
                ? -1
                : 1) * (product === 'desc' ? 1 : -1)
            );
          case 4:
            return (
              (a.customSortData[colIndex].name.toLowerCase()
              < b.customSortData[colIndex].name.toLowerCase()
                ? -1
                : 1) * (product === 'desc' ? 1 : -1)
            );
          default:
            return (
              (a.customSortData[colIndex] < b.customSortData[colIndex]
                ? -1
                : 1) * (product === 'desc' ? 1 : -1)
            );
        }
      })
    };

    return (
      <div>
        <PageHeader title="Products" history={history} />
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
  // products: PropTypes.array.isRequired,
  // onGetOrders: PropTypes.func.isRequired,
  classes: PropTypes.shape({}).isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

// const mapStateToProps = state => ({
//   products: state.products.products
// });

// const mapDispatchToProps = dispatch => ({
//   onGetOrders: params => dispatch(getOrders(params))
// });

// const OrderListMapped = connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(OrderList);

export default withSnackbar(withStyles(styles)(OrderList));
