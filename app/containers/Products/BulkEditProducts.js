import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { getBulkEditProperties, bulkEditProperties } from 'dan-api/services/products';
import { editDynamicPropsHelper } from 'dan-containers/Common/Utils';
import GeneralProps from 'dan-components/Products/GeneralProps';
import IntegrationProps from 'dan-components/Products/IntegrationProps';
import FullScreenDlg from 'dan-components/FullScreenDlg/index';

function BulkEditProducts(props) {
  const {
    open, params, onClose, enqueueSnackbar
  } = props;
  const [price, setPrice] = useState();
  const [dimension, setDimension] = useState({
    weight: undefined,
    height: undefined,
    width: undefined,
    length: undefined,
    content: ''
  });
  const [initialBasicProps, setInitialBasicProps] = useState();
  const [initialIntegrationProps, setInitialIntegrationProps] = useState();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [integrationProperties, setIntegrationProperties] = useState([]);
  const [errorProps, setErrorProps] = useState();
  const [isValidForm, setIsValidForm] = useState(false);

  const resetForm = () => {
    setPrice(undefined);
    setDimension({
      weight: undefined,
      height: undefined,
      width: undefined,
      length: undefined,
      content: ''
    });
    setIsValidForm(false);
    setIntegrationProperties([]);
    setInitialIntegrationProps(null);
    setErrorProps(null);
  };

  useEffect(() => {
    async function getProps() {
      if (open) {
        setInitialBasicProps(cloneDeep({
          price, package: dimension
        }));
        setLoading(true);
        const { data, error } = await getBulkEditProperties({ ...params, enqueueSnackbar });
        data ? setIntegrationProperties(data) : null;
        error ? setErrorProps(error) : null;
        setLoading(false);
        setInitialIntegrationProps(cloneDeep(data));
      }
    }
    getProps();
    return () => resetForm();
  }, [open]);

  const handleChange = e => setPrice(e.target.value);

  const handlePropertiesChange = (e) => {
    const newProps = editDynamicPropsHelper(e, integrationProperties);
    setIntegrationProperties(newProps);
  };

  const handleDimensionChange = e => {
    setDimension((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const checkValidityForm = () => {
    const touchedBasicProps = { price, package: dimension };
    if (!isEqual(initialBasicProps, touchedBasicProps) || (!isEqual(initialIntegrationProps, integrationProperties) && !isEmpty(initialIntegrationProps))) {
      setIsValidForm(true);
    } else setIsValidForm(false);
  };

  useEffect(() => {
    open ? checkValidityForm() : null;
  }, [price, dimension, integrationProperties]);

  const handleBulkEdit = async () => {
    const { store, remoteIds } = params;
    const basicProperties = { price, package: dimension };
    const data = {
      remotes_id: remoteIds
    };
    !isEqual(initialBasicProps, basicProperties) ? data.basic_properties = basicProperties : null;
    !isEqual(initialIntegrationProps, integrationProperties) ? data.integration_properties = integrationProperties : null;
    setLoading(true);
    setSaving(true);
    await bulkEditProperties({
      store, data, enqueueSnackbar
    });
    setLoading(false);
  };

  return (
    <div>
      <FullScreenDlg title="Bulk edit" open={open} handleConfirm={handleBulkEdit} handleClose={onClose} disableConfirm={!isValidForm || saving}>
        <GeneralProps
          description="At this point all general properties can be edited."
          price={price}
          loading={saving}
          onChange={handleChange}
          dimensions={dimension}
          onDimensionChange={handleDimensionChange}
        />
        <br />
        <IntegrationProps
          title="Integration Properties"
          description="At this point all common properties from an integration and category can be edited."
          loading={loading}
          properties={integrationProperties}
          errors={errorProps}
          onChange={handlePropertiesChange}
        />
      </FullScreenDlg>
    </div>
  );
}

BulkEditProducts.defaultProps = {
  params: null
};

BulkEditProducts.propTypes = {
  open: PropTypes.bool.isRequired,
  params: PropTypes.object,
  enqueueSnackbar: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default withSnackbar(BulkEditProducts);
