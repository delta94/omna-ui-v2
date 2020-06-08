/* eslint-disable react/jsx-no-duplicate-props */
import React, { memo } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Type from 'dan-styles/Typography.scss';
import NumberFormatCustom from 'dan-components/NumberFormatCustom';
import Carousel from './Carousel';
import styles from './variants-jss';

const VariantMainProps = memo((props) => {

  const { name, price, images, originalPrice, quantity, classes } = props;

  const handleQtyChange = (e) => props.onQuantityChange(e.target.value);
  const handlePriceChange = (e) => props.onPriceChange(e.target.value);
  const handleOriginalPriceChange = (e) => props.onOriginalPriceChange(e.target.value);

  return (
    <div>
      <Grid className={classes.root} container spacing={4}>
        <Grid item md={4} sm={12} xs={12}>
          <Carousel images={images} />
        </Grid>
        <Grid item md={6} sm={12} xs={12}>
          <div className={classes.variantContainer}>
            <Typography variant="subtitle1" className={classes.formControl} gutterBottom>
              <span className={classNames(Type.textInfo, Type.bold)}>SKU:</span>
              {' '}
              <span className={Type.bold}>{name}</span>
            </Typography>
            <TextField
              className={classes.formControl}
              label="Quantity"
              name="quantity"
              value={quantity}
              onChange={handleQtyChange}
              variant="outlined"
              id="quantity"
              inputProps={{
                decimalScale: 0,
              }}
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
            <TextField
              className={classes.formControl}
              label="Price"
              name="price"
              value={price}
              onChange={handlePriceChange}
              variant="outlined"
              id="price"
              inputProps={{
                prefix: '$ ',
              }}
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
            <TextField
              className={classes.formControl}
              label="Original price"
              name="originalPrice"
              value={originalPrice}
              onChange={handleOriginalPriceChange}
              variant="outlined"
              id="original-price"
              inputProps={{
                prefix: '$ ',
              }}
              InputProps={{
                inputComponent: NumberFormatCustom,
              }}
            />
          </div>
        </Grid>
      </Grid>
    </div>

  );
});

VariantMainProps.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  images: PropTypes.array,
  quantity: PropTypes.number,
  price: PropTypes.number,
  originalPrice: PropTypes.number,
  onQuantityChange: PropTypes.func.isRequired,
  onPriceChange: PropTypes.func.isRequired,
  onOriginalPriceChange: PropTypes.func.isRequired
};

VariantMainProps.defaultProps = {
  name: '',
  quantity: undefined,
  price: undefined,
  originalPrice: undefined,
  images: []
};

export default withStyles(styles)(VariantMainProps);
