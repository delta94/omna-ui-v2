import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import 'dan-styles/vendors/slick-carousel/slick-carousel.css';
import 'dan-styles/vendors/slick-carousel/slick.css';
import 'dan-styles/vendors/slick-carousel/slick-theme.css';
import styles from './product-jss';
import Properties from './Properties';
import Variants from './Variants';
import ProductInfo from './ProductInfo';

function ProductForm(props) {
  const {
    name, price, description, variants, images, integrations, variantList
  } = props;

  const [selectedIntegration, setSelectedIntegration] = useState('');

  useEffect(() => {
    setSelectedIntegration(integrations && integrations.length !== 0 ? integrations[0].id : '');
  }, [integrations]);

  const handleNameChange = (value) => props.onNameChange(value);

  const handlePriceChange = (value) => props.onPriceChange(value);

  const handleDescriptionChange = (value) => props.onDescriptionChange(value);

  const handleIntegrationsChange = (value) => {
    setSelectedIntegration(integrations[value].id);
    props.onIntegrationsChange(value);
  };

  return (
    <div>
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
      <Properties tabList={integrations} onTabChange={handleIntegrationsChange} />
      <Variants variants={variants} variantList={variantList} selectedIntegration={selectedIntegration} />
    </div>
  );
}

ProductForm.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  variants: PropTypes.number.isRequired,
  variantList: PropTypes.array.isRequired,
  images: PropTypes.array.isRequired,
  integrations: PropTypes.array,
  onNameChange: PropTypes.func.isRequired,
  onPriceChange: PropTypes.func.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
  onIntegrationsChange: PropTypes.func.isRequired
};

ProductForm.defaultProps = {
  product: null,
  integrations: []
};

export default withStyles(styles)(ProductForm);
