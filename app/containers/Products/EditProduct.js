import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import Loading from 'dan-components/Loading';

import API from 'dan-containers/Utils/api';
import PageHeader from 'dan-containers/Common/PageHeader';
import ToolbarActions from 'dan-components/Products/ToolbarActions';
import ProductForm from 'dan-components/Products/ProductForm';
import Linker from 'dan-components/Products/Linker';
import AlertDialog from 'dan-containers/Common/AlertDialog';
import { linkProduct, unLinkProduct, importProductFromIntegration } from 'dan-actions/productActions';
import { importResource } from 'dan-actions/integrationActions';
import { checkTypes } from 'dan-containers/Common/Utils';
import styles from 'dan-components/Products/product-jss';

export const EDIT_PRODUCT_CONFIRM = (strings, name) => {
  if (name) {
    return `The product will be edited under "${name}" integration`;
  }
  return 'Are you sure you want to edit the product?';
};

export const INTEGRATION_ACTIONS_CONFIRM = (strings, _action, integration) => (
  `Are you sure you want to ${_action} under "${integration}" integration`
);

function EditProduct(props) {
  const { match, history, loading, task, importTask, appStore, enqueueSnackbar } = props;
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
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState('general');
  const [selectedTab, setSelectedTab] = useState('general');
  const [openDialog, setOpenDialog] = useState(false);
  const [action, setAction] = useState('link');
  const [openLinkerDlg, setOpenLinkerDlg] = useState(false);
  const [integrationActionsDialog, setIntegrationActionsDialog] = useState(false);
  const [integrationAction, setIntegrationAction] = useState('import this product');
  const prevTaskProp = useRef(task);
  const prevImportTaskProp = useRef(importTask);

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
        setDimension({ ...checkTypes(data.package), overwrite: false });
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
    if (task && task !== prevTaskProp.current) {
      history.push(`/tasks/${task.id}`);
    }
  }, [task]);

  useEffect(() => {
    if (importTask && importTask !== prevImportTaskProp.current) {
      history.push(`/tasks/${importTask.id}`);
    }
  }, [importTask]);

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

  const handleIntegrationActionsDlgCancel = () => setIntegrationActionsDialog(false);

  const handleIntegrationActionsDlgConfirm = () => {
    const { onImportResource, onImportProductFromIntegration } = props;
    switch (integrationAction) {
      case 'import categories':
        onImportResource({ id: selectedTab.id, resource: 'categories', enqueueSnackbar });
        break;
      case 'import brands':
        onImportResource({ id: selectedTab.id, resource: 'brands', enqueueSnackbar });
        break;
      case 'import this product': {
        const found = integrations.find(item => item.id === selectedTab.id);
        const { remote_product_id: remoteId } = found.product;
        onImportProductFromIntegration(selectedTab.id, remoteId, enqueueSnackbar);
        break;
      }
      default:
        break;
    }
    setIntegrationActionsDialog(false);
  };

  const handleSubmitForm = (form_) => {
    setForm(form_);
    setOpenDialog(true);
  };

  const handleImportAction = (actionType) => {
    setIntegrationAction(actionType);
    setIntegrationActionsDialog(true);
  };

  return (
    <div>
      {isLoading || loading ? <Loading /> : null}
      <PageHeader title="Edit product" history={history} />
      <ToolbarActions
        onLink={handleLink}
        onUnlink={handleUnlink}
        onVariantClick={() => history.push(`/products/${match.params.id}/variants`)}
        onImport={handleImportAction}
        disableImport={selectedTab === 'general' || false}
      />
      {id && (
        <ProductForm
          name={name}
          price={price}
          description={description}
          images={images}
          dimension={dimension}
          variants={variants}
          integrations={integrations}
          onNameChange={(e) => setName(e)}
          onPriceChange={e => setPrice(e)}
          onDescriptionChange={e => setDescription(e)}
          onDimensionChange={handleDimensionChange}
          onIntegrationChange={(e) => setSelectedTab(e)}
          onCancelClick={() => history.goBack()}
          onImportAction={handleImportAction}
          onSubmitForm={handleSubmitForm}
        />
      )}
      <AlertDialog
        open={openDialog}
        message={EDIT_PRODUCT_CONFIRM`${form !== 'general' ? form : ''}`}
        handleCancel={handleDialogCancel}
        handleConfirm={handleDialogConfirm}
      />
      <AlertDialog
        open={integrationActionsDialog}
        message={INTEGRATION_ACTIONS_CONFIRM`${integrationAction}${selectedTab.name}`}
        handleCancel={handleIntegrationActionsDlgCancel}
        handleConfirm={handleIntegrationActionsDlgConfirm}
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
  task: state.getIn(['product', 'task']),
  importTask: state.getIn(['integration', 'task']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onLinkProduct: bindActionCreators(linkProduct, dispatch),
  onUnlinkProduct: bindActionCreators(unLinkProduct, dispatch),
  onImportResource: bindActionCreators(importResource, dispatch),
  onImportProductFromIntegration: bindActionCreators(importProductFromIntegration, dispatch),
});

const EditProductMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProduct);

EditProduct.defaultProps = {
  task: null,
  importTask: null
};

EditProduct.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  appStore: PropTypes.object.isRequired,
  task: PropTypes.object,
  importTask: PropTypes.object,
  onLinkProduct: PropTypes.func.isRequired,
  onUnlinkProduct: PropTypes.func.isRequired,
  onImportResource: PropTypes.func.isRequired,
  onImportProductFromIntegration: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withStyles(styles)(withSnackbar(EditProductMapped));
