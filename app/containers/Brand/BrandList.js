import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import MUIDataTable from 'mui-datatables';
import Loading from 'dan-components/Loading';
import { delay } from 'dan-containers/Common/Utils';

import { getBrandList } from 'dan-actions/brandActions';
import get from 'lodash/get';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PageHeader from 'dan-containers/Common/PageHeader';
import AlertDialog from 'dan-containers/Common/AlertDialog';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const getMuiTheme = () => createMuiTheme({
  overrides: {
    MUIDataTableBodyCell: {
      root: {
        cursor: 'pointer'
      }
    }
  }
});

function BrandList(props) {

  const {
    match, loading, brandList, onGetBrands, history, enqueueSnackbar
  } = props;
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [serverSideFilterList, setServerSideFilterList] = useState([]);
  // const [openConfirmDlg, setOpenConfirmDlg] = useState();
  // const [selectedItem, setSelectedItem] = useState();

  const { data, pagination } = brandList;

  const makeQuery = () => {
    const params = {
      limit,
      offset: page * limit,
      term: searchText
    };
    onGetBrands(match.params.integration_id, params, enqueueSnackbar);

    // onGetBrands('playstoretestingone_lazadasg', params, enqueueSnackbar);
  };

  useEffect(() => {
    makeQuery();
  }, [page, limit, searchText, serverSideFilterList]);

  // useEffect(() => {
  //   onGetBrands({ params: { offset: 0, limit: 100 } });
  // }, []);


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

  // const handleConfirmDlg = () => {
  //   const { onDeleteVariant } = props;
  //   onDeleteVariant(match.params.id, selectedItem.id, enqueueSnackbar);
  //   setOpenConfirmDlg(false);
  // };

  // const handleCancelDlg = () => setOpenConfirmDlg(false);

  const columns = [
    {
      name: 'name',
      label: 'Brand Name',
      options: {
        filter: false,
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
    searchPlaceholder: 'Search by name',
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
    }
  };

  return (
    <div>
      {loading ? <Loading /> : null}
      <PageHeader title="Brands" history={history} />
      <MuiThemeProvider theme={getMuiTheme()}>
        <MUIDataTable columns={columns} data={data} options={options} />
      </MuiThemeProvider>
      <AlertDialog
      />
    </div>
  );
}


BrandList.propTypes = {
  // enqueueSnackbar: PropTypes.func.isRequired
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  brandList: PropTypes.object.isRequired,
  onGetBrands: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  brandList: state.getIn(['brand', 'brandList']).toJS(),
  loading: state.getIn(['brand', 'loading']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onGetBrands: bindActionCreators(getBrandList, dispatch)
});


const BrandMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(BrandList);

export default withSnackbar(BrandMapped);
