import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';

import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import Ionicon from 'react-ionicons';
import Tooltip from '@material-ui/core/Tooltip';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import MUIDataTable from 'mui-datatables';
import Avatar from '@material-ui/core/Avatar';
import { delay } from 'dan-containers/Common/Utils';
import Loading from 'dan-components/Loading';

import { getVariantList } from 'dan-actions/variantActions';
import PageHeader from 'dan-containers/Common/PageHeader';

const getMuiTheme = () => createMuiTheme({
  overrides: {
    MUIDataTableBodyCell: {
      root: {
        cursor: 'pointer'
      }
    }
  }
})

function VariantList(props) {
  const { match, loading, variantList, onGetVariants, history, appStore, enqueueSnackbar } = props;
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState('');

  const { data, pagination } = variantList;

  const makeQuery = () => {
    const params = {
      limit,
      offset: page * limit,
      term: searchText,
      with_details: true
    };
    onGetVariants(match.params.id, params, enqueueSnackbar);
  };

  useEffect(() => {
    makeQuery();
  }, [page, limit, searchText]);

  const handleChangeRowsPerPage = rowsPerPage => setLimit(rowsPerPage);

  const handleChangePage = (pageValue) => setPage(pageValue);

  function handleSearch(searchTerm) {
    if (searchTerm) {
      delay(searchTerm, () => setSearchText(searchTerm));
    } else if (searchText) {
      setSearchText('');
    }
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
  ];

  const options = {
    filter: false,
    selectableRows: 'none',
    responsive: 'stacked',
    download: false,
    print: false,
    serverSide: true,
    searchText,
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
        default:
          break;
      }
    },
    onCellClick: (rowData, { dataIndex }) => {
      const { pathname } = history.location;
      history.push(`${pathname}/${data[dataIndex].id}`);
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
    </div>
  );
}

VariantList.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  appStore: PropTypes.object.isRequired,
  variantList: PropTypes.object.isRequired,
  onGetVariants: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  variantList: state.getIn(['variant', 'variantList']),
  loading: state.getIn(['variant', 'loading']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onGetVariants: bindActionCreators(getVariantList, dispatch)
});

const VariantListMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(VariantList);

export default withSnackbar(VariantListMapped);
