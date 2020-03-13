import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';

import { withStyles } from '@material-ui/core/styles';
import 'dan-styles/vendors/slick-carousel/slick-carousel.css';
import 'dan-styles/vendors/slick-carousel/slick.css';
import 'dan-styles/vendors/slick-carousel/slick-theme.css';
import Loading from 'dan-components/Loading';

import styles from './product-jss';

import API from '../Utils/api';
import PageHeader from '../Common/PageHeader';
import ProductForm from './ProductForm';

function AddProduct(props) {
  const { history } = props;
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdd = async () => {
    const { enqueueSnackbar } = props;
    const data = { name, price: parseFloat(price), description };
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
        onNameChange={(e) => setName(e)}
        onPriceChange={(e) => setPrice(e)}
        onDescriptionChange={(e) => setDescription(e)}
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