import React, { useState, useEffect, Fragment } from 'react';
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
  const { updateProductVariants, product } = props;
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);
  const [selectedTabValue, setSelectedTabValue] = useState('');


  useEffect(() => {
    if (product) {
      const { id, product: _product } = product.integrations[selectedTabIndex];
      updateProductVariants(id, _product.remote_product_id);
      setSelectedTabValue(id);
    }
  }, [product]);

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
    const { id, product: _product } = product.integrations[index];
    updateProductVariants(id, _product.remote_product_id);
  };

  const handleTextEditorChange = (e) => {
    product.description = e.target.value;
  };

  return (
    <div>
      {product && (
        <Fragment>
          <ProductCard
            thumbnail={product.images.length > 0 ? product.images[0] : '/images/image_placeholder.png'}
            name={product.name}
            desc={product.description}
            price={product.price}
            variants={product.variants}
            list
          />
          <Wysiwyg text={product.description} onTextEditorChange={handleTextEditorChange} />
          <Properties tabList={product.integrations} onTabChange={handleTabChange} />
          <Variants selectedTab={selectedTabValue} />
        </Fragment>
      )}
    </div>
  );
}

ProductForm.propTypes = {
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
});

const ProductFormMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductForm);

export default withStyles(styles)(ProductFormMapped);
