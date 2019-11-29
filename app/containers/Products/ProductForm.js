import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import 'dan-styles/vendors/slick-carousel/slick-carousel.css';
import 'dan-styles/vendors/slick-carousel/slick.css';
import 'dan-styles/vendors/slick-carousel/slick-theme.css';
import styles from 'dan-components/Product/product-jss';
import ProductCard from './ProductCard';
import ProductDesc from './ProductDesc';

function ProductForm(props) {
  const {
    name, images, price, description, integrations, variants,
  } = props;

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

  return (
    <div>
      <ProductCard
        thumbnail={images.length > 0 ? images[0] : '/images/screen/no-image.png'}
        name={name}
        desc={description}
        price={price}
        list
      />
      <ProductDesc tabList={[...integrations]} variants={variants} />
    </div>
  );
}

ProductForm.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string,
  images: PropTypes.array.isRequired,
  integrations: PropTypes.array.isRequired,
  variants: PropTypes.object.isRequired
};

ProductForm.defaultProps = {
  description: ''
};

export default withStyles(styles)(ProductForm);
