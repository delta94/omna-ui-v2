import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withSnackbar } from 'notistack';
import get from 'lodash/get';
import Popover from '@material-ui/core/Popover';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';

import { Avatar, Typography, ListItemIcon } from '@material-ui/core';
import MUIDataTable from 'mui-datatables';
import { Loading } from 'dan-components';
import { getIntegrations } from 'dan-actions/integrationActions';
import {
  getProducts,
  bulkLinkProducts,
  bulkUnlinkProducts,
  deleteProduct,
  resetDeleteProductFlag,
  unsubscribeProducts,
  getProductsByIntegration,
  initBulkEditData
} from 'dan-actions/productActions';
import { getCurrencySymbol, convertListToString, hasCategories } from 'dan-containers/Common/Utils';
import PageHeader from 'dan-containers/Common/PageHeader';
import AlertDialog from 'dan-containers/Common/AlertDialog';
import ToolbarActions from 'dan-components/Products/ToolbarActions';
import BulkLinker from 'dan-components/Products/BulkLinker';
import FilterTableBox from 'dan-components/Products/FilterTableBox';

const getRemoteIds = (data, selectedIndexList, integration, type = 'product') => {
  const remoteIds = [];
  if (integration) {
    selectedIndexList.forEach(index => {
      const filteredIntegration = data[index].integrations.find(item => item.id === integration);
      if (filteredIntegration) {
        if (type === 'product') {
          const { product } = filteredIntegration;
          remoteIds.push(product.remote_product_id);
        } else {
          const { variant } = filteredIntegration;
          remoteIds.push(variant.remote_variant_id);
        }
      }
    });
  }
  return remoteIds;
};

class ProductList extends React.Component {
  state = {
    limit: 10,
    page: 0,
    filters: [],
    integrationFilter: undefined,
    categoryFilter: undefined,
    searchTerm: '',
    rowsSelectedIndex: [],
    rowsSelectedIds: [],
    anchorEl: null,
    anchorElBulkEdit: null,
    selectedItem: null,
    bulkLinkerAction: 'link',
    openPublisherDlg: false,
    openConfirmDlg: false,
    filterPopover: 'Apply filters for bulk edit.'
  };

  componentDidMount = () => this.makeQuery();

  componentDidUpdate(prevProps) {
    const { deleted, onResetDeleteProduct, task, history } = this.props;
    if (deleted && deleted !== prevProps.deleted) {
      onResetDeleteProduct();
      this.makeQuery();
    }
    if (task && task !== prevProps.task) {
      history.push(`tasks/${task.id}`);
    }
  }

  componentWillUnmount() {
    const { onUnsubscribeProducts } = this.props;
    onUnsubscribeProducts();
  }

  makeQuery = () => {
    const { onGetAllProducts, onGetProductsWithFilters, enqueueSnackbar } = this.props;
    const { searchTerm, limit, page, filters } = this.state;

    const params = {
      offset: page * limit,
      limit,
      term: searchTerm || '',
      with_details: true,
    };

    const integrationFilter = filters[0] ? filters[0].value : null;
    const categoryFilter = filters[1] ? filters[1].value : null;

    if (integrationFilter || categoryFilter) {
      categoryFilter ? params.category_id = categoryFilter : null;
      onGetProductsWithFilters(integrationFilter, params, enqueueSnackbar);
    } else onGetAllProducts({ params, enqueueSnackbar });
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
      const timer = setTimeout(() => {
        this.setState({ searchTerm }, this.makeQuery);
        clearTimeout(timer);
      }, 800);
      window.addEventListener('keydown', () => {
        clearTimeout(timer);
      });
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
    this.setState({ categoryFilter: category })
  };

  handleResetFilters = () => {
    this.setState({ integrationFilter: null, categoryFilter: null });
  };

  handleFilterSubmit = applyFilters => {
    const filterList = applyFilters();
    const { integrationFilter, categoryFilter } = this.state;
    if (integrationFilter) {
      filterList[3][0] = integrationFilter;
    }
    if (categoryFilter) {
      filterList[3][1] = categoryFilter;
    } else filterList[3].splice(1, 1);

    this.setState({ filters: filterList[3] }, this.makeQuery);
  };

  handleConfirmDlg = () => {
    const { selectedItem } = this.state;
    const { onDeleteProduct, enqueueSnackbar } = this.props;
    this.setState({ openConfirmDlg: false });
    onDeleteProduct(selectedItem.id, enqueueSnackbar);
  };

  handleCancelDlg = () => this.setState({ openConfirmDlg: false });

  handleBulkLink = () => this.setState({ openPublisherDlg: true, bulkLinkerAction: 'link' });

  handleBulkUnlink = () => this.setState({ openPublisherDlg: true, bulkLinkerAction: 'unlink' });

  handleBulkLinkerAction = async value => {
    const { appStore: { name }, enqueueSnackbar, onBulkLinkProducts, onBulkUnlinkProducts } = this.props;
    const { bulkLinkerAction, rowsSelectedIds } = this.state;
    const { integrationIds, deleteFromIntegration } = value;
    if (bulkLinkerAction === 'link') {
      onBulkLinkProducts(name, rowsSelectedIds, integrationIds, enqueueSnackbar)
    } else {
      onBulkUnlinkProducts(name, rowsSelectedIds, integrationIds, deleteFromIntegration, enqueueSnackbar);
    }
    this.setState({ openPublisherDlg: false });
  };

