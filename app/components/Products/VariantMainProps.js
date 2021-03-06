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

  const { sku, price, images, originalPrice, quantity, action, classes } = props;

  const handleSKUChange = (e) => props.onSkuChange(e.target.value);
  const handlePriceChange = (e) => props.onPriceChange(e.target.value);
  const handleOriginalPriceChange = (e) => props.onOriginalPriceChange(e.target.value);

  return (
    <div>
      <Grid className={classes.root} container>
        <Grid item md={4} sm={12} xs={12}>
          <Carousel images={images} />
        </Grid>
        <Grid item md={6} sm={12} xs={12}>
          <div className={classes.variantContainer}>
            {action === 'add' ? (
              <TextField
                className={classes.formControl}
                label="SKU"
                required
                name="sku"
                value={sku}
                onChange={handleSKUChange}
                variant="outlined"
                id="sku"
              />
            ) : (
              <Typography variant="subtitle1" className={classes.formControl} gutterBottom>
                <span className={classNames(Type.textInfo, Type.bold)}>SKU:</span>
                {' '}
                <span className={Type.bold}>{sku}</span>
              </Typography>
            )
            }
            {action !== 'add' && (
              <Typography variant="subtitle1" className={classes.formControl} gutterBottom>
                <span className={classNames(Type.textInfo, Type.bold)}>Quantity:</span>
                {' '}
                <span className={Type.bold}>{quantity}</span>
              </Typography>
            )}
            <TextField
              className={classes.formControl}
              label="Price"
              name="price"
              value={price}
              required
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
              required
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
  sku: PropTypes.string,
  images: PropTypes.array,
  quantity: PropTypes.number,
  price: PropTypes.number,
  originalPrice: PropTypes.number,
  action: PropTypes.oneOf(['add', 'edit']),
  onSkuChange: PropTypes.func,
  onPriceChange: PropTypes.func.isRequired,
  onOriginalPriceChange: PropTypes.func.isRequired
};

VariantMainProps.defaultProps = {
  sku: '',
  quantity: undefined,
  price: undefined,
  originalPrice: undefined,
  images: [],
  action: 'add',
  onSkuChange: () => { }
};

export default withStyles(styles)(VariantMainProps);
