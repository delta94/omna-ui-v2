import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getBulkEditVariantProperties, bulkEditVariantProperties } from 'dan-actions/variantActions';
import PageHeader from 'dan-containers/Common/PageHeader';
import IntegrationProps from 'dan-components/Products/IntegrationProps';
import FormActions from 'dan-containers/Common/FormActions';
import { emptyArray } from 'dan-containers/Common/Utils';

function BulkEditVariants(props) {
  const {
    history, appStore, loading, bulkEditData, bulkEditTask, onGetProperties, enqueueSnackbar
  } = props;

  const prevBulkEditTaskProp = useRef(bulkEditTask);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (bulkEditTask && bulkEditTask !== prevBulkEditTaskProp.current) {
      history.push(`/tasks/${bulkEditTask.id}`);
    }
  }, [bulkEditTask]);

  useEffect(() => {
    if (bulkEditData) {
      onGetProperties(appStore.name, bulkEditData.get('integration'), bulkEditData.get('category'), enqueueSnackbar);
    }
  }, []);

  const handleTouchedProps = () => setTouched(true);

  const handleBulkEdit = () => {
    const { onBulkEditProperties } = props;
    onBulkEditProperties(appStore.name, bulkEditData.get('remoteIds'), bulkEditData.get('properties'), enqueueSnackbar);
  };

  return (
    <div>
      <PageHeader title="Bulk edit variants" history={history} />
      <IntegrationProps
        description="At this point all common properties can be edited."
        loading={loading}
        properties={bulkEditData.get('properties')}
        onTouchedProps={handleTouchedProps}
      />
      {!emptyArray(bulkEditData.get('properties')) && <FormActions acceptButtonDisabled={!touched} onAcceptClick={handleBulkEdit} history={history} />}
    </div>
  );
}

BulkEditVariants.defaultProps = {
  bulkEditTask: null
};

BulkEditVariants.propTypes = {
  history: PropTypes.object.isRequired,
  appStore: PropTypes.object.isRequired,
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
