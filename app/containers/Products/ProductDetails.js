import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { withStyles } from '@material-ui/core/styles';
import 'dan-styles/vendors/slick-carousel/slick-carousel.css';
import 'dan-styles/vendors/slick-carousel/slick.css';
import 'dan-styles/vendors/slick-carousel/slick-theme.css';
import Loading from 'dan-components/Loading';
import styles from './product-jss';

import API from '../Utils/api';
import PageHeader from '../Common/PageHeader';
import ProductForm from './ProductForm';
import { getProductVariantList } from '../../actions/IntegrationActions';

/* const vList = [
  {
    id: '5d54835a25d985682d014e0e',
    sku: '0018227994576',
    price: 49.9,
    cost_price: 49.9,
    quantity: 0,
    product: {
      id: '5d54835825d985682d014e04',
      name: 'Actxa Swift - Test Do Not Buy'
    },
    images: [
      'https://cf.lazada.sg/file/dfd9210dc1f3ec1b7432d5ac0cf000',
      'https://cf.lazada.sg/file/dfd9210dc1f3ec1b7432d5ac0cf001'
    ],
    integrations: [
      {
        id: 'shopee',
        name: 'shopee',
        channel: 'ShopeeSG',
        variant: {
          remote_variant_id: '5395303626',
          properties: [{
            id: 'video',
            label: 'Video URL',
            required: false,
            input_type: 'text',
            options: [],
            value: null
          },
          {
            id: 'brand',
            label: 'Brand',
            required: true,
            input_type: 'single_select',
            options: [],
            value: '3D Crystal Puzzle'
          },
          {
            id: 'model',
            label: 'Model',
            required: true,
            input_type: 'text',
            options: [],
            value: '1'
          },
          {
            id: 'app_activity_type',
            label: 'Activity Type',
            required: false,
            input_type: 'multi_select',
            options: ['Games', 'Health', 'Home', 'Music', 'Sports'],
            value: null
          }]
        }
      },
    ]
  },
  {
    id: '5d54835a25d985682d014e0e',
    sku: '0018227994576',
    price: 49.9,
    cost_price: 49.9,
    quantity: 0,
    product: {
      id: '5d54835825d985682d014e04',
      name: 'Actxa Swift - Test Do Not Buy'
    },
    images: [
      'https://cf.lazada.sg/file/dfd9210dc1f3ec1b7432d5ac0cf000',
      'https://cf.lazada.sg/file/dfd9210dc1f3ec1b7432d5ac0cf001'
    ],
    integrations: [
      {
        id: 'shopee',
        name: 'shopee',
        channel: 'ShopeeSG',
        variant: {
          remote_variant_id: '5395303626',
          properties: [{
            id: 'video',
            label: 'Video URL',
            required: false,
            input_type: 'text',
            options: [],
            value: null
          },
          {
            id: 'brand',
            label: 'Brand',
            required: true,
            input_type: 'single_select',
            options: [],
            value: '3D Crystal Puzzle'
          },
          {
            id: 'model',
            label: 'Model',
            required: true,
            input_type: 'text',
            options: [],
            value: '1'
          },
          {
            id: 'app_activity_type',
            label: 'Activity Type',
            required: false,
            input_type: 'multi_select',
            options: ['Games', 'Health', 'Home', 'Music', 'Sports'],
            value: null
          }]
        }
      },
    ]
  }]; */

function ProductDetails(props) {
  const {
    history, match, updateProductVariants, productVariants
  } = props;
  const [product, setProduct] = useState(
    JSON.parse(sessionStorage.getItem(`${match.params.id}`))
  );
  const [variantList, setVariantList] = useState(productVariants);
  // const [variantList, setVariantList] = useState(vList);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    API.get(`products/${match.params.id}`)
      .then(response => {
        const { data } = response.data;
        setProduct(data);
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => {
        setIsLoading(false);
      });
  }, [match.params.id]);

  useEffect(() => {
    if (product) {
      if (product.variants > 0) {
        const integration = product.integrations[0];
        const { id, product: _product } = integration;
        updateProductVariants(id, _product.remote_product_id);
        setVariantList(productVariants);
      }
    }
  }, [product]);

  useEffect(() => {
    setVariantList(productVariants);
  }, [productVariants]);

  return (
    <div>
      {isLoading ? <Loading /> : null}
      <PageHeader title="Product Details" history={history} />
      {product && (
        <ProductForm
          name={product.name}
          price={product.price}
          description={product.description}
          images={product.images}
          integrations={product.integrations}
          history={history}
          variants={product.variants}
          variantList={variantList}
        />
      )}
    </div>
  );
}

ProductDetails.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  // properties: PropTypes.object.isRequired,
  productVariants: PropTypes.object.isRequired,
  updateProductVariants: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  productVariants: state.getIn(['integrations', 'productVariants'])
  // properties: state.getIn(['integrations', 'properties'])
});

const mapDispatchToProps = dispatch => ({
  updateProductVariants: bindActionCreators(getProductVariantList, dispatch)
});

const ProductDetailsMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductDetails);

export default withStyles(styles)(ProductDetailsMapped);
