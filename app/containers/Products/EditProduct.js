import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import 'dan-styles/vendors/slick-carousel/slick-carousel.css';
import 'dan-styles/vendors/slick-carousel/slick.css';
import 'dan-styles/vendors/slick-carousel/slick-theme.css';
import Loading from 'dan-components/Loading';

import { getProductVariantList } from 'dan-actions/productActions';
import API from 'dan-containers/Utils/api';
import PageHeader from 'dan-containers/Common/PageHeader';
import ProductForm from 'dan-components/Products/ProductForm';
import styles from 'dan-components/Products/product-jss';
import AlertDialog from 'dan-containers/Common/AlertDialog';

function EditProduct(props) {
  const { match, productVariants, updateProductVariants, history, enqueueSnackbar } = props;
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [variants, setVariants] = useState();
  const [integrations, setIntegrations] = useState([]);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIntegration, setSelectedIntegration] = useState();
  const [openDialog, setOpenDialog] = useState(false);


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
        setSelectedIntegration(data.integrations.length > 0 ? data.integrations[0] : null);
      } catch (error) {
        if (error && error.response.data.message) {
          enqueueSnackbar(error.response.data.message, {
            variant: 'error'
          });
        }
      }
      setIsLoading(false);
    }
    fetchProduct();
  }, [match.params.id]);

  useEffect(() => {
    if (integrations && integrations.length > 0) {
      const { id: _id, product: _product } = integrations[0];
      updateProductVariants(_id, _product.remote_product_id);
    }
  }, [integrations]);

  const onIntegrationChange = value => {
    const obj = integrations.find(item => item.id === value.id);
    if (obj) {
      setSelectedIntegration(value);
      const { id: _id, product: _product } = obj;
      updateProductVariants(_id, _product.remote_product_id);
    }
  };

  const editBasicInfo = async () => {
    const data = { name, price: parseFloat(price), description };
    await API.post(`products/${match.params.id}`, { data });
  };

  const editProps = async () => {
    const editProperties = selectedIntegration || integrations.length > 0;
    if (editProperties) {
      const integrationId = selectedIntegration.id || integrations[0].id;
      const { remote_product_id: remoteProductId, properties } = integrations.find(item => item.id === integrationId).product;
      const data = { properties };
      await API.post(`integrations/${integrationId}/products/${remoteProductId}`, { data });
    }
  };

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      await editBasicInfo();
      await editProps();
      enqueueSnackbar('Product edited successfuly', {
        variant: 'success'
      });
    } catch (error) {
      if (error && error.response.data.message) {
        enqueueSnackbar(error.response.data.message, {
          variant: 'error'
        });
      }
    }
    setIsLoading(false);
  };

  const handleDialogCancel = () => setOpenDialog(false);

  const handleDialogConfirm = () => {
    setOpenDialog(false);
    handleEdit();
  };

  return (
    <div>
      {isLoading ? <Loading /> : null}
      <PageHeader title="Edit product" history={history} />
      {id && (
        <ProductForm
          name={name}
          price={price}
          description={description}
          images={images}
          variants={variants}
          integrations={integrations}
          variantList={productVariants}
          selectedIntegration={selectedIntegration}
          onNameChange={e => setName(e)}
          onPriceChange={e => setPrice(e)}
          onDescriptionChange={e => setDescription(e)}
          onIntegrationChange={onIntegrationChange}
          onCancelClick={() => history.goBack()}
          onSubmitForm={() => setOpenDialog(true)}
        />
      )}
      <AlertDialog
        open={openDialog}
        message={`The product will be edited under "${selectedIntegration ? selectedIntegration.name : ''}" integration`}
        handleCancel={handleDialogCancel}
        handleConfirm={handleDialogConfirm}
      />
    </div>
  );
}

EditProduct.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  productVariants: PropTypes.any.isRequired,
  updateProductVariants: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  productVariants: state.getIn(['product', 'productVariants']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  updateProductVariants: bindActionCreators(getProductVariantList, dispatch)
});

const EditProductMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProduct);

export default withStyles(styles)(withSnackbar(EditProductMapped));
