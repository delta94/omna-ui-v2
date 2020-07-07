import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withSnackbar } from 'notistack';
import get from 'lodash/get';
import Ionicon from 'react-ionicons';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { Link } from 'react-router-dom';
import Tooltip from '@material-ui/core/Tooltip';

import { Avatar, Typography, ListItemIcon } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import MUIDataTable from 'mui-datatables';
import { Loading } from 'dan-components';
import { getIntegrations } from 'dan-actions/integrationActions';

import ChipsArray from 'dan-components/ChipsArray';
import {
  getProducts,
  bulkLinkProducts,
  bulkUnlinkProducts,
  deleteProduct,
  resetDeleteProductFlag
} from 'dan-actions/productActions';
import { getCurrencySymbol } from 'dan-containers/Common/Utils';
import PageHeader from 'dan-containers/Common/PageHeader';
import AlertDialog from 'dan-containers/Common/AlertDialog';
import ToolbarActions from 'dan-components/Products/ToolbarActions';
import BulkLinker from 'dan-components/Products/BulkLinker';

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

class ProductList extends React.Component {
  state = {
    limit: 10,
    page: 0,
    serverSideFilterList: [],
    searchTerm: '',
    rowsSelected: [],
    rowsSelectedIds: [],
    anchorEl: null,
    selectedItem: null,
    bulkLinkerAction: 'link',
    openPublisherDlg: false,
    openConfirmDlg: false
  };

  componentDidMount() {
    const { onGetIntegrations } = this.props;
    onGetIntegrations({ params: { offset: 0, limit: 100 } });
    this.callAPI();
  }

  componentDidUpdate(prevProps) {
    const { deleted, onResetDeleteProduct, task, history } = this.props;
    if (deleted && deleted !== prevProps.deleted) {
      onResetDeleteProduct();
      this.callAPI();
    }
    if (task && task !== prevProps.task) {
      history.push(`tasks/${task.id}`);
    }
  }

  callAPI = () => {
    const { integrations, onGetProducts, enqueueSnackbar } = this.props;
    const { searchTerm, limit, page, serverSideFilterList } = this.state;

    const params = {
      offset: page * limit,
      limit,
      term: searchTerm || '',
      with_details: true,
      integration_id: serverSideFilterList[3] && serverSideFilterList[3][0] ? integrations.data.find(item => item.name === serverSideFilterList[3][0]).id : ''
    };
    onGetProducts({ params, enqueueSnackbar });
  };

  updateRowsSelectedIds = (rowsSelectedData, allRows, data) => {
    const { rowsSelectedIds } = this.state;
    const selectedIndex = rowsSelectedData[0].dataIndex || 0;
    const selectedId = data[selectedIndex].id;
    const row = allRows.findIndex(item => item === rowsSelectedData[0]);
    if (row >= 0) {
      rowsSelectedIds.push(selectedId);
    } else {
      const deleteIndex = rowsSelectedIds.findIndex(item => item === selectedId);
      rowsSelectedIds.splice(deleteIndex, 1);
    }
    this.setState({ rowsSelectedIds });
  };

  handleChangePage = (page, searchTerm) => {
    this.setState({ page, searchTerm }, this.callAPI);
    this.setState({ rowsSelected: [] });
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
              <Ionicon icon="md-trash" />
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
      serverSideFilterList,
      searchTerm,
      rowsSelected,
      bulkLinkerAction,
      openPublisherDlg: openPublishDlg,
      openConfirmDlg,
      selectedItem
    } = this.state;
    const { classes, history, products, integrations, loading, appStore } = this.props;
    const { pagination, data } = products;
    const count = get(pagination, 'total', 0);

    const columns = [
      {
        name: 'images',
        options: {
          filter: false,
          display: 'excluded'
        }
      },
      {
        name: 'name',
        label: 'Product',
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => {
            const [images, name] = tableMeta.rowData;
            const imgSrc =
              images.length > 0
                ? images[0]
                : '/images/image_placeholder_listItem.png';
            return (
              <div style={{ display: 'flex', alignItems: 'center' }}>
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
                <Typography noWrap variant="subtitle2" component="p">
                  {name}
                </Typography>
              </div>
            );
          }
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
          filterType: 'dropdown',
          filterList: serverSideFilterList[3],
          filterOptions: {
            names: integrations.data.map(item => item.name),
          },
          customBodyRender: value => <ChipsArray items={value} />
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
      rowsSelected,
      responsive: 'vertical',
      rowHover: true,
      download: false,
      print: false,
      serverSide: true,
      searchText: searchTerm,
      serverSideFilterList,
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
      onCellClick: (rowData, { colIndex, dataIndex }) => {
        this.setState({ selectedItem: data[dataIndex] });
        if (colIndex !== 5) {
          history.push(`/products/${data[dataIndex].id}/edit-product`);
        }
      },
      onRowSelectionChange: (rowsSelectedData, allRows, rowsSelectedIndex) => {
        this.setState({ rowsSelected: rowsSelectedIndex });
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
          {!appStore.fromShopifyApp ? (
            <Tooltip title="add">
              <IconButton
                aria-label="add"
                component={Link}
                to="/products/add-product"
              >
                <Ionicon icon="md-add-circle" />
              </IconButton>
            </Tooltip>
          ) : null}
        </Fragment>
      ),
      customToolbarSelect: () => (
        <ToolbarActions
          onLink={this.handleBulkLink}
          onUnlink={this.handleBulkUnlink}
        />
      )
    };

    return (
      <div>
        <PageHeader title="Products" history={history} />
        <div className={classes.table}>
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
  onGetProducts: bindActionCreators(getProducts, dispatch),
  onResetDeleteProduct: bindActionCreators(resetDeleteProductFlag, dispatch)
});

const ProductListMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductList);

ProductList.defaultProps = {
  task: null
};

ProductList.propTypes = {
  classes: PropTypes.object.isRequired,
  products: PropTypes.object.isRequired,
  integrations: PropTypes.object.isRequired,
  task: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  appStore: PropTypes.object.isRequired,
  deleted: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  onGetProducts: PropTypes.func.isRequired,
  onGetIntegrations: PropTypes.func.isRequired,
  onBulkLinkProducts: PropTypes.func.isRequired,
  onBulkUnlinkProducts: PropTypes.func.isRequired,
  onDeleteProduct: PropTypes.func.isRequired,
  onResetDeleteProduct: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(withStyles(styles)(ProductListMapped));
