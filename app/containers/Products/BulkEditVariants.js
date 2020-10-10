import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getBulkEditVariantProperties, bulkEditVariantProperties } from 'dan-actions/variantActions';
import PageHeader from 'dan-containers/Common/PageHeader';
import GeneralProps from 'dan-components/Products/GeneralProps';
import IntegrationProps from 'dan-components/Products/IntegrationProps';
import FormActions from 'dan-containers/Common/FormActions';

function BulkEditVariants(props) {
  const {
    history, store, loading, bulkEditData, bulkEditTask, onGetProperties, enqueueSnackbar
  } = props;
  const [price, setPrice] = useState();
  const [originalPrice, setOriginalPrice] = useState();
  const [quantity, setQuantity] = useState();
  const [dimension, setDimension] = useState({
    weight: undefined,
    height: undefined,
    width: undefined,
    length: undefined,
    content: ''
  });

  const prevBulkEditTaskProp = useRef(bulkEditTask);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (bulkEditTask && bulkEditTask !== prevBulkEditTaskProp.current) {
      history.push(`/tasks/${bulkEditTask.id}`);
    }
  }, [bulkEditTask]);

  useEffect(() => {
    if (bulkEditData) {
      onGetProperties(store, bulkEditData.get('integration'), bulkEditData.get('category'), enqueueSnackbar);
    }
  }, []);

  const handleTouchedProps = () => setTouched(true);

  const handleChange = e => {
    switch (e.target.name) {
      case 'price':
        setPrice(e.target.value);
        break;
      case 'originalPrice':
        setOriginalPrice(e.target.value);
        break;
      case 'quantity':
        setQuantity(e.target.value);
        break;
      default:
        break;
    }
    handleTouchedProps();
  };

  const handleDimensionChange = e => {
    setDimension((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
    handleTouchedProps();
  };

  const handleBulkEdit = () => {
    const { onBulkEditProperties } = props;
    const basicProperties = { price, original_price: originalPrice, quantity, package: dimension };
    onBulkEditProperties(store, bulkEditData.get('remoteIds'), basicProperties, bulkEditData.get('properties'), enqueueSnackbar);
  };

  return (
    <div>
      <PageHeader title="Bulk edit variants" history={history} />
      <GeneralProps
        description="At this point all general properties can be edited."
        price={price}
        originalPrice={originalPrice}
        quantity={quantity}
        loading={loading}
        type="variant"
        onChange={handleChange}
        dimensions={dimension}
        onDimensionChange={handleDimensionChange}
      />
      <IntegrationProps
        title="Integration properties"
        description="At this point all common properties can be edited."
        loading={loading}
        properties={bulkEditData.get('properties')}
        onTouchedProps={handleTouchedProps}
      />
      {!loading && <FormActions acceptButtonDisabled={!touched} onAcceptClick={handleBulkEdit} history={history} />}
    </div>
  );
}

BulkEditVariants.defaultProps = {
  bulkEditTask: null
};

BulkEditVariants.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  bulkEditData: PropTypes.any.isRequired,
  bulkEditTask: PropTypes.object,
  onGetProperties: PropTypes.func.isRequired,
  onBulkEditProperties: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  loading: state.getIn(['variant', 'loading']),
  bulkEditData: state.getIn(['variant', 'bulkEditData']),
  bulkEditTask: state.getIn(['variant', 'bulkEdit']),
  store: state.getIn(['user', 'tenantName']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onGetProperties: bindActionCreators(getBulkEditVariantProperties, dispatch),
  onBulkEditProperties: bindActionCreators(bulkEditVariantProperties, dispatch)
});

const BulkEditVariantsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(BulkEditVariants);

export default withSnackbar(BulkEditVariantsMapped);
