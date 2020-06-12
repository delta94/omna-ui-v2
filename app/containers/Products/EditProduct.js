import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import 'dan-styles/vendors/slick-carousel/slick-carousel.css';
import 'dan-styles/vendors/slick-carousel/slick.css';
import 'dan-styles/vendors/slick-carousel/slick-theme.css';
import Loading from 'dan-components/Loading';

import API from 'dan-containers/Utils/api';
import PageHeader from 'dan-containers/Common/PageHeader';
import ToolbarActions from 'dan-components/Products/ToolbarActions';
import ProductForm from 'dan-components/Products/ProductForm';
import Linker from 'dan-components/Products/Linker';
import AlertDialog from 'dan-containers/Common/AlertDialog';
import { linkProduct, unLinkProduct } from 'dan-actions/productActions';
import styles from 'dan-components/Products/product-jss';

export const EDIT_PRODUCT_CONFIRM = (strings, name) => {
  if (name) {
    return `The product will be edited under "${name}" integration`;
  }
  return 'Are you sure you want to edit the product?';
};

function useWithUndefinedProps(values) {
  const [dimensionValue, setDimensionValue] = useState(null);

  useEffect(() => {
    if (values) {
      const obj = {};
      Object.keys(values).forEach((key) => {
        obj[key] = values[key] || undefined
      });
      setDimensionValue(obj);
    }
  }, []);

  return dimensionValue;
};

function EditProduct(props) {
  const { match, history, loading, linkTask, unlinkTask, appStore, enqueueSnackbar } = props;
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [variants, setVariants] = useState();
  const [integrations, setIntegrations] = useState([]);
  const [images, setImages] = useState([]);
  const [dimension, setDimension] = useState({
    weight: undefined,
    height: undefined,
    width: undefined,
    length: undefined,
    content: '',
    overwrite: false
  });
  const dimensions = useWithUndefinedProps(dimension);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState('general');
  const [openDialog, setOpenDialog] = useState(false);
  const [action, setAction] = useState('link');
  const [openLinkerDlg, setOpenLinkerDlg] = useState(false);
  const prevLinkTaskProp = useRef(linkTask);
  const prevUnlinkTaskProp = useRef(unlinkTask);

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
        setDimension({ ...data.package, overwrite: false });
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
    if(linkTask && linkTask !== prevLinkTaskProp.current) {
      history.push(`/tasks/${linkTask.id}`);
    }
  }, [linkTask]);

  useEffect(() => {
    if(unlinkTask && unlinkTask !== prevUnlinkTaskProp.current) {
      history.push(`/tasks/${unlinkTask.id}`);
    }
  }, [unlinkTask]);

  const handleDimensionChange = e => setDimension((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));

  const editBasicInfo = async () => {
    const data = { name, price: parseFloat(price), description, package: dimension };
    await API.post(`products/${match.params.id}`, { data });
  };

  const editIntegrationProps = async () => {
    const integrationName = form;
    const found = integrations.find(item => item.name === integrationName);
    const { remote_product_id: remoteProductId, properties } = found.product;
    const data = { properties };
    await API.post(`integrations/${found.id}/products/${remoteProductId}`, { data });
  };

  const handleEdit = async () => {
    setIsLoading(true);
    try {
      form === 'general' ? await editBasicInfo() : await editIntegrationProps();
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

  const handleLink = () => {
    setAction('link');
    setOpenLinkerDlg(true);
  };

  const handleUnlink = () => {
    setAction('unlink');
    setOpenLinkerDlg(true);
  };

  const handleLinker = (value) => {
    const { onLinkProduct, onUnlinkProduct } = props;
    const { id: _id, list, deleteFromIntegration } = value;
    if (action === 'link') {
      list.length > 0
        ? onLinkProduct(_id, list, enqueueSnackbar)
        : null;
    } else {
      list.length > 0
        ? onUnlinkProduct(
          _id,
          list,
          deleteFromIntegration,
          enqueueSnackbar
        )
        : null;
    }
    setOpenLinkerDlg(false);
  };

  const handleDialogCancel = () => setOpenDialog(false);

  const handleDialogConfirm = () => {
    setOpenDialog(false);
    handleEdit();
  };

  const handleSubmitForm = (form_) => {
    setForm(form_);
    setOpenDialog(true)
  };

  return (
    <div>
      {isLoading || loading ? <Loading /> : null}
      <PageHeader title="Edit product" history={history} />
      <ToolbarActions
        onLink={handleLink}
        onUnlink={handleUnlink}
        onVariantClick={() => history.push(`/products/${match.params.id}/variants`)}
      />
      {id && (
        <ProductForm
          name={name}
          price={price}
          description={description}
          images={images}
          dimension={dimensions}
          variants={variants}
          integrations={integrations}
          onNameChange={(e) => setName(e)}
          onPriceChange={e => setPrice(e)}
          onDescriptionChange={e => setDescription(e)}
          onDimensionChange={handleDimensionChange}
          onCancelClick={() => history.goBack()}
          onSubmitForm={handleSubmitForm}
        />
      )}
      <AlertDialog
        open={openDialog}
        message={EDIT_PRODUCT_CONFIRM`${form !== 'general' ? form : ''}`}
        handleCancel={handleDialogCancel}
        handleConfirm={handleDialogConfirm}
      />
      <Linker
        action={action}
        id={id}
        linkedIntegrations={integrations}
        fromShopifyApp={appStore.fromShopifyApp}
        open={openLinkerDlg}
        onClose={() => setOpenLinkerDlg(false)}
        onSave={handleLinker}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  loading: state.getIn(['product', 'loading']),
  linkTask: state.getIn(['product', 'link']),
  unlinkTask: state.getIn(['product', 'unlink']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onLinkProduct: bindActionCreators(linkProduct, dispatch),
  onUnlinkProduct: bindActionCreators(unLinkProduct, dispatch)
});

const EditProductMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProduct);

EditProduct.defaultProps = {
  linkTask: null,
  unlinkTask: null
};

EditProduct.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  appStore: PropTypes.object.isRequired,
  linkTask: PropTypes.object,
  unlinkTask: PropTypes.object,
  onLinkProduct: PropTypes.func.isRequired,
  onUnlinkProduct: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withStyles(styles)(withSnackbar(EditProductMapped));
