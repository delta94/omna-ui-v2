import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Loading from 'dan-components/Loading';

import PageHeader from 'dan-containers/Common/PageHeader';
import VariantForm from 'dan-components/Products/VariantForm';
import { createVariant } from 'dan-actions/variantActions';

function AddVariant(props) {
  const { match, loading, history, create, onAddVariant, enqueueSnackbar } = props;
  const [sku, setSKU] = useState('');
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

  const prevCreateProp = useRef(create);

  useEffect(() => {
    if (create && create !== prevCreateProp.current) {
      history.goBack();
    }
  }, [create]);

  const handleDimensionChange = e => setDimension((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));

  const handleSubmitForm = async () => {
    const data = { sku, quantity, price, original_price: originalPrice, package: dimension };
    onAddVariant(match.params.id, data, enqueueSnackbar);
  };

  return (
    <div>
      {loading ? <Loading /> : null}
      <PageHeader title="Add variant" history={history} />
      <VariantForm
        sku={sku}
        quantity={quantity}
        price={price}
        originalPrice={originalPrice}
        dimension={dimension}
        action="add"
        onSKUChange={(e) => setSKU(e)}
        onQuantityChange={(e) => setQuantity(e)}
        onPriceChange={e => setPrice(e)}
        onOriginalPriceChange={e => setOriginalPrice(e)}
        onDimensionChange={handleDimensionChange}
        onCancelClick={() => history.goBack()}
        onSubmitForm={handleSubmitForm}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  loading: state.getIn(['variant', 'loading']),
  create: state.getIn(['variant', 'create']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  onAddVariant: bindActionCreators(createVariant, dispatch)
});

const AddVariantMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddVariant);

AddVariant.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  create: PropTypes.object,
  onAddVariant: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

AddVariant.defaultProps = {
  create: null
};

export default withSnackbar(AddVariantMapped);
