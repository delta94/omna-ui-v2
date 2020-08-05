import React, { Fragment, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { PapperBlock } from 'dan-components';
import PageHeader from 'dan-containers/Common/PageHeader';
import TypographySkeleton from 'dan-components/Skeleton/index';
import { getBulkEditProperties, bulkEditProperties } from 'dan-actions/productActions';
import IntegrationProps from 'dan-components/Products/IntegrationProps';
import FormActions from 'dan-containers/Common/FormActions';
import { emptyArray } from 'dan-containers/Common/Utils';

function BulkEditProducts(props) {
  const { history, loading, appStore, bulkEditData, task, onGetProperties, enqueueSnackbar } = props;
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

  const handleBulkEdit = () => {
    const { onBulkEditProperties } = props;
    onBulkEditProperties(appStore.name, bulkEditData.get('remoteIds'), bulkEditData.get('properties'), enqueueSnackbar);
  };

  return (
    <div>
      <PageHeader title="Bulk edit products" history={history} />
      <PapperBlock title="" icon="ios-card" desc="At this point all common properties can be edited.">
        {loading ? <TypographySkeleton /> : (
          <Fragment>
            <IntegrationProps properties={bulkEditData.get('properties')} onTouchedProps={handleTouchedProps} />
            {!emptyArray(bulkEditData.get('properties')) && <FormActions acceptButtonDisabled={!touched} onAcceptClick={handleBulkEdit} history={history} />}
          </Fragment>
        )}
      </PapperBlock>
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
