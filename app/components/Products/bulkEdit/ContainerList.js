import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';
import Typography from '@material-ui/core/Typography';
import { Loading } from 'dan-components';
import { getProductsByIntegration } from 'dan-actions/productActions';
import EcommerceList from './EcommerceList';

export const useIsMount = () => {
  const isMountRef = useRef(false);
  useEffect(() => {
    isMountRef.current = true;
  }, []);
  return isMountRef.current;
};

function ContainerList(props) {
  const {
    products: { data, pagination }, category, integration, onRemoteIdListChange, loading
  } = props;

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const isMount = useIsMount();

  const makeQuery = () => {
    const { onGetProducts, enqueueSnackbar } = props;
    const params = {
      limit,
      offset: page * limit,
      category_id: category,
      with_details: true,
    };
    onGetProducts(integration, params, enqueueSnackbar);
  };

  useEffect(() => {
    if (isMount) {
      makeQuery();
    }
  }, [page, limit]);

  const handleChangeRowsPerPage = rowsPerPage => setLimit(rowsPerPage);

  const handleChangePage = (pageValue) => setPage(pageValue);

  return (
    <div>
      {loading ? <Loading /> : null}
      <Typography variant="h6" gutterBottom>
        Select Products
      </Typography>
      <EcommerceList
        data={data}
        integration={integration}
        rowsPerPage={limit}
        page={page}
        count={get(pagination, 'total', 0)}
        onRemoteIdListChange={onRemoteIdListChange}
        onChangeRowsPerPage={handleChangeRowsPerPage}
        onChangePage={handleChangePage}
      />
    </div>
  );
}

ContainerList.defaultProps = {
  integration: undefined,
  category: undefined,
  onRemoteIdListChange: undefined
};

ContainerList.propTypes = {
  products: PropTypes.object.isRequired,
  integration: PropTypes.string,
  category: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  onRemoteIdListChange: PropTypes.func,
  onGetProducts: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  products: state.getIn(['product', 'products']),
  loading: state.getIn(['product', 'loading']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onGetProducts: bindActionCreators(getProductsByIntegration, dispatch),
});

const ContainerListMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContainerList);

export default withSnackbar(ContainerListMapped);
