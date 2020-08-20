import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';

import { withStyles } from '@material-ui/core/styles';
import 'dan-styles/vendors/slick-carousel/slick-carousel.css';
import 'dan-styles/vendors/slick-carousel/slick.css';
import 'dan-styles/vendors/slick-carousel/slick-theme.css';
import Loading from 'dan-components/Loading';
import API from 'dan-containers/Utils/api';
import PageHeader from 'dan-containers/Common/PageHeader';
import ProductForm from 'dan-components/Products/ProductForm';
import styles from 'dan-components/Products/product-jss';

function AddProduct(props) {
  const { history } = props;
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [dimension, setDimension] = useState({
    weight: undefined,
    height: undefined,
    width: undefined,
    length: undefined,
    content: '',
    overwrite: undefined
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleDimensionChange = e => setDimension((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));

  const handleAdd = async () => {
    const { enqueueSnackbar } = props;
    const data = { name, price: parseFloat(price), description, package: dimension };
    setIsLoading(true);
    try {
      await API.post('/products', { data });
      history.goBack();
      enqueueSnackbar('Product created successfuly', {
        variant: 'success'
      });
    } catch (error) {
      if (error && error.response.data.message) {
        enqueueSnackbar(error.response.data.message, {
          variant: 'error'
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? <Loading /> : null}
      <PageHeader title="Add product" history={history} />
      <ProductForm
        name={name}
        price={price}
        description={description}
        dimension={dimension}
        action="add"
        onNameChange={(e) => setName(e)}
        onPriceChange={(e) => setPrice(e)}
        onDescriptionChange={(e) => setDescription(e)}
        onDimensionChange={handleDimensionChange}
        onCancelClick={() => history.goBack()}
        onSubmitForm={handleAdd}
      />
    </div>
  );
}

AddProduct.propTypes = {
  history: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withStyles(styles)(withSnackbar(AddProduct));
