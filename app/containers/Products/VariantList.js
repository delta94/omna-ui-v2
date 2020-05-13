import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';
import MUIDataTable from 'mui-datatables';

import { withStyles } from '@material-ui/core/styles';
import 'dan-styles/vendors/slick-carousel/slick-carousel.css';
import 'dan-styles/vendors/slick-carousel/slick.css';
import 'dan-styles/vendors/slick-carousel/slick-theme.css';
import Avatar from '@material-ui/core/Avatar';
import { delay } from 'dan-containers/Common/Utils';
import Loading from 'dan-components/Loading';

import { getProductVariantList } from 'dan-actions/productActions';
import PageHeader from 'dan-containers/Common/PageHeader';
import styles from 'dan-components/Products/product-jss';

function VariantList(props) {
  const { match, loading, variantList, onGetVariants, history, enqueueSnackbar } = props;
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
          <div>$ {' '} {parseFloat(value).toFixed(2)}</div>
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
    }
  };

  return (
    <div>
      {loading ? <Loading /> : null}
      <PageHeader title="Variants" history={history} />
      <MUIDataTable columns={columns} data={data} options={options} />
    </div>
  );
}

VariantList.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  variantList: PropTypes.object.isRequired,
  onGetVariants: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  variantList: state.getIn(['product', 'variantList']),
  loading: state.getIn(['product', 'loading']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onGetVariants: bindActionCreators(getProductVariantList, dispatch)
});

const VariantListMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(VariantList);

export default withStyles(styles)(withSnackbar(VariantListMapped));
