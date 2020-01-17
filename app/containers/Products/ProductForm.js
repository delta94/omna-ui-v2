import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import 'dan-styles/vendors/slick-carousel/slick-carousel.css';
import 'dan-styles/vendors/slick-carousel/slick.css';
import 'dan-styles/vendors/slick-carousel/slick-theme.css';
import styles from './product-jss';
import ProductCard from './ProductCard';
import Properties from './Properties';
import Wysiwyg from './Wysiwyg';
import Variants from './Variants';
import { getProductVariantList } from '../../actions/IntegrationActions';

function ProductForm(props) {
  const {
    name, images, price, description, integrations, variants, updateProductVariants
  } = props;
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedTabValue, setSelectedTabValue] = useState('');


  useEffect(() => {
    const { id, product } = integrations[selectedTabIndex];
    updateProductVariants(id, product.remote_product_id);
    setSelectedTabValue(id);
  }, [selectedTabIndex]);

  /*   const getThumb = product ? product.images.map(a => a.src) : null;

  const settings = {
    customPaging: (i) => (
      <a>
        <img src={getThumb[i]} alt="thumb" />
      </a>
    ),
    infinite: true,
    dots: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  }; */

  const handleTabChange = (index) => {
    setSelectedTabIndex(index);
    const { id, product: _product } = integrations[index];
    updateProductVariants(id, _product.remote_product_id);
  };

  return (
    <div>
      <ProductCard
        thumbnail={images.length > 0 ? images[0] : '/images/image_placeholder.png'}
        name={name}
        desc={description}
        price={price}
        variants={variants}
        list
      />
      <Wysiwyg text={description} />
      <Properties tabList={integrations} onTabChange={handleTabChange} />
      <Variants selectedTab={selectedTabValue} />
    </div>
  );
}

ProductForm.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string,
  images: PropTypes.array.isRequired,
  integrations: PropTypes.array.isRequired,
  variants: PropTypes.number.isRequired,
  updateProductVariants: PropTypes.func.isRequired
};

ProductForm.defaultProps = {
  description: ''
};

const mapDispatchToProps = (dispatch) => ({
  updateProductVariants: bindActionCreators(getProductVariantList, dispatch),
});

const ProductFormMapped = connect(
  null,
  mapDispatchToProps
)(ProductForm);

export default withStyles(styles)(ProductFormMapped);