  handleBulkEdit = (event) => {
    const { filters, rowsSelectedIndex } = this.state;
    const { products, integrations, onInitBulkEditData, history } = this.props;
    if (filters.length > 0) {
      const integration = filters[0] ? filters[0].value : '';
      const category = filters[1] ? filters[1].value : '';
      if (hasCategories(integrations, integration) && !category) {
        this.setState({ filterPopover: 'Category filter must be applied.' });
        this.setState({ anchorElBulkEdit: event.currentTarget });
      } else {
        const { data } = products;
        const remoteIds = getRemoteIds(data, rowsSelectedIndex, filters[0] ? filters[0].value : null);
        onInitBulkEditData({ remoteIds, integration, category, properties: [] });
        history.push('/products/bulk-edit');
      }
    } else this.setState({ filterPopover: 'Apply filters for bulk edit.', anchorElBulkEdit: event.currentTarget });
  };

  handleMenu = event => this.setState({ anchorEl: event.currentTarget });

  handleCloseMenu = () => this.setState({ anchorEl: null });

  renderTableActionsMenu = () => {
    const { anchorEl } = this.state;
    return (
      <div>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={this.handleCloseMenu}
        >
          <MenuItem
            onClick={() => this.setState({ openConfirmDlg: true }, this.handleClose)}
          >
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            Delete
          </MenuItem>
        </Menu>
      </div>
    );
  };

  render() {
    const {
      limit,
      page,
      filters,
      searchTerm,
      rowsSelectedIndex,
      bulkLinkerAction,
      openPublisherDlg: openPublishDlg,
      openConfirmDlg,
      selectedItem,
      anchorElBulkEdit,
      filterPopover
    } = this.state;
    const { history, products, loading, appStore } = this.props;
    const { pagination, data } = products;
    const count = get(pagination, 'total', 0);

    const columns = [
      {
        name: 'images',
        label: 'Image',
        options: {
          filter: false,
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
            render: v => v.map(l => l.name)
          },
          filterOptions: {
            display: () => {
              const { integrationFilter, categoryFilter } = this.state;
              return (
                <FilterTableBox
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
          display: appStore.fromShopifyApp ? 'excluded' : true,
          customBodyRender: () => (
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={this.handleMenu}
            >
              <MoreVertIcon />
            </IconButton>
          )
        }
      }
    ];

    const options = {
      filter: true,
      selectableRows: appStore.fromShopifyApp ? 'multiple' : 'none',
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
      customSort: (customSortData, colIndex, product) =>
        customSortData.sort((a, b) => {
          switch (colIndex) {
            case 3:
              return (
                (parseFloat(a.customSortData[colIndex]) <
                  parseFloat(b.customSortData[colIndex])
                  ? -1
                  : 1) * (product === 'desc' ? 1 : -1)
              );
            case 4:
              return (
                (a.customSortData[colIndex].name.toLowerCase() <
                  b.customSortData[colIndex].name.toLowerCase()
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
          {!appStore.fromShopifyApp && (
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
      setFilterChipProps: (colIndex, colName, chip) => {
        return {
          color: 'primary',
          variant: 'outlined',
          className: 'testClass123',
          disabled: filters[1] && chip.value !== filters[1].value || false
        }
      },
      customFilterDialogFooter: (currentFilterList, applyNewFilters) => {
        const { integrationFilter } = this.state;
        return (
          <div style={{ padding: '16px' }}>
            <Button variant="contained" disabled={!integrationFilter} onClick={() => this.handleFilterSubmit(applyNewFilters)}>Apply Filters</Button>
          </div>
        );
      },
      onFilterChipClose: (index, removedFilter) => {
        const removeChips = filters.filter(item => item.value !== removedFilter.value);
        this.setState({ filters: removeChips }, this.makeQuery)
      }
    };

    return (
      <div>
        <PageHeader title="Products" history={history} />
        {loading ? <Loading /> : null}
        <MUIDataTable columns={columns} data={data} options={options} />
        {this.renderTableActionsMenu()}
        <AlertDialog
          open={openConfirmDlg}
          message={`Are you sure you want to remove the product: "${selectedItem ? selectedItem.name : ''}"`}
          handleCancel={this.handleCancelDlg}
          handleConfirm={this.handleConfirmDlg}
        />
        <BulkLinker
          action={bulkLinkerAction}
          open={openPublishDlg}
          fromShopifyApp={appStore.fromShopifyApp}
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
  loading: state.getIn(['product', 'loading']),
  deleted: state.getIn(['product', 'deleted']),
  task: state.getIn(['product', 'task']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onGetIntegrations: bindActionCreators(getIntegrations, dispatch),
  onBulkLinkProducts: bindActionCreators(bulkLinkProducts, dispatch),
  onBulkUnlinkProducts: bindActionCreators(bulkUnlinkProducts, dispatch),
  onDeleteProduct: bindActionCreators(deleteProduct, dispatch),
  onGetAllProducts: bindActionCreators(getProducts, dispatch),
  onGetProductsWithFilters: bindActionCreators(getProductsByIntegration, dispatch),
  onResetDeleteProduct: bindActionCreators(resetDeleteProductFlag, dispatch),
  onUnsubscribeProducts: bindActionCreators(unsubscribeProducts, dispatch),
  onInitBulkEditData: bindActionCreators(initBulkEditData, dispatch),
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
  task: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  appStore: PropTypes.object.isRequired,
  deleted: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  onGetAllProducts: PropTypes.func.isRequired,
  onGetProductsWithFilters: PropTypes.func.isRequired,
  onBulkLinkProducts: PropTypes.func.isRequired,
  onBulkUnlinkProducts: PropTypes.func.isRequired,
  onDeleteProduct: PropTypes.func.isRequired,
  onResetDeleteProduct: PropTypes.func.isRequired,
  onUnsubscribeProducts: PropTypes.func.isRequired,
  onInitBulkEditData: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(ProductListMapped);
