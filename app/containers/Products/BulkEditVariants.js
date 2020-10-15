import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { getBulkEditProperties, bulkEditProperties } from 'dan-api/services/variants';
import PageHeader from 'dan-containers/Common/PageHeader';
import GeneralProps from 'dan-components/Products/GeneralProps';
import IntegrationProps from 'dan-components/Products/IntegrationProps';
import FormActions from 'dan-containers/Common/FormActions';

function BulkEditVariants(props) {
  const {
    history, store, bulkEditData, enqueueSnackbar
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
  const [loading, setLoading] = useState(false);
  const [integrationProps, setIntegrationProps] = useState([]);

  const [touched, setTouched] = useState(false);

  useEffect(() => {
    async function getIntegrationProps() {
      if (bulkEditData) {
        setLoading(true);
        const response = await getBulkEditProperties({
          store, integrationId: bulkEditData.get('integration'), categoryId: bulkEditData.get('category'), enqueueSnackbar
        });
        response.data ? setIntegrationProps(response.data) : null;
        setLoading(false);
      }
    }
    getIntegrationProps();
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

  const handleBulkEdit = async () => {
    setLoading(true);
    const basicProperties = { price, original_price: originalPrice, quantity, package: dimension };
    await bulkEditProperties({
      store, remoteIds: bulkEditData.get('remoteIds'), basicProperties, properties: bulkEditData.get('properties'), enqueueSnackbar
    });
    setLoading(false);
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
        properties={integrationProps}
        onTouchedProps={handleTouchedProps}
      />
      {!loading && <FormActions acceptButtonDisabled={!touched} onAcceptClick={handleBulkEdit} history={history} />}
    </div>
  );
}

BulkEditVariants.propTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.string.isRequired,
  bulkEditData: PropTypes.any.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  bulkEditData: state.getIn(['variant', 'bulkEditData']),
  store: state.getIn(['user', 'tenantName']),
  ...state
});

const BulkEditVariantsMapped = connect(
  mapStateToProps,
  null
)(BulkEditVariants);

export default withSnackbar(BulkEditVariantsMapped);
