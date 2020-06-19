import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Loading from 'dan-components/Loading';

import PageHeader from 'dan-containers/Common/PageHeader';
import AlertDialog from 'dan-containers/Common/AlertDialog';
import VariantForm from 'dan-components/Products/VariantForm';
import { getVariant, updateVariant, updateIntegrationVariant } from 'dan-actions/variantActions';
import { checkTypes } from 'dan-containers/Common/Utils';

export const EDIT_VARIANT_CONFIRM = (strings, name) => {
  if (name) {
    return `The variant will be edited under "${name}" integration`;
  }
  return 'Are you sure you want to edit the variant?';
};

function EditVariant(props) {
  const { match, loading, history, variant, enqueueSnackbar, onGetVariant } = props;
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
  const [form, setForm] = useState('general');
  const [openDialog, setOpenDialog] = useState(false);


  useEffect(() => {
    onGetVariant(match.params.productId, match.params.variantId, enqueueSnackbar);
  }, [match.params.variantId]);

  useEffect(() => {
    if (variant) {
      setId(variant.id);
      setSKU(variant.sku);
      setPrice(variant.price);
      setQuantity(variant.quantity);
      setOriginalPrice(variant.original_price);
      setIntegrations(variant.integrations);
      setImages(variant.images);
      setDimension(checkTypes(variant.package));
    }
  }, [variant]);

  const handleDimensionChange = e => setDimension((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));

  const editBasicInfo = async () => {
    const { onUpdateVariant } = props;
    const data = { sku, quantity, price, original_price: originalPrice, package: dimension };
    onUpdateVariant(match.params.productId, match.params.variantId, data, enqueueSnackbar);
  };

  const editIntegrationProps = async () => {
    const { onUpdateIntegrationVariant } = props;
    const integrationName = form;
    const found = integrations.find(item => item.name === integrationName);
    const { remote_variant_id: remoteVariantId, remote_product_id: remoteProductId, properties } = found.variant;
    const data = { properties };
    onUpdateIntegrationVariant(found.id, remoteProductId, remoteVariantId, data, enqueueSnackbar);
  };

  const handleEdit = async () => form === 'general' ? editBasicInfo() : editIntegrationProps();

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
      {loading ? <Loading /> : null}
      <PageHeader title="Edit variant" history={history} />
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
          onQuantityChange={(e) => setQuantity(e)}
          onPriceChange={e => setPrice(e)}
          onOriginalPriceChange={e => setOriginalPrice(e)}
          onDimensionChange={handleDimensionChange}
          onCancelClick={() => history.goBack()}
          onSubmitForm={handleSubmitForm}
        />
      )}
      <AlertDialog
        open={openDialog}
        message={EDIT_VARIANT_CONFIRM`${form !== 'general' ? form : ''}`}
        handleCancel={handleDialogCancel}
        handleConfirm={handleDialogConfirm}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  variant: state.getIn(['variant', 'variant']),
  loading: state.getIn(['variant', 'loading']),
  update: state.getIn(['variant', 'update']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onGetVariant: bindActionCreators(getVariant, dispatch),
  onUpdateVariant: bindActionCreators(updateVariant, dispatch),
  onUpdateIntegrationVariant: bindActionCreators(updateIntegrationVariant, dispatch)
});

const EditVariantMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditVariant);

EditVariant.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  variant: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  onGetVariant: PropTypes.func.isRequired,
  onUpdateVariant: PropTypes.func.isRequired,
  onUpdateIntegrationVariant: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

EditVariant.defaultProps = {
  variant: null
};

export default withSnackbar(EditVariantMapped);
