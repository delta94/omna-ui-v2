import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withSnackbar } from 'notistack';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import get from 'lodash/get';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';
import filterDlgSizeHelper from 'utils/mediaQueries';

import { Avatar, Typography } from '@material-ui/core';
import MUIDataTable from 'mui-datatables';
import { Loading } from 'dan-components';
import { getIntegrations } from 'dan-actions/integrationActions';
import {
  getProducts,
  bulkLinkProducts,
  bulkUnlinkProducts,
  deleteProduct,
  unsubscribeProducts,
  initBulkEditData,
  updateProductFilters
} from 'dan-actions/productActions';
import {
  getCurrencySymbol, convertListToString, hasCategories, emptyArray, delay, getRemoteIds
} from 'dan-containers/Common/Utils';
import PageHeader from 'dan-containers/Common/PageHeader';
import AlertDialog from 'dan-containers/Common/AlertDialog';
import ToolbarActions from 'dan-components/Products/ToolbarActions';
import BulkLinker from 'dan-components/Products/BulkLinker';
import FiltersDlg from 'dan-components/Products/FiltersDlg';

class ProductList extends React.Component {
  state = {
    limit: 10,
    page: 0,
    integrationFilter: undefined,
    categoryFilter: undefined,
    searchTerm: '',
    rowsSelectedIndex: [],
    rowsSelectedIds: [],
    anchorElBulkEdit: null,
    selectedItem: null,
    bulkLinkerAction: 'link',
    openPublisherDlg: false,
    openConfirmDlg: false,
    filterPopover: 'Apply filters for bulk edit.'
  };

  componentDidMount = () => this.makeQuery();

  componentDidUpdate(prevProps) {
    const {
      task, history, filters
    } = this.props;
    if (task && task !== prevProps.task) {
      history.push(`tasks/${task.id}`);
    }
    if (filters && filters !== prevProps.filters) {
      this.makeQuery();
    }
  }

  componentWillUnmount() {
    const { onUnsubscribeProducts } = this.props;
    onUnsubscribeProducts();
  }

  getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          cursor: 'pointer'
        }
      },
      MUIDataTableToolbar: {
        filterPaper: {
          width: filterDlgSizeHelper,
          minWidth: '300px'
        }
      }
    }
  });

  getParams = () => {
    const { filters } = this.props;
    const { searchTerm, limit, page } = this.state;

    const params = {
      offset: page * limit,
      limit,
      term: searchTerm || '',
      with_details: true,
    };

    const integrationFilter = filters.get(0) ? filters.get(0).value : null;
    const categoryFilter = filters.get(1) ? filters.get(1).value : null;

    if (integrationFilter) {
      params.integration_id = integrationFilter;
      if (categoryFilter) {
        params.category_id = categoryFilter;
      }
    }

    return params;
  };

  makeQuery = () => {
    const { onGetProducts, enqueueSnackbar } = this.props;
    onGetProducts({ params: this.getParams(), enqueueSnackbar });
  };

  updateRowsSelectedIds = (rowsSelectedData, allRows, data) => {
    const { rowsSelectedIds } = this.state;
    if (allRows.length !== 0) {
      const selectedIndex = rowsSelectedData[0].dataIndex;
      const selectedId = data[selectedIndex].id;
      const row = allRows.findIndex(item => item === rowsSelectedData[0]);
      if (row >= 0) {
        rowsSelectedIds.push(selectedId);
      } else {
        const deleteIndex = rowsSelectedIds.findIndex(item => item === selectedId);
        rowsSelectedIds.splice(deleteIndex, 1);
      }
      this.setState({ rowsSelectedIds });
    } else this.setState({ rowsSelectedIds: [] });
  };

  handleChangePage = (page, searchTerm) => {
    this.setState({ page, searchTerm }, this.makeQuery);
    this.setState({ rowsSelectedIndex: [] });
  };

  handleChangeRowsPerPage = rowsPerPage => {
    this.setState({ limit: rowsPerPage }, this.makeQuery);
  };

  handleSearch = searchTerm => {
    if (searchTerm) {
      this.setState({ searchTerm }, delay(() => this.makeQuery()));
    } else {
      const { searchTerm: _searchTerm } = this.state;
      if (_searchTerm) {
        this.setState({ searchTerm: '' }, this.makeQuery);
      }
    }
  };

  onHandleCloseSearch = () => {
    this.setState({ searchTerm: '' }, this.makeQuery);
  };

  handleIntegrationFilterChange = (integation) => {
    this.setState({ integrationFilter: integation });
  };

  handleCategoryFilterChange = (category) => {
    this.setState({ categoryFilter: category });
  };

  handleResetFilters = () => {
    this.setState({ integrationFilter: null, categoryFilter: null });
  };

  handleFilterSubmit = () => {
    const { onUpdateProductFilters } = this.props;
    const { integrationFilter, categoryFilter } = this.state;
    const resultList = [];
    integrationFilter ? resultList[0] = integrationFilter : null;
    categoryFilter ? resultList[1] = categoryFilter : null;
    onUpdateProductFilters(resultList);
  };

  handleConfirmDlg = () => {
    const { selectedItem } = this.state;
    const { onDeleteProduct, enqueueSnackbar } = this.props;
    this.setState({ openConfirmDlg: false });
    onDeleteProduct(selectedItem.id, this.getParams(), enqueueSnackbar);
  };

  handleCancelDlg = () => this.setState({ openConfirmDlg: false });

  handleBulkLink = () => this.setState({ openPublisherDlg: true, bulkLinkerAction: 'link' });

  handleBulkUnlink = () => this.setState({ openPublisherDlg: true, bulkLinkerAction: 'unlink' });

  handleBulkLinkerAction = async value => {
    const {
      store, enqueueSnackbar, onBulkLinkProducts, onBulkUnlinkProducts
    } = this.props;
    const { bulkLinkerAction, rowsSelectedIds } = this.state;
    const { integrationIds, deleteFromIntegration } = value;
    if (bulkLinkerAction === 'link') {
      onBulkLinkProducts(store, rowsSelectedIds, integrationIds, enqueueSnackbar);
    } else {
      onBulkUnlinkProducts(store, rowsSelectedIds, integrationIds, deleteFromIntegration, enqueueSnackbar);
    }
    this.setState({ openPublisherDlg: false });
  };

  handleBulkEdit = (event) => {
    const { rowsSelectedIndex } = this.state;
    const {
      products, integrations, filters, onInitBulkEditData, history
    } = this.props;
    if (!emptyArray(filters)) {
      const integration = filters.get(0) ? filters.get(0).value : '';
      const category = filters.get(1) ? filters.get(1).value : '';
      if (hasCategories(integrations, integration) && !category) {
        this.setState({ filterPopover: 'Category filter must be applied.' });
        this.setState({ anchorElBulkEdit: event.currentTarget });
      } else {
        const { data } = products;
        const remoteIds = getRemoteIds(data, rowsSelectedIndex, integration);
        onInitBulkEditData({
          remoteIds, integration, category, properties: []
        });
        history.push('/products/bulk-edit');
      }
    } else this.setState({ filterPopover: 'Apply filters for bulk edit.', anchorElBulkEdit: event.currentTarget });
  };

  render() {
    const {
      limit,
      page,
      searchTerm,
      rowsSelectedIndex,
      bulkLinkerAction,
      openPublisherDlg: openPublishDlg,
      openConfirmDlg,
      selectedItem,
      anchorElBulkEdit,
      filterPopover
    } = this.state;
    const {
      history, products, loading, fromShopifyApp, filters, onUpdateProductFilters
    } = this.props;
    const { pagination, data } = products;
    const count = get(pagination, 'total', 0);

    const columns = [
      {
        name: 'images',
        label: 'Image',
        options: {
          filter: false,
          viewColumns: false,
          customBodyRender: (value) => {
            const imgSrc = value.length > 0
              ? value[0]
              : '/images/image_placeholder_listItem.png';
            return (
              <Avatar
                src={imgSrc}
                style={{
                  height: 72,
                  width: 72,
                  marginRight: 16,
                  borderRadius: 0
                }}
                alt="product"
              />
            );
          }
        }
      },
      {
        name: 'name',
        label: 'Name',
        options: {
          filter: false,
          viewColumns: false,
          customBodyRender: (value) => (
            <Typography noWrap variant="subtitle2" component="p">
              {value}
            </Typography>
          )
        }
      },
      {
        name: 'price',
        label: 'Price',
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => {
            const { currency } = tableMeta.rowData;
            return (
              <div>
                {value ? (
                  <Fragment>
                    {`${getCurrencySymbol(currency)}`}
                    {parseFloat(value).toFixed(2)}
                  </Fragment>
                ) : ''
                }
              </div>
            );
          }
        }
      },
      {
        name: 'integrations',
        label: 'Integrations',
        options: {
          filter: true,
          sort: false,
          filterType: 'custom',
          filterList: filters,
          customFilterListOptions: {
            render: v => v.name
          },
          filterOptions: {
            display: () => {
              const { integrationFilter, categoryFilter } = this.state;
              return (
                <FiltersDlg
                  integration={integrationFilter}
                  category={categoryFilter}
                  onIntegrationChange={this.handleIntegrationFilterChange}
                  onCategoryChange={this.handleCategoryFilterChange}
                />
              );
            }
          },
          customBodyRender: value => convertListToString(value)
        }
      },
      {
        name: 'id',
        options: {
          filter: false,
          display: 'excluded'
        }
      },
      {
        name: 'Actions',
        options: {
          filter: false,
          sort: false,
          empty: true,
          display: fromShopifyApp ? 'excluded' : true,
          customBodyRender: () => (
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={() => this.setState({ openConfirmDlg: true })}
            >
              <DeleteIcon />
            </IconButton>
          )
        }
      }
    ];

    const options = {
      filter: true,
      sort: false,
      selectableRows: fromShopifyApp ? 'multiple' : 'none',
      rowsSelected: rowsSelectedIndex,
      responsive: 'vertical',
      rowHover: true,
      download: false,
      print: false,
      serverSide: true,
      searchText: searchTerm,
      searchPlaceholder: 'Search by name',
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
          case 'resetFilters':
            this.handleResetFilters();
            break;
          default:
            break;
        }
      },
      onCellClick: (rowData, { colIndex, dataIndex }) => {
        this.setState({ selectedItem: data[dataIndex] });
        if (colIndex !== 5) {
          history.push(`/products/${data[dataIndex].id}/edit-product`);
        }
      },
      onRowSelectionChange: (rowsSelectedData, allRows, indexList) => {
        this.setState({ rowsSelectedIndex: indexList });
        this.updateRowsSelectedIds(rowsSelectedData, allRows, data);
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
      }),
      customToolbar: () => (
        <Fragment>
          {!fromShopifyApp && (
            <Tooltip title="add">
              <IconButton
                aria-label="add"
                component={Link}
                to="/products/add-product"
              >
                <AddCircleIcon />
              </IconButton>
            </Tooltip>
          )}
        </Fragment>
      ),
      customToolbarSelect: () => (
        <div style={{ display: 'flex' }}>
          <ToolbarActions
            onLink={this.handleBulkLink}
            onUnlink={this.handleBulkUnlink}
          />
          <Tooltip title="Bulk edit">
            <IconButton
              aria-label="edit"
              aria-describedby={anchorElBulkEdit ? 'simple-popover' : undefined}
              onClick={this.handleBulkEdit}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Popover
            id={anchorElBulkEdit ? 'simple-popover' : undefined}
            open={Boolean(anchorElBulkEdit)}
            anchorEl={anchorElBulkEdit}
            onClose={() => this.setState({ anchorElBulkEdit: null })}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Typography style={{ padding: '16px' }}>{filterPopover}</Typography>
          </Popover>
        </div>
      ),
      setFilterChipProps: (colIndex, colName, chip) => ({
        color: 'primary',
        variant: 'outlined',
        style: { overflow: 'hidden' },
        disabled: (filters.get(1) && chip.value !== filters.get(1).value) || false
      }),
      customFilterDialogFooter: (currentFilterList, applyNewFilters) => (
        <div style={{ padding: '16px' }}>
          <Button variant="contained" onClick={() => this.handleFilterSubmit(applyNewFilters)}>Apply Filters</Button>
        </div>
      ),
      onFilterChipClose: (index, removedFilter) => {
        const removeChips = filters.filter(item => item.value !== removedFilter.value);
        onUpdateProductFilters(removeChips);
      }
    };

    return (
      <div>
        <PageHeader title="Products" history={history} />
        {loading ? <Loading /> : null}
        <MuiThemeProvider theme={this.getMuiTheme()}>
          <MUIDataTable columns={columns} data={data} options={options} />
        </MuiThemeProvider>
        <AlertDialog
          open={openConfirmDlg}
          message={`Are you sure you want to remove the product: "${selectedItem ? selectedItem.name : ''}" ?`}
          handleCancel={this.handleCancelDlg}
          handleConfirm={this.handleConfirmDlg}
        />
        <BulkLinker
          action={bulkLinkerAction}
          open={openPublishDlg}
          fromShopifyApp={fromShopifyApp}
          onClose={() => this.setState({ openPublisherDlg: false })}
          onSave={this.handleBulkLinkerAction}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  products: state.getIn(['product', 'products']),
  integrations: state.getIn(['integration', 'integrations']).toJS(),
  filters: state.getIn(['product', 'filters']),
  loading: state.getIn(['product', 'loading']),
  deleted: state.getIn(['product', 'deleted']),
  task: state.getIn(['product', 'task']),
  fromShopifyApp: state.getIn(['user', 'fromShopifyApp']),
  store: state.getIn(['user', 'tenantName']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onGetIntegrations: bindActionCreators(getIntegrations, dispatch),
  onBulkLinkProducts: bindActionCreators(bulkLinkProducts, dispatch),
  onBulkUnlinkProducts: bindActionCreators(bulkUnlinkProducts, dispatch),
  onDeleteProduct: bindActionCreators(deleteProduct, dispatch),
  onGetProducts: bindActionCreators(getProducts, dispatch),
  onUnsubscribeProducts: bindActionCreators(unsubscribeProducts, dispatch),
  onInitBulkEditData: bindActionCreators(initBulkEditData, dispatch),
  onUpdateProductFilters: bindActionCreators(updateProductFilters, dispatch),
});

const ProductListMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductList);

ProductList.defaultProps = {
  task: null
};

ProductList.propTypes = {
  products: PropTypes.object.isRequired,
  integrations: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  task: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  fromShopifyApp: PropTypes.bool.isRequired,
  store: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  onGetProducts: PropTypes.func.isRequired,
  onBulkLinkProducts: PropTypes.func.isRequired,
  onBulkUnlinkProducts: PropTypes.func.isRequired,
  onDeleteProduct: PropTypes.func.isRequired,
  onUnsubscribeProducts: PropTypes.func.isRequired,
  onInitBulkEditData: PropTypes.func.isRequired,
  onUpdateProductFilters: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(ProductListMapped);
