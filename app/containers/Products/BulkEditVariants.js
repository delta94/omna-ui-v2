import React, { useEffect, Fragment, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TypographySkeleton from 'dan-components/Skeleton/index';
import { PapperBlock } from 'dan-components';
import { getBulkEditVariantProperties, bulkEditVariantProperties } from 'dan-actions/variantActions';
import PageHeader from 'dan-containers/Common/PageHeader';
import IntegrationProps from 'dan-components/Products/IntegrationProps';
import FormActions from 'dan-containers/Common/FormActions';
import { emptyArray } from 'dan-containers/Common/Utils';

function BulkEditVariants(props) {
  const { history, appStore, loading, category, properties, bulkEditTask, onGetProperties, enqueueSnackbar } = props;

  const prevBulkEditTaskProp = useRef(bulkEditTask);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (bulkEditTask && bulkEditTask !== prevBulkEditTaskProp.current) {
      history.push(`/tasks/${bulkEditTask.id}`);
    }
  }, [bulkEditTask]);

  useEffect(() => {
    if (category) {
      onGetProperties(appStore.name, category.get('integration'), category.get('id'), enqueueSnackbar);
    }
  }, []);

  const handleTouchedProps = () => setTouched(true);

  const handleBulkEdit = () => {
    const { remoteIds, onBulkEditProperties } = props;
    onBulkEditProperties(appStore.name, remoteIds, properties, enqueueSnackbar);
  };

  return (
    <div>
      <PageHeader title="Bulk edit variants" history={history} />
      <PapperBlock title="" icon="ios-card" desc="At this point all common properties can be edited.">
        {loading ? <TypographySkeleton /> : (
          <Fragment>
            <IntegrationProps properties={properties} onTouchedProps={handleTouchedProps} />
            {!emptyArray(properties) && <FormActions acceptButtonDisabled={!touched} onAcceptClick={handleBulkEdit} history={history} />}
          </Fragment>
        )}
      </PapperBlock>
    </div>
  );
}

BulkEditVariants.defaultProps = {
  category: undefined,
  bulkEditTask: null
};

BulkEditVariants.propTypes = {
  history: PropTypes.object.isRequired,
  appStore: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  category: PropTypes.object,
  properties: PropTypes.any.isRequired,
  remoteIds: PropTypes.any.isRequired,
  bulkEditTask: PropTypes.object,
  onGetProperties: PropTypes.func.isRequired,
  onBulkEditProperties: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  category: state.getIn(['product', 'category']),
  loading: state.getIn(['variant', 'loading']),
  properties: state.getIn(['variant', 'properties']),
  remoteIds: state.getIn(['variant', 'remoteIds']),
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
