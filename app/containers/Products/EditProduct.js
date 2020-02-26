import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import 'dan-styles/vendors/slick-carousel/slick-carousel.css';
import 'dan-styles/vendors/slick-carousel/slick.css';
import 'dan-styles/vendors/slick-carousel/slick-theme.css';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import Loading from 'dan-components/Loading';

import styles from './product-jss';

import API from '../Utils/api';
import PageHeader from '../Common/PageHeader';
import ProductForm from './ProductForm';
import { getProductVariantList } from '../../actions/IntegrationActions';

function EditProduct(props) {
  const {
    match, classes, productVariants, updateProductVariants, history
  } = props;
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState(null);
  const [description, setDescription] = useState(null);
  const [variants, setVariants] = useState(null);
  const [integrations, setIntegrations] = useState(null);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      try {
        const response = await API.get(`products/${match.params.id}`);
        const { data } = response.data;
        setId(data.id);
        setName(data.name);
        setPrice(data.price);
        setDescription(data.description);
        setIntegrations(data.integrations);
        setVariants(data.variants);
        setImages(data.images);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
    fetchProduct();
  }, [match.params.id]);

  useEffect(() => {
    if (integrations) {
      const { id: _id, product: _product } = integrations[0];
      updateProductVariants(_id, _product.remote_product_id);
    }
  }, [integrations]);

  const handleEdit = async () => {
    const { enqueueSnackbar } = props;
    const data = { name, price: parseFloat(price), description };
    setIsLoading(true);
    try {
      await API.post(`products/${match.params.id}`, { data });
      history.goBack();
      enqueueSnackbar('Product edited successfuly', {
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

  const onIntegrationsChange = (index) => {
    const { id: _id, product: _product } = integrations[index];
    updateProductVariants(_id, _product.remote_product_id);
  };

  return (
    <div>
      {isLoading ? <Loading /> : null}
      <PageHeader title="Edit product" history={history} />
      {id && (
        <Fragment>
          <ProductForm
            name={name}
            price={price}
            description={description}
            images={images}
            variants={variants}
            integrations={integrations}
            variantList={productVariants}
            onNameChange={(e) => setName(e)}
            onPriceChange={(e) => setPrice(e)}
            onDescriptionChange={(e) => setDescription(e)}
            onIntegrationsChange={onIntegrationsChange}
          />
          <Fab color="secondary" aria-label="edit" className={classes.editFloatBtn} onClick={() => handleEdit()}>
            <EditIcon />
          </Fab>
        </Fragment>
      )}
    </div>
  );
}

EditProduct.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  productVariants: PropTypes.array.isRequired,
  updateProductVariants: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  productVariants: state.getIn(['integrations', 'productVariants']),
  ...state
});

const mapDispatchToProps = (dispatch) => ({
  updateProductVariants: bindActionCreators(getProductVariantList, dispatch),
});

const ProductDetailsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProduct);

export default withStyles(styles)(withSnackbar(ProductDetailsMapped));
