import React, {
  useState, useEffect, Fragment
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withSnackbar } from 'notistack';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Badge from '@material-ui/core/Badge';
import Ionicon from 'react-ionicons';
import RefreshIcon from '@material-ui/icons/Refresh';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';

import { createMuiTheme, MuiThemeProvider, makeStyles } from '@material-ui/core/styles';

import MUIDataTable from 'mui-datatables';
import Avatar from '@material-ui/core/Avatar';
import {
  delay, convertListToString, getRemoteIds, getCategoryVariant, updateRowsSelected, emptyArray
} from 'dan-containers/Common/Utils';
import Loading from 'dan-components/Loading';
import FiltersDlg from 'dan-components/Products/FiltersDlg';
import {
  getVariantList, updateFilters, changePage, changeRowsPerPage, changeSearchTerm, resetTable
} from 'dan-actions/variantActions';
import deleteVariant from 'dan-api/services/variants';
import PageHeader from 'dan-containers/Common/PageHeader';
import AlertDialog from 'dan-containers/Common/AlertDialog';
import filterDlgSizeHelper from 'utils/mediaQueries';
import BulkEditVariants from './BulkEditVariants';
import styles from './list-jss';

const getMuiTheme = () => createMuiTheme({
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

const useStyles = makeStyles(styles);

function VariantList(props) {
  const {
    match, loading, variantList, params, onGetVariants,
    history, fromShopifyApp, store, filters, onUpdateFilters, enqueueSnackbar, onChangePage, onChangeRowsPerPage,
    onChangeSearchTerm, onResetTable
  } = props;

  const [openConfirmDlg, setOpenConfirmDlg] = useState();
  const [openBulkEdit, setOpenBulkEdit] = useState(false);
  const [bulkEditParams, setBulkEditParams] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [integrationFilter, setIntegrationFilter] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const { data, pagination } = variantList;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const classes = useStyles();

  const handleSelectedIds = (ids) => setSelectedIds(ids);

  const handleSelectedIndexes = (indexes) => setSelectedIndexes(indexes);

  const page = params.get('offset') / params.get('limit');

  useEffect(() => {
    if (data) {
      updateRowsSelected(data, null, selectedIds, handleSelectedIds, handleSelectedIndexes);
    }
  }, [variantList]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const makeQuery = () => {
    onGetVariants(match.params.id, params.toJS(), enqueueSnackbar);
  };

  useEffect(() => {
    makeQuery();
  }, [params]);

  const handleRefreshTable = () => {
    const emptyParams = isEqual(params.toJS(), {
      offset: 0,
      limit: 10,
      term: '',
      integration_id: '',
      with_details: true,
    });
    emptyParams ? makeQuery() : onResetTable();
  };

  const handleChangeRowsPerPage = rowsPerPage => onChangeRowsPerPage(rowsPerPage);

  const handleChangePage = (pageValue) => onChangePage(pageValue);

  function handleSearch(searchTerm) {
    if (searchTerm) {
      delay(() => onChangeSearchTerm(searchTerm));
    } else if (params.get('term')) {
      onChangeSearchTerm('');
    }
  }

  const handleIntegrationFilterChange = (integation) => setIntegrationFilter(integation);

  const handleFilterSubmit = () => {
    const resultList = [];
    integrationFilter ? resultList[0] = integrationFilter : null;
    onUpdateFilters(resultList);
  };

  const handleResetFilters = () => setIntegrationFilter('');

  const handleConfirmDlg = async () => {
    setIsLoading(true);
    setOpenConfirmDlg(false);
    const response = await deleteVariant({ productId: match.params.id, variantId: selectedItem.id, enqueueSnackbar });
    if (response.data) {
      makeQuery();
    }
    setIsLoading(false);
  };

  const handleCancelDlg = () => setOpenConfirmDlg(false);

  const handleCloseBulkEdit = () => setOpenBulkEdit(false);

  const bulkEditStatus = () => {
    const status = { available: false, tooltip: 'filters must be applied' };
    if (!emptyArray(filters)) {
      status.available = true;
      status.tooltip = 'Bulk edit';
    }
    return status;
  };

  const handleBulkEdit = (event) => {
    const integFilter = filters.get(0);
    if (integFilter) {
      const remoteIds = getRemoteIds(data, selectedIndexes, integFilter, 'variant');
      const category = getCategoryVariant(data, selectedIndexes, integFilter);
      setBulkEditParams({
        remoteIds, integration: integFilter, category, store
      });
      setOpenBulkEdit(true);
    } else setAnchorEl(event.currentTarget);
  };

  const columns = [
    {
      name: 'id',
      options: {
        filter: false,
        display: 'excluded'
      }
    },
    {
      name: 'images',
      label: 'Image',
      options: {
        filter: false,
        viewColumns: false,
        customBodyRender: (value, { columnIndex, rowData }) => {
          const [image] = rowData[columnIndex];
          const imgSrc = image || '/images/image_placeholder_listItem.png';
          return (
            <Avatar
              src={imgSrc}
              className={classes.avatar}
              alt="variant-avatar"
            />
          );
        }
      }
    },
    {
      name: 'sku',
      label: 'Sku',
      options: {
        filter: false,
        viewColumns: false,
      }
    },
    {
      name: 'price',
      label: 'Price',
      options: {
        filter: false,
        customBodyRender: (value) => (
          <div>
            $
            {' '}
            {parseFloat(value).toFixed(2)}
          </div>
        ),
      }
    },
    {
      name: 'quantity',
      label: 'Quantity',
      options: {
        filter: false,
        viewColumns: false,
        customBodyRender: (value) => (
          <Typography noWrap variant="subtitle2" component="p">
            {value}
          </Typography>
        ),
        setCellProps: () => ({ className: classNames(classes.numericTableBodyCell) })
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
          display: () => (
            <FiltersDlg
              integration={integrationFilter}
              onIntegrationChange={handleIntegrationFilterChange}
            />
          )
        },
        customBodyRender: value => convertListToString(value)
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
            onClick={() => setOpenConfirmDlg(true)}
          >
            <DeleteIcon />
          </IconButton>
        )
      }
    }
  ];

  const options = {
    filter: true,
    selectableRows: fromShopifyApp ? 'multiple' : 'none',
    rowsSelected: selectedIndexes,
    selectToolbarPlacement: 'above',
    responsive: 'vertical',
    download: false,
    print: false,
    serverSide: true,
    searchText: params.get('term'),
    searchPlaceholder: 'Search by sku',
    rowsPerPage: params.get('limit'),
    count: get(pagination, 'total', 0),
    page,
    rowHover: true,
    onTableChange: (action, tableState) => {
      switch (action) {
        case 'changePage':
          handleChangePage(tableState.page);
          break;
        case 'changeRowsPerPage':
          handleChangeRowsPerPage(tableState.rowsPerPage);
          break;
        case 'search':
          handleSearch(tableState.searchText);
          break;
        case 'resetFilters':
          handleResetFilters();
          break;
        default:
          break;
      }
    },
    onCellClick: (rowData, { colIndex, dataIndex }) => {
      setSelectedItem(data[dataIndex] || null);
      if (colIndex !== 6) {
        const { pathname } = history.location;
        history.push(`${pathname}/${data[dataIndex].id}/edit-variant`);
      }
    },
    onRowSelectionChange: (rowsSelectedData, allRows, indexList) => {
      updateRowsSelected(data, indexList, null, handleSelectedIds, handleSelectedIndexes);
    },
    customToolbar: () => (
      <Fragment>
        {!fromShopifyApp ? (
          <Tooltip title="add variant">
            <IconButton
              aria-label="add"
              component={Link}
              to={`${history.location.pathname}/add-variant`}
            >
              <Ionicon icon="md-add-circle" />
            </IconButton>
          </Tooltip>
        ) : null}
        <Tooltip title="Reset table">
          <IconButton
            aria-label="refresh"
            onClick={handleRefreshTable}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Fragment>
    ),
    customToolbarSelect: () => (
      <div>
        <Tooltip title={bulkEditStatus().tooltip}>
          <IconButton
            aria-label="edit"
            aria-describedby={anchorEl ? 'simple-popover' : undefined}
            onClick={handleBulkEdit}
          >
            <Badge badgeContent="X" color="error" invisible={bulkEditStatus().available}>
              <EditIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Popover
          id={anchorEl ? 'simple-popover' : undefined}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Typography style={{ padding: '16px' }}>Apply integration filter for bulk edit.</Typography>
        </Popover>
      </div>
    ),
    setFilterChipProps: () => ({
      color: 'primary',
      variant: 'outlined',
      style: { overflow: 'hidden' }
    }),
    customFilterDialogFooter: (currentFilterList, applyNewFilters) => (
      <div style={{ padding: '16px' }}>
        <Button variant="contained" onClick={() => handleFilterSubmit(applyNewFilters)}>Apply Filters</Button>
      </div>
    ),
    onFilterChipClose: (index, removedFilter) => {
      const removeChips = filters.filter(item => item.value !== removedFilter.value);
      onUpdateFilters(removeChips);
    }
  };

  return (
    <div>
      {loading || isLoading ? <Loading /> : null}
      <PageHeader title="Variants" history={history} />
      <MuiThemeProvider theme={getMuiTheme()}>
        <MUIDataTable columns={columns} data={data} options={options} />
      </MuiThemeProvider>
      <AlertDialog
        open={openConfirmDlg}
        message={`Are you sure you want to remove the variant wit SKU: "${get(selectedItem, 'sku')}"?`}
        handleConfirm={handleConfirmDlg}
        handleCancel={handleCancelDlg}
      />
      <BulkEditVariants
        open={openBulkEdit}
        params={bulkEditParams}
        onClose={handleCloseBulkEdit}
      />
    </div>
  );
}

VariantList.propTypes = {
  history: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  fromShopifyApp: PropTypes.bool.isRequired,
  store: PropTypes.string.isRequired,
  variantList: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  onGetVariants: PropTypes.func.isRequired,
  onUpdateFilters: PropTypes.func.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  onChangeSearchTerm: PropTypes.func.isRequired,
  onResetTable: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  variantList: state.getIn(['variant', 'variantList']).toJS(),
  params: state.getIn(['variant', 'params']),
  filters: state.getIn(['variant', 'filters']),
  loading: state.getIn(['variant', 'loading']),
  fromShopifyApp: state.getIn(['user', 'fromShopifyApp']),
  store: state.getIn(['user', 'tenantName']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onGetVariants: bindActionCreators(getVariantList, dispatch),
  onUpdateFilters: bindActionCreators(updateFilters, dispatch),
  onChangePage: bindActionCreators(changePage, dispatch),
  onChangeRowsPerPage: bindActionCreators(changeRowsPerPage, dispatch),
  onChangeSearchTerm: bindActionCreators(changeSearchTerm, dispatch),
  onResetTable: bindActionCreators(resetTable, dispatch),
});

const VariantListMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(VariantList);

export default withSnackbar(VariantListMapped);
