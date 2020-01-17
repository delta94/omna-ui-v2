import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import 'dan-styles/vendors/slick-carousel/slick-carousel.css';
import 'dan-styles/vendors/slick-carousel/slick.css';
import 'dan-styles/vendors/slick-carousel/slick-theme.css';
import Loading from 'dan-components/Loading';
import styles from './product-jss';

import API from '../Utils/api';
import PageHeader from '../Common/PageHeader';
import ProductForm from './ProductForm';

function ProductDetails(props) {
  const { history, match } = props;
  const [product, setProduct] = useState(
    JSON.parse(sessionStorage.getItem(`${match.params.id}`))
  );
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
        />
      )}
    </div>
  );
}

ProductDetails.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default withStyles(styles)(ProductDetails);
