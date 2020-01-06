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
  const [product, setProduct] = useState();
  const [variants, setVariants] = useState(productVariants);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // caching product
    // if (!localStorage.getItem(`${match.params.id}`)) {
    setIsLoading(true);
    API.get(`products/${match.params.id}`).then(response => {
      const { data } = response.data;
      // testing images
      /* if (data.images.length === 0) {
        data.images = [{ src: 'https://cdn.shopify.com/s/files/1/0042/2815/3413/products/white.jpg?v=1567575315' },
        { src: 'https://cdn.shopify.com/s/files/1/0042/2815/3413/products/dress.jpg?v=1567575315' }];
      } */
      setProduct(data);
      localStorage.setItem(`${match.params.id}`, JSON.stringify(data));
    }).catch((error) => {
      console.log(error);
    }).then(() => {
      setIsLoading(false);
    });
    // }
  }, [match.params.id]);

  useEffect(() => {
    if (product) {
      if (product.variants > 0) {
        const integration = product.integrations[0];
        const { id, product: _product } = integration;
        updateProductVariants(id, _product.remote_product_id);
        setVariants(productVariants);
      }
    }
  }, [product]);

  useEffect(() => {
    setVariants(productVariants);
  }, [productVariants]);

  /*   useEffect(() => {
    if (properties) {
      const { tabIndex, values } = properties;
      const temp = product;
      temp.integrations[tabIndex].product.properties = values;
      setProduct(temp);
    }
  }, [properties]); */

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
          variants={variants}
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
