import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withSnackbar } from 'notistack';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import { getBulkEditProperties, bulkEditProperties } from 'dan-api/services/variants';
import GeneralProps from 'dan-components/Products/GeneralProps';
import IntegrationProps from 'dan-components/Products/IntegrationProps';
import FullScreenDlg from 'dan-components/FullScreenDlg';
import { editDynamicPropsHelper } from 'dan-containers/Common/Utils';
import { addTaskNotification } from 'dan-actions/NotificationActions';

function BulkEditVariants(props) {
  const {
    open, params, onClose, onAddTaskNotification, enqueueSnackbar
  } = props;
  const [price, setPrice] = useState();
  const [originalPrice, setOriginalPrice] = useState();
  const [dimension, setDimension] = useState({
    weight: undefined,
    height: undefined,
    width: undefined,
    length: undefined,
    content: ''
  });
  const [integrationProps, setIntegrationProps] = useState([]);
  const [initialBasicProps, setInitialBasicProps] = useState();
  const [initialIntegrationProps, setInitialIntegrationProps] = useState();
  const [errorProps, setErrorProps] = useState();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isValidForm, setIsValidForm] = useState(false);

  const resetForm = () => {
    setPrice(undefined);
    setOriginalPrice(undefined);
    setDimension({
      weight: undefined,
      height: undefined,
      width: undefined,
      length: undefined,
      content: ''
    });
    setIsValidForm(false);
    setIntegrationProps([]);
    setInitialIntegrationProps(null);
    setErrorProps(null);
  };

  useEffect(() => {
    async function getIntegrationProps() {
      if (open) {
        setInitialBasicProps(cloneDeep({
          price, original_price: originalPrice, package: dimension
        }));
        setLoading(true);
        const { data, error } = await getBulkEditProperties({ ...params, enqueueSnackbar });
        data ? setIntegrationProps(data) : null;
        error ? setErrorProps(error) : null;
        setLoading(false);
        setInitialIntegrationProps(cloneDeep(data));
      }
    }
    getIntegrationProps();
    return () => resetForm();
  }, [open]);

  const handleChange = e => {
    switch (e.target.name) {
      case 'price':
        setPrice(e.target.value);
        break;
      case 'originalPrice':
        setOriginalPrice(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleDimensionChange = e => {
    setDimension((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const handlePropertiesChange = (e) => {
    const newProps = editDynamicPropsHelper(e, integrationProps);
    setIntegrationProps(newProps);
  };

  const checkValidityForm = () => {
    const touchedBasicProps = { price, original_price: originalPrice, package: dimension };
    if (!isEqual(initialBasicProps, touchedBasicProps) || (!isEqual(initialIntegrationProps, integrationProps) && !isEmpty(initialIntegrationProps))) {
      setIsValidForm(true);
    } else setIsValidForm(false);
  };

  useEffect(() => {
    open ? checkValidityForm() : null;
  }, [price, originalPrice, dimension, integrationProps]);

  const handleBulkEdit = async () => {
    const { store, remoteIds } = params;
    const basicProperties = { price, original_price: originalPrice, package: dimension };
    const data = {
      remotes_variants_id: remoteIds
    };
    !isEqual(initialBasicProps, basicProperties) ? data.basic_properties = basicProperties : null;
    !isEqual(initialIntegrationProps, integrationProps) ? data.integration_properties = integrationProps : null;
    setLoading(true);
    setSaving(true);
    const response = await bulkEditProperties({
      store, data, enqueueSnackbar
    });
    onAddTaskNotification(response.data.id);
    setLoading(false);
    setSaving(false);
    onClose();
  };

  return (
    <div>
      <FullScreenDlg title="Bulk edit" open={open} handleConfirm={handleBulkEdit} handleClose={onClose} disableConfirm={!isValidForm || saving}>
        <GeneralProps
          description="At this point all general properties can be edited."
          price={price}
          originalPrice={originalPrice}
          loading={saving}
          type="variant"
          onChange={handleChange}
          dimensions={dimension}
          onDimensionChange={handleDimensionChange}
        />
        <IntegrationProps
          title="Integration properties"
          description="At this point all common properties can be edited."
          loading={loading}
          properties={integrationProps}
          errors={errorProps}
          onChange={handlePropertiesChange}
        />
      </FullScreenDlg>
    </div>
  );
}

BulkEditVariants.defaultProps = {
  params: null
};

BulkEditVariants.propTypes = {
  open: PropTypes.bool.isRequired,
  params: PropTypes.object,
  enqueueSnackbar: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddTaskNotification: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  onAddTaskNotification: bindActionCreators(addTaskNotification, dispatch),
});

const BulkEditVariantsMapped = connect(
  null,
  mapDispatchToProps
)(BulkEditVariants);

export default withSnackbar(BulkEditVariantsMapped);
