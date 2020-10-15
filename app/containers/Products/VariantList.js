import React, {
  useState, useEffect, Fragment
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withSnackbar } from 'notistack';
import get from 'lodash/get';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Ionicon from 'react-ionicons';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import MUIDataTable from 'mui-datatables';
import Avatar from '@material-ui/core/Avatar';
import { delay, convertListToString, getRemoteIds, getCategoryVariant } from 'dan-containers/Common/Utils';
import Loading from 'dan-components/Loading';
import FiltersDlg from 'dan-components/Products/FiltersDlg';
import {
  getVariantList, initBulkEditData, updateFilters
} from 'dan-actions/variantActions';
import deleteVariant from 'dan-api/services/variants';
import PageHeader from 'dan-containers/Common/PageHeader';
import AlertDialog from 'dan-containers/Common/AlertDialog';
import filterDlgSizeHelper from 'utils/mediaQueries';

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

function VariantList(props) {
  const {
    match, loading, variantList, onGetVariants, onInitBulkEditData,
    history, fromShopifyApp, filters, onUpdateFilters, enqueueSnackbar
  } = props;
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [openConfirmDlg, setOpenConfirmDlg] = useState();
  const [selectedItem, setSelectedItem] = useState();
  const [selectedIndexList, setSelectedIndexList] = useState([]);
  const [integrationFilter, setIntegrationFilter] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const { data, pagination } = variantList;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const makeQuery = () => {
    const params = {
      limit,
      offset: page * limit,
      term: searchText,
      with_details: true,
      integration_id: filters.get(0) ? filters.get(0).value : undefined
    };
    onGetVariants(match.params.id, params, enqueueSnackbar);
  };

  useEffect(() => {
    makeQuery();
  }, [page, limit, searchText, filters]);

  const handleChangeRowsPerPage = rowsPerPage => setLimit(rowsPerPage);

  const handleChangePage = (pageValue) => {
    setPage(pageValue);
    setSelectedIndexList([]);
  };

  function handleSearch(searchTerm) {
    if (searchTerm) {
      delay(() => setSearchText(searchTerm));
    } else if (searchText) {
      setSearchText('');
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
    if(response.data) {
      makeQuery();
    }
    setIsLoading(false);
  };

  const handleCancelDlg = () => setOpenConfirmDlg(false);

  const handleBulkEdit = (event) => {
    const integFilter = filters.get(0);
    if (integFilter) {
      const remoteIds = getRemoteIds(data, selectedIndexList, filters.get(0), 'variant');
      const categoryId = getCategoryVariant(data, selectedIndexList, filters.get(0));
      onInitBulkEditData({
        remoteIds, integration: filters.get(0), category: categoryId, properties: []
      });
      history.push(`${history.location.pathname}/bulk-edit`);
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
              style={{
                height: 72,
                width: 72,
                marginRight: 16,
                borderRadius: 0
              }}
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
        viewColumns: false
      }
    },
    {
      name: 'quantity',
      label: 'Quantity',
      options: {
        filter: false,
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
        )
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
    rowsSelected: selectedIndexList,
    responsive: 'vertical',
    download: false,
    print: false,
    serverSide: true,
    searchText,
    searchPlaceholder: 'Search by sku',
    rowsPerPage: limit,
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
      setSelectedIndexList(indexList);
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
      </Fragment>
    ),
    customToolbarSelect: () => (
      <div>
        <Tooltip title="Bulk edit">
          <IconButton
            aria-label="edit"
            aria-describedby={anchorEl ? 'simple-popover' : undefined}
            onClick={handleBulkEdit}
          >
            <EditIcon />
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
    </div>
  );
}

VariantList.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  fromShopifyApp: PropTypes.bool.isRequired,
  variantList: PropTypes.object.isRequired,
  filters: PropTypes.object.isRequired,
  onGetVariants: PropTypes.func.isRequired,
  onInitBulkEditData: PropTypes.func.isRequired,
  onUpdateFilters: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  variantList: state.getIn(['variant', 'variantList']).toJS(),
  filters: state.getIn(['variant', 'filters']),
  loading: state.getIn(['variant', 'loading']),
  fromShopifyApp: state.getIn(['user', 'fromShopifyApp']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onGetVariants: bindActionCreators(getVariantList, dispatch),
  onInitBulkEditData: bindActionCreators(initBulkEditData, dispatch),
  onUpdateFilters: bindActionCreators(updateFilters, dispatch)
});

const VariantListMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(VariantList);

export default withSnackbar(VariantListMapped);
