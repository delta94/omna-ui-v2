import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import MUIDataTable from 'mui-datatables';
import Loading from 'dan-components/Loading';
import { delay } from 'dan-containers/Common/Utils';

import { getCategoryList } from 'dan-actions/categoryAction';
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

function CategoryList(props) {
  const {
    match, loading, categoryList, onGetCategory, history, enqueueSnackbar
  } = props;

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState('');
  const [serverSideFilterList, setServerSideFilterList] = useState([]);

  const { data, pagination } = categoryList;

  const makeQuery = () => {
    const params = {
      limit,
      offset: page * limit,
      term: searchText
    };
    onGetCategory(match.params.integration_id, params, enqueueSnackbar);
  };

  useEffect(() => {
    makeQuery();
  }, [page, limit, searchText, serverSideFilterList]);

  const handleChangeRowsPerPage = rowsPerPage => setLimit(rowsPerPage);

  const handleChangePage = (pageValue) => setPage(pageValue);

  function handleSearch(searchTerm) {
    if (searchTerm) {
      delay(() => setSearchText(searchTerm));
    } else if (searchText) {
      setSearchText('');
    }
  }

  const handleFilterChange = filterList => (filterList ? setServerSideFilterList(filterList) : setServerSideFilterList([]));

  const handleResetFilters = () => (serverSideFilterList.length > 0 ? setServerSideFilterList([]) : null);

  const columns = [
    {
      name: 'name',
      label: 'Name',
      options: {
        filter: false,
      }
    },
    {
      name: 'updated_at',
      label: 'Updated at',
      options: {
        filter: false,
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
      <PageHeader title="Categories" history={history} />
      <MuiThemeProvider theme={getMuiTheme()}>
        <MUIDataTable columns={columns} data={data} options={options} />
      </MuiThemeProvider>
      <AlertDialog />
    </div>
  );
}


CategoryList.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  categoryList: PropTypes.object.isRequired,
  onGetCategory: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  categoryList: state.getIn(['category', 'categoryList']).toJS(),
  loading: state.getIn(['category', 'loading']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onGetCategory: bindActionCreators(getCategoryList, dispatch)
});


const CategoryMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryList);

export default withSnackbar(CategoryMapped);
