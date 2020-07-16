import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withSnackbar } from 'notistack';
import Typography from '@material-ui/core/Typography';
import { getBulkEditProperties } from 'dan-actions/productActions';
import TypographySkeleton from 'dan-components/Skeleton/index';
import IntegrationProps from '../IntegrationProps';

function EditForm(props) {
  const {
    shop, integration, category, properties, loading, enqueueSnackbar, onGetBulkEditProperties, onTouchedProps
  } = props;

  useEffect(() => {
    onGetBulkEditProperties(shop, integration.value, category.value, enqueueSnackbar);
  }, []);

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Edit
      </Typography>
      {loading ? <TypographySkeleton /> : (
        <IntegrationProps properties={properties} onTouchedProps={onTouchedProps} />
      )}
    </div>
  );
}

const mapStateToProps = state => ({
  properties: state.getIn(['product', 'properties']),
  loading: state.getIn(['product', 'loading']),
  error: state.getIn(['product', 'error']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onGetBulkEditProperties: bindActionCreators(getBulkEditProperties, dispatch)
});

const EditFormMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditForm);

EditForm.defaultProps = {
  onTouchedProps: undefined
};

EditForm.propTypes = {
  shop: PropTypes.string.isRequired,
  integration: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  properties: PropTypes.object.isRequired,
  onGetBulkEditProperties: PropTypes.func.isRequired,
  onTouchedProps: PropTypes.func,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(EditFormMapped);
