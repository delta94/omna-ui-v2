import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import 'dan-styles/vendors/slick-carousel/slick-carousel.css';
import 'dan-styles/vendors/slick-carousel/slick.css';
import 'dan-styles/vendors/slick-carousel/slick-theme.css';
import Fab from '@material-ui/core/Fab';
import EditIcon from '@material-ui/icons/Edit';
import Loading from 'dan-components/Loading';

import styles from './product-jss';

import API from '../Utils/api';
import PageHeader from '../Common/PageHeader';
import ProductForm from './ProductForm';
import { setProduct, getProductVariantList } from '../../actions/IntegrationActions';

function ProductDetails(props) {
  const {
    history, match, product, getProduct, classes, productVariants, updateProductVariants
  } = props;
  const {
    name, price, description, variants, images, integrations
  } = product || {};
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      try {
        const response = await API.get(`products/${match.params.id}`);
        const { data } = response.data;
        getProduct(data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }
    fetchProduct();
  }, [match.params.id]);

  useEffect(() => {
    if (product) {
      const { id, product: _product } = product.integrations[0];
      updateProductVariants(id, _product.remote_product_id);
    }
  }, [product ? product.id : '']);

  const handleEdit = async () => {
    const { enqueueSnackbar } = props;
    // const { name, price, description } = product;
    const data = { name, price: parseFloat(price), description };
    setIsLoading(true);
    try {
      await API.post(`products/${match.params.id}`, { data });
      history.goBack();
      enqueueSnackbar('Product edited successfuly', {
        variant: 'success'
      });
    } catch (error) {
      if (error && error.response.data.message) {
        enqueueSnackbar(error.response.data.message, {
          variant: 'error'
        });
      }
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? <Loading /> : null}
      <PageHeader title="Edit product" history={history} />
      <ProductForm
        name={name}
        price={price}
        description={description}
        images={images}
        variants={variants}
        integrations={integrations}
        variantList={productVariants}
      />
      <Fab color="secondary" aria-label="edit" className={classes.editFloatBtn} onClick={() => handleEdit()}>
        <EditIcon />
      </Fab>
    </div>
  );
}

ProductDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired,
  getProduct: PropTypes.func.isRequired,
  productVariants: PropTypes.array.isRequired,
  updateProductVariants: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

/* ProductDetails.defaultProps = {
  product: null
}; */

const mapStateToProps = state => ({
  product: state.getIn(['integrations', 'product']),
  productVariants: state.getIn(['integrations', 'productVariants']),
  ...state
});

const mapDispatchToProps = (dispatch) => ({
  getProduct: bindActionCreators(setProduct, dispatch),
  updateProductVariants: bindActionCreators(getProductVariantList, dispatch),
});

const ProductDetailsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductDetails);

export default withStyles(styles)(withSnackbar(ProductDetailsMapped));
