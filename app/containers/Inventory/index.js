import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import MUIDataTable from 'mui-datatables';
import { Loading, EmptyState } from 'dan-components';
import { getInventoryEntries } from 'dan-actions';
// import { getCurrencySymbol } from '../Common/Utils';
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
    const { enqueueSnackbar, onGetInventoryEntries, store, error } = this.props;
    const { searchTerm, limit, page, sortCriteria, sortDirection } = this.state;

    const params = {
      offset: page * limit,
      limit,
      term: searchTerm || ''
    };

    if (sortCriteria && sortDirection) {
      const sortParam = `{"${sortCriteria}":"${sortDirection.toUpperCase()}"}`;
      params.sort = JSON.parse(sortParam);
    }

    onGetInventoryEntries({ store, params });

    if (error) enqueueSnackbar(error, { variant: 'error' });
  };

  handleChangePage = (page, searchTerm) => {
    this.setState({ page, searchTerm }, this.callAPI);
  };

  handleChangeRowsPerPage = rowsPerPage => {
    this.setState({ limit: rowsPerPage }, this.callAPI);
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
    const newColumnSortDirections = ['none', 'none', 'none', 'none', 'none'];

    switch (column) {
      case 'product':
        newColumnSortDirections[0] = order;
        break;
      case 'variant':
        newColumnSortDirections[1] = order;
        break;
      case 'location':
        newColumnSortDirections[2] = order;
        break;
      case 'available':
        newColumnSortDirections[4] = order;
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
    const { classes, history, loading, inventoryEntries } = this.props;
    const {
      columnSortDirection,
      filtering,
      limit,
      page,
      serverSideFilterList,
      searchTerm,
      sortCriteria
    } = this.state;
    const { data: entries, pagination } = inventoryEntries.toJS();
    const count = get(pagination, 'total', 0);

    const columns = [
      {
        name: 'product_title',
        label: 'Product',
        options: {
          sortDirection: columnSortDirection[0],
          filter: false
        }
      },
      {
        name: 'sku',
        label: 'SKU',
        options: {
          sortDirection: columnSortDirection[1],
          filter: false
        }
      },
      {
        name: 'quantity',
        label: 'Quantity',
        options: {
          sortDirection: columnSortDirection[2],
          filter: false
        }
      }
    ];

    const options = {
      filter: false,
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
      }
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
                data={entries}
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
  loading: PropTypes.bool.isRequired,
  inventoryEntries: PropTypes.object.isRequired,
  onGetInventoryEntries: PropTypes.func.isRequired,
  store: PropTypes.string.isRequired,
  error: PropTypes.object.isRequired,
  classes: PropTypes.shape({}).isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

const mapStateToProps = state => ({
  loading: state.getIn(['inventory', 'loading']),
  inventoryEntries: state.getIn(['inventory', 'inventoryEntries']),
  error: state.getIn(['inventory', 'error']),
  store: state.getIn(['user', 'tenantName'])
});

const mapDispatchToProps = dispatch => ({
  onGetInventoryEntries: query => dispatch(getInventoryEntries(query))
});

const InventoryEntriesMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(InventoryEntries);

export default withSnackbar(withStyles(styles)(InventoryEntriesMapped));
