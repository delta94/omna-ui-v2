import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import 'dan-styles/vendors/slick-carousel/slick-carousel.css';
import 'dan-styles/vendors/slick-carousel/slick.css';
import 'dan-styles/vendors/slick-carousel/slick-theme.css';
import styles from './product-jss';
import Properties from './Properties';
import Variants from './Variants';
import ProductInfo from './ProductInfo';
import FormActions from '../Common/FormActions';

function ProductForm(props) {
  const {
    name, price, description, variants, images, integrations = [], variantList, onCancelClick,
  } = props;

  const [selectedIntegration, setSelectedIntegration] = useState('');

  useEffect(() => {
    if(!selectedIntegration) {
      setSelectedIntegration(integrations && integrations.length !== 0 ? integrations[0].id : '');
    }
  }, [integrations]);

  const handleNameChange = (value) => props.onNameChange(value);

  const handlePriceChange = (value) => props.onPriceChange(value);

  const handleDescriptionChange = (value) => props.onDescriptionChange(value);

  const handleIntegrationChange = (value) => {
    setSelectedIntegration(value);
    props.onIntegrationChange(value);
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    props.onSubmitForm();
  };

  return (
    <form noValidate autoComplete="off" onSubmit={onSubmitForm}>
      <ProductInfo
        thumbnail={images.length !== 0 ? images : ['/images/image_placeholder.png']}
        name={name}
        price={price}
        description={description}
        variants={variants}
        onNameChange={handleNameChange}
        onPriceChange={handlePriceChange}
        onDescriptionChange={handleDescriptionChange}
      />
      {integrations && integrations.length > 0 && (
        <Fragment>
          <Properties tabList={integrations} onTabChange={handleIntegrationChange} />
          <Variants variants={variants} variantList={variantList} selectedIntegration={selectedIntegration} />
        </Fragment>
      )}
      <FormActions onCancelClick={onCancelClick} acceptButtonDisabled={!name || !description || !price} />
    </form>
  );
}

ProductForm.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  variants: PropTypes.number,
  variantList: PropTypes.array,
  images: PropTypes.array,
  integrations: PropTypes.array,
  onNameChange: PropTypes.func.isRequired,
  onPriceChange: PropTypes.func.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
  onIntegrationChange: PropTypes.func,
  onCancelClick: PropTypes.func,
  onSubmitForm: PropTypes.func.isRequired
};

ProductForm.defaultProps = {
  variants: 0,
  variantList: [],
  images: [],
  integrations: [],
  onIntegrationChange: () => {},
  onCancelClick: () => {},
};

export default withStyles(styles)(ProductForm);
