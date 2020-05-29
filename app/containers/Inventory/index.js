import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import moment from 'moment';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import MUIDataTable from 'mui-datatables';
import { Loading, EmptyState } from 'dan-components';
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

class InventoryEntries extends Component {
  state = {
    limit: 10,
    page: 0,
    serverSideFilterList: [],
    searchTerm: '',
    filtering: false,
    columnSortDirection: ['none', 'none', 'none', 'none', 'none', 'none'],
    sortCriteria: '',
    sortDirection: ''
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
    const {
      searchTerm,
      limit,
      page,
      serverSideFilterList,
      sortCriteria,
      sortDirection
    } = this.state;

    const params = {
      offset: page * limit,
      limit,
      term: searchTerm || '',
      integration_id: serverSideFilterList[5] ? serverSideFilterList[5][0] : ''
    };

    if (sortCriteria && sortDirection) {
      const sortParam = `{"${sortCriteria}":"${sortDirection.toUpperCase()}"}`;
      params.sort = JSON.parse(sortParam);
    }

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

  sort = (column, order) => {
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
      this.callAPI
    );
  };

  render() {
    const { classes, history, loading } = this.props;
    const {
      columnSortDirection,
      filtering,
      limit,
      page,
      serverSideFilterList,
      searchTerm,
      sortCriteria
    } = this.state;

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
          filter: false,
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
          sortDirection: columnSortDirection[5],
          sort: false,
          filterType: 'dropdown',
          filterList: serverSideFilterList[5],
          filterOptions: {
            names: integrationFilterOptions
          },
          customBodyRender: value => (
            <div>{value ? `${value.channel_title} / ${value.name}` : ''}</div>
          )
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
        const order = InventoryEntries[dataIndex];
        this.handleDetailsViewClick(order);
      },
      onColumnSortChange: (changedColumn, direction) => {
        let order = 'desc';
        if (direction === 'ascending') {
          order = 'asc';
        }

        this.sort(changedColumn, order);
      },
      customSort: (data, colIndex, order) =>
        data.sort((a, b) => {
          switch (colIndex) {
            case 4:
              return (
                (parseFloat(a.data[colIndex]) < parseFloat(b.data[colIndex])
                  ? -1
                  : 1) * (order === 'desc' ? 1 : -1)
              );
            case 5:
              return (
                (a.data[colIndex].name.toLowerCase() <
                b.data[colIndex].name.toLowerCase()
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
        <PageHeader title="Inventory Entries" history={history} />
        <div className={classes.table}>
          {loading && !sortCriteria ? (
            <Loading fullPage={!filtering} />
          ) : count > 0 || filtering ? (
            <div>
              {sortCriteria && loading && <Loading />}
              <MUIDataTable
                columns={columns}
                data={InventoryEntries}
                options={options}
              />
            </div>
          ) : (
            <EmptyState text="There's nothing here now, but inventory entries will show up here later." />
          )}
        </div>
      </div>
    );
  }
}

InventoryEntries.propTypes = {
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

// const mapStateToProps = state => ({});

// const mapDispatchToProps = dispatch => ({});

const InventoryEntriesMapped = connect(
  null,
  null
)(InventoryEntries);

export default withSnackbar(withStyles(styles)(InventoryEntriesMapped));
