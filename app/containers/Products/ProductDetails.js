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
import { getProductVariantList } from '../../actions/IntegrationActions';

function ProductDetails(props) {
  const {
    history, match, updateProductVariants, productVariants
  } = props;
  const [product, setProduct] = useState(JSON.parse(sessionStorage.getItem(`${match.params.id}`)));
  const [variantList, setVariantList] = useState(productVariants);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    API.get(`products/${match.params.id}`).then(response => {
      const { data } = response.data;
      setProduct(data);
      sessionStorage.setItem(`${match.params.id}`, JSON.stringify(data));
    }).catch((error) => {
      console.log(error);
    }).then(() => {
      setIsLoading(false);
    });
  }, [match.params.id]);

  useEffect(() => {
    if (product) {
      if (product.variants > 0) {
        const integration = product.integrations[0];
        const { id, product: _product } = integration;
        updateProductVariants(id, _product.remote_product_id);
        setVariantList(productVariants);
      }
    }
  }, [product]);

  useEffect(() => {
    setVariantList(productVariants);
  }, [productVariants]);

  return (
    <div>
      {isLoading ? <Loading /> : null}
      <PageHeader title="Product Details" history={history} />
      {product && (
        <ProductForm
          name={product.name}
          price={product.price}
          description={product.description}
          images={product.images}
          integrations={product.integrations}
          history={history}
          variants={product.variants}
          variantList={variantList}
        />
      )}
    </div>
  );
}

ProductDetails.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  // properties: PropTypes.object.isRequired,
  productVariants: PropTypes.object.isRequired,
  updateProductVariants: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  productVariants: state.getIn(['integrations', 'productVariants']),
  // properties: state.getIn(['integrations', 'properties'])
});

const mapDispatchToProps = (dispatch) => ({
  updateProductVariants: bindActionCreators(getProductVariantList, dispatch),
});

const ProductDetailsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductDetails);

export default withStyles(styles)(ProductDetailsMapped);
