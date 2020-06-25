import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';

import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import Ionicon from 'react-ionicons';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import MUIDataTable from 'mui-datatables';
import Avatar from '@material-ui/core/Avatar';
import { delay } from 'dan-containers/Common/Utils';
import Loading from 'dan-components/Loading';

import { getVariantList, deleteVariant } from 'dan-actions/variantActions';
import { getIntegrations } from 'dan-actions/integrationActions';
import PageHeader from 'dan-containers/Common/PageHeader';
import AlertDialog from 'dan-containers/Common/AlertDialog';
import ChipsArray from 'dan-components/ChipsArray/index';

const getMuiTheme = () => createMuiTheme({
  overrides: {
    MUIDataTableBodyCell: {
      root: {
        cursor: 'pointer'
      }
    }
  }
});

function VariantList(props) {
  const {
    match, loading, integrations, variantList, onGetVariants, onGetIntegrations, history, appStore, enqueueSnackbar
  } = props;
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [serverSideFilterList, setServerSideFilterList] = useState([]);
  const [openConfirmDlg, setOpenConfirmDlg] = useState();
  const [selectedItem, setSelectedItem] = useState();

  const { data, pagination } = variantList;

  const makeQuery = () => {
    const params = {
      limit,
      offset: page * limit,
      term: searchText,
      with_details: true,
      integration_id: serverSideFilterList[5] && serverSideFilterList[5][0] ? integrations.data.find(item => item.name === serverSideFilterList[5][0]).id : ''
    };
    onGetVariants(match.params.id, params, enqueueSnackbar);
  };

  useEffect(() => {
    makeQuery();
  }, [page, limit, searchText, serverSideFilterList]);

  useEffect(() => {
    onGetIntegrations({ params: { offset: 0, limit: 100 } });
  }, []);

  const handleChangeRowsPerPage = rowsPerPage => setLimit(rowsPerPage);

  const handleChangePage = (pageValue) => setPage(pageValue);

  function handleSearch(searchTerm) {
    if (searchTerm) {
      delay(searchTerm, () => setSearchText(searchTerm));
    } else if (searchText) {
      setSearchText('');
    }
  }

  const handleFilterChange = filterList => (filterList ? setServerSideFilterList(filterList) : setServerSideFilterList([]));

  const handleResetFilters = () => (serverSideFilterList.length > 0 ? setServerSideFilterList([]) : null);

  const handleConfirmDlg = () => {
    const { onDeleteVariant } = props;
    onDeleteVariant(match.params.id, selectedItem.id, enqueueSnackbar);
    setOpenConfirmDlg(false);
  };

  const handleCancelDlg = () => setOpenConfirmDlg(false);

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
        filterType: 'dropdown',
        filterList: serverSideFilterList[5],
        filterOptions: {
          names: integrations.data.map(item => item.name),
        },
        customBodyRender: value => <ChipsArray items={value} />
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
    selectableRows: 'none',
    responsive: 'stacked',
    download: false,
    print: false,
    serverSide: true,
    searchText,
    searchPlaceholder: 'Search by sku',
    serverSideFilterList,
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
        case 'filterChange':
          handleFilterChange(tableState.filterList);
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
      if (colIndex !== 5) {
        const { pathname } = history.location;
        history.push(`${pathname}/${data[dataIndex].id}`);
      }
    },
    customToolbar: () => (
      <Fragment>
        {!appStore.fromShopifyApp ? (
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
    )
  };

  return (
    <div>
      {loading ? <Loading /> : null}
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
  integrations: PropTypes.object.isRequired,
  appStore: PropTypes.object.isRequired,
  variantList: PropTypes.object.isRequired,
  onGetVariants: PropTypes.func.isRequired,
  onGetIntegrations: PropTypes.func.isRequired,
  onDeleteVariant: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  variantList: state.getIn(['variant', 'variantList']).toJS(),
  integrations: state.getIn(['integration', 'integrations']).toJS(),
  loading: state.getIn(['variant', 'loading']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onGetVariants: bindActionCreators(getVariantList, dispatch),
  onGetIntegrations: bindActionCreators(getIntegrations, dispatch),
  onDeleteVariant: bindActionCreators(deleteVariant, dispatch)
});

const VariantListMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(VariantList);

export default withSnackbar(VariantListMapped);
