import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Loading from 'dan-components/Loading';

import PageHeader from 'dan-containers/Common/PageHeader';
import AlertDialog from 'dan-containers/Common/AlertDialog';
import VariantForm from 'dan-components/Products/VariantForm';
import ToolbarActions from 'dan-components/Products/ToolbarActions';
import Linker from 'dan-components/Products/Linker';
import { getVariant } from 'dan-api/services/variants';
import {
  updateVariant, linkVariant, unlinkVariant, updateIntegrationVariant
} from 'dan-actions/variantActions';
import { checkTypes } from 'dan-containers/Common/Utils';

export const EDIT_VARIANT_CONFIRM = (strings, name) => {
  if (name) {
    return `The variant will be edited under "${name}" integration`;
  }
  return 'Are you sure you want to edit the variant?';
};

function EditVariant(props) {
  const {
    match, loading, history, linkTask, unlinkTask, fromShopifyApp, enqueueSnackbar
  } = props;
  const [id, setId] = useState();
  const [sku, setSKU] = useState('');
  const [price, setPrice] = useState();
  const [originalPrice, setOriginalPrice] = useState();
  const [quantity, setQuantity] = useState();
  const [integrations, setIntegrations] = useState([]);
  const [images, setImages] = useState([]);
  const [dimension, setDimension] = useState({
    weight: undefined,
    height: undefined,
    width: undefined,
    length: undefined,
    content: ''
  });
  const [action, setAction] = useState('link');
  const [isLoading, setIsLoading] = useState(false);
  const [openLinkerDlg, setOpenLinkerDlg] = useState(false);
  const [selectedTab, setSelectedTab] = useState('general');
  const [openDialog, setOpenDialog] = useState(false);
  const prevLinkTaskProp = useRef(linkTask);
  const prevUnlinkTaskProp = useRef(unlinkTask);


  useEffect(() => {
    async function onGetVariant() {
      setIsLoading(true);
      const response = await getVariant({
        productId: match.params.productId, variantId: match.params.variantId, enqueueSnackbar
      });
      if (response.data) {
        const { data } = response;
        setId(data.id);
        setSKU(data.sku);
        setPrice(data.price);
        setQuantity(data.quantity);
        setOriginalPrice(data.original_price);
        setIntegrations(data.integrations);
        setImages(data.images);
        setDimension(checkTypes(data.package));
      }
      setIsLoading(false);
    }
    onGetVariant();
  }, [match.params.variantId]);

  useEffect(() => {
    if (linkTask && linkTask !== prevLinkTaskProp.current) {
      history.push(`/tasks/${linkTask.id}`);
    }
  }, [linkTask]);

  useEffect(() => {
    if (unlinkTask && unlinkTask !== prevUnlinkTaskProp.current) {
      history.push(`/tasks/${unlinkTask.id}`);
    }
  }, [unlinkTask]);

  const handleDimensionChange = e => setDimension((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));

  const editBasicInfo = async () => {
    const { onUpdateVariant } = props;
    const data = { sku, price, original_price: originalPrice, package: dimension };
    onUpdateVariant(match.params.productId, match.params.variantId, data, enqueueSnackbar);
  };

  const editIntegrationProps = async () => {
    const { onUpdateIntegrationVariant } = props;
    const found = integrations.find(item => item.id === selectedTab.id);
    const { remote_variant_id: remoteVariantId, remote_product_id: remoteProductId, properties } = found.variant;
    const data = { properties };
    onUpdateIntegrationVariant(found.id, remoteProductId, remoteVariantId, data, enqueueSnackbar);
  };

  const handleEdit = async () => (selectedTab === 'general' ? editBasicInfo() : editIntegrationProps());

  const handleDialogCancel = () => setOpenDialog(false);

  const handleDialogConfirm = () => {
    setOpenDialog(false);
    handleEdit();
  };

  const handleSubmitForm = () => setOpenDialog(true);

  const handleLink = () => {
    setAction('link');
    setOpenLinkerDlg(true);
  };

  const handleUnlink = () => {
    setAction('unlink');
    setOpenLinkerDlg(true);
  };

  const handleLinker = (value) => {
    const { onLinkVariant, onUnlinkVariant } = props;
    const { id: variantId, list, deleteFromIntegration } = value;
    if (action === 'link') {
      onLinkVariant(match.params.productId, variantId, list, enqueueSnackbar);
    } else {
      onUnlinkVariant(match.params.productId, variantId, list, deleteFromIntegration, enqueueSnackbar);
    }
    setOpenLinkerDlg(false);
  };

  return (
    <div>
      {loading || isLoading ? <Loading /> : null}
      <PageHeader title="Edit variant" history={history} />
      {!fromShopifyApp && (
        <ToolbarActions
          onLink={handleLink}
          onUnlink={handleUnlink}
        />
      )}
      {id && (
        <VariantForm
          sku={sku}
          quantity={quantity}
          price={price}
          originalPrice={originalPrice}
          images={images}
          dimension={dimension}
          integrations={integrations}
          action="edit"
          onPriceChange={e => setPrice(e)}
          onOriginalPriceChange={e => setOriginalPrice(e)}
          onDimensionChange={handleDimensionChange}
          onIntegrationChange={(e) => setSelectedTab(e)}
          onCancelClick={() => history.goBack()}
          onSubmitForm={handleSubmitForm}
        />
      )}
      <Linker
        action={action}
        id={id}
        type="variant"
        linkedIntegrations={integrations}
        open={openLinkerDlg}
        onClose={() => setOpenLinkerDlg(false)}
        onSave={handleLinker}
      />
      <AlertDialog
        open={openDialog}
        message={EDIT_VARIANT_CONFIRM`${selectedTab !== 'general' ? selectedTab.name : ''}`}
        handleCancel={handleDialogCancel}
        handleConfirm={handleDialogConfirm}
      />
    </div>
  );
}

const mapStateToProps = state => ({
  loading: state.getIn(['variant', 'loading']),
  update: state.getIn(['variant', 'update']),
  linkTask: state.getIn(['variant', 'link']),
  unlinkTask: state.getIn(['variant', 'unlink']),
  fromShopifyApp: state.getIn(['user', 'fromShopifyApp']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onUpdateVariant: bindActionCreators(updateVariant, dispatch),
  onLinkVariant: bindActionCreators(linkVariant, dispatch),
  onUnlinkVariant: bindActionCreators(unlinkVariant, dispatch),
  onUpdateIntegrationVariant: bindActionCreators(updateIntegrationVariant, dispatch)
});

const EditVariantMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditVariant);

EditVariant.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  linkTask: PropTypes.object,
  unlinkTask: PropTypes.object,
  fromShopifyApp: PropTypes.bool.isRequired,
  onUpdateVariant: PropTypes.func.isRequired,
  onLinkVariant: PropTypes.func.isRequired,
  onUnlinkVariant: PropTypes.func.isRequired,
  onUpdateIntegrationVariant: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

EditVariant.defaultProps = {
  linkTask: null,
  unlinkTask: null
};

export default withSnackbar(EditVariantMapped);
