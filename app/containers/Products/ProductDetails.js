import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import 'dan-styles/vendors/slick-carousel/slick-carousel.css';
import 'dan-styles/vendors/slick-carousel/slick.css';
import 'dan-styles/vendors/slick-carousel/slick-theme.css';
import Loading from 'dan-components/Loading';

import styles from './product-jss';

import API from '../Utils/api';
import PageHeader from '../Common/PageHeader';
import ProductForm from './ProductForm';
import { setProduct } from '../../actions/IntegrationActions';

function ProductDetails(props) {
  const {
    history, match, getProduct
  } = props;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    API.get(`products/${match.params.id}`)
      .then(response => {
        const { data } = response.data;
        getProduct(data);
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => {
        setIsLoading(false);
      });
  }, [match.params.id]);

  return (
    <div>
      {isLoading ? <Loading /> : null}
      <PageHeader title="Product Details" history={history} />
      <ProductForm history={history} />
    </div>
  );
}

ProductDetails.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  getProduct: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  product: state.getIn(['integrations', 'product']),
  ...state
});

const mapDispatchToProps = (dispatch) => ({
  getProduct: bindActionCreators(setProduct, dispatch),
});

const ProductDetailsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductDetails);

export default withStyles(styles)(ProductDetailsMapped);
