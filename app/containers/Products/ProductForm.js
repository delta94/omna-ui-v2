import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import 'dan-styles/vendors/slick-carousel/slick-carousel.css';
import 'dan-styles/vendors/slick-carousel/slick.css';
import 'dan-styles/vendors/slick-carousel/slick-theme.css';
import styles from './product-jss';
import Properties from './Properties';
import Variants from './Variants';
import ProductInfo from './ProductInfo';
import { getProductVariantList, setProduct } from '../../actions/IntegrationActions';

function ProductForm(props) {
  const {
    name, price, description, variants, images, integrations,
    updateProductVariants, variantList, updateProduct, product
  } = props;

  const [selectedIntegration, setSelectedIntegration] = useState('');

  useEffect(() => {
    setSelectedIntegration(integrations ? integrations[0].id : '');
  }, [integrations]);

  const handleTabChange = (index) => {
    const { id, product: _product } = product.integrations[index];
    setSelectedIntegration(id);
    updateProductVariants(id, _product.remote_product_id);
  };

  const handleNameChange = (value) => updateProduct({ ...product, name: value });

  const handlePriceChange = (value) => updateProduct({ ...product, price: value });

  const handleDescriptionChange = (value) => updateProduct({ ...product, description: value });


  return (
    <div>
      {product && (
        <Fragment>
          <ProductInfo
            thumbnail={images.length !== 0 ? images : ['/images/image_placeholder.png']}
            name={name}
            description={description}
            price={price}
            variants={variants}
            onNameChange={handleNameChange}
            onPriceChange={handlePriceChange}
            onDescriptionChange={handleDescriptionChange}
          />
          <Properties tabList={integrations} onTabChange={handleTabChange} />
          <Variants variantList={variantList} selectedIntegration={selectedIntegration} />
        </Fragment>
      )}
    </div>
  );
}

ProductForm.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  variants: PropTypes.string.isRequired,
  variantList: PropTypes.array.isRequired,
  images: PropTypes.array.isRequired,
  integrations: PropTypes.array.isRequired,
  updateProduct: PropTypes.func.isRequired,
  product: PropTypes.object,
  updateProductVariants: PropTypes.func.isRequired
};

ProductForm.defaultProps = {
  product: null
};

const mapStateToProps = state => ({
  product: state.getIn(['integrations', 'product']),
  ...state
});

const mapDispatchToProps = (dispatch) => ({
  updateProductVariants: bindActionCreators(getProductVariantList, dispatch),
  updateProduct: bindActionCreators(setProduct, dispatch),
});

const ProductFormMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductForm);

export default withStyles(styles)(ProductFormMapped);
