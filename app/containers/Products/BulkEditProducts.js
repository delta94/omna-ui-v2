import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PageHeader from 'dan-containers/Common/PageHeader';
import { getBulkEditProperties, bulkEditProperties } from 'dan-actions/productActions';
import GeneralProps from 'dan-components/Products/GeneralProps';
import IntegrationProps from 'dan-components/Products/IntegrationProps';
import FormActions from 'dan-containers/Common/FormActions';

function BulkEditProducts(props) {
  const {
    history, loading, appStore, bulkEditData, task, onGetProperties, enqueueSnackbar
  } = props;
  const [price, setPrice] = useState();
  const [dimension, setDimension] = useState({
    weight: undefined,
    height: undefined,
    width: undefined,
    length: undefined,
    content: ''
  });
  const [touched, setTouched] = useState(false);
  const prevTaskProp = useRef(task);

  useEffect(() => {
    if (task && task !== prevTaskProp.current) {
      history.push(`/tasks/${task.id}`);
    }
  }, [task]);

  useEffect(() => {
    if (bulkEditData) {
      onGetProperties(appStore.name, bulkEditData.get('integration'), bulkEditData.get('category'), enqueueSnackbar);
    }
  }, []);

  const handleTouchedProps = () => setTouched(true);

  const handleChange = e => {
    setPrice(e.target.value);
    handleTouchedProps();
  };

  const handleDimensionChange = e => {
    setDimension((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
    handleTouchedProps();
  };

  const handleBulkEdit = () => {
    const { onBulkEditProperties } = props;
    const basicProperties = { price, package: dimension };
    onBulkEditProperties(appStore.name, bulkEditData.get('remoteIds'), basicProperties, bulkEditData.get('properties'), enqueueSnackbar);
  };

  return (
    <div>
      <PageHeader title="Bulk edit products" history={history} />
      <GeneralProps
        description="At this point all general properties can be edited."
        price={price}
        loading={loading}
        onChange={handleChange}
        dimensions={dimension}
        onDimensionChange={handleDimensionChange}
      />
      <IntegrationProps
        title="Integration Properties"
        description="At this point all common properties from an integration and category can be edited."
        loading={loading}
        properties={bulkEditData.get('properties')}
        onTouchedProps={handleTouchedProps}
      />
      {!loading && <FormActions acceptButtonDisabled={!touched} onAcceptClick={handleBulkEdit} history={history} />}
    </div>
  );
}

BulkEditProducts.defaultProps = {
  task: null
};

BulkEditProducts.propTypes = {
  history: PropTypes.object.isRequired,
  appStore: PropTypes.object.isRequired,
  task: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  bulkEditData: PropTypes.object.isRequired,
  onGetProperties: PropTypes.func.isRequired,
  onBulkEditProperties: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  loading: state.getIn(['product', 'loading']),
  bulkEditData: state.getIn(['product', 'bulkEditData']),
  task: state.getIn(['product', 'task']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onGetProperties: bindActionCreators(getBulkEditProperties, dispatch),
  onBulkEditProperties: bindActionCreators(bulkEditProperties, dispatch)
});

const BulkEditProductsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(BulkEditProducts);

export default withSnackbar(BulkEditProductsMapped);
