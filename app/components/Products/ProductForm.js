import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import 'dan-styles/vendors/slick-carousel/slick-carousel.css';
import 'dan-styles/vendors/slick-carousel/slick.css';
import 'dan-styles/vendors/slick-carousel/slick-theme.css';
import FormActions from 'dan-containers/Common/FormActions';
import Properties from './Properties';
import Variants from './Variants';
import ProductInfo from './ProductInfo';

function ProductForm(props) {
  const {
    name, price, description, variants, images, integrations = [], variantList, selectedIntegration,
    onIntegrationChange, onCancelClick,
  } = props;

  const [dirtyProps, setDirtyProps] = useState(false);

  const handleNameChange = (value) => props.onNameChange(value);

  const handlePriceChange = (value) => props.onPriceChange(value);

  const handleDescriptionChange = (value) => props.onDescriptionChange(value);

  const onSubmitForm = (e) => {
    e.preventDefault();
    setDirtyProps(false);
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
          <Properties
            tabList={integrations}
            dirtyProps={dirtyProps}
            onChangeProps={(e) => setDirtyProps(e)}
            onTabChange={(e) => onIntegrationChange(e)}
          />
          <Variants
            variantList={variantList}
            selectedIntegration={selectedIntegration || integrations[0]}
          />
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
  variantList: PropTypes.any,
  images: PropTypes.array,
  integrations: PropTypes.array,
  selectedIntegration: PropTypes.object,
  onNameChange: PropTypes.func.isRequired,
  onPriceChange: PropTypes.func.isRequired,
  onDescriptionChange: PropTypes.func.isRequired,
  onIntegrationChange: PropTypes.func,
  onCancelClick: PropTypes.func,
  onSubmitForm: PropTypes.func.isRequired
};

ProductForm.defaultProps = {
  variants: null,
  variantList: [],
  images: [],
  integrations: [],
  selectedIntegration: null,
  onIntegrationChange: () => {},
  onCancelClick: () => {},
};

export default ProductForm;
