/* eslint-disable react/jsx-no-duplicate-props */
import React, { memo, Fragment } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { PapperBlock } from 'dan-components';
import NumberFormatCustom from 'dan-components/NumberFormatCustom';
import TypographySkeleton from 'dan-components/Skeleton/index';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import DimensionProps from './DimensionProps';

const styles = () => ({
  formControl: {
    width: '100%'
  },
});

const GeneralProps = memo((props) => {
  const {
    price, originalPrice, dimensions, loading, type, title, description, classes,
    onChange, onDimensionChange
  } = props;

  return (
    <PapperBlock title={title} icon="ios-card" desc={description}>
      {loading ? <TypographySkeleton /> : (
        <Fragment>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price"
                name="price"
                value={price}
                onChange={onChange}
                variant="outlined"
                id="price-numberformat-input"
                className={classes.formControl}
                inputProps={{
                  prefix: '$ '
                }}
                InputProps={{
                  inputComponent: NumberFormatCustom,
                }}
              />
            </Grid>
            {type !== 'product' && (
              <Fragment>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Original Price"
                    name="originalPrice"
                    value={originalPrice}
                    onChange={onChange}
                    variant="outlined"
                    id="originalPrice-numberformat-input"
                    className={classes.formControl}
                    inputProps={{
                      prefix: '$ '
                    }}
                    InputProps={{
                      inputComponent: NumberFormatCustom,
                    }}
                  />
                </Grid>
              </Fragment>
            )}
          </Grid>
          <DimensionProps
            {...dimensions}
            unmountPaper
            onDimensionChange={onDimensionChange}
          />
        </Fragment>
      )}
    </PapperBlock>
  );
});

GeneralProps.propTypes = {
  price: PropTypes.number.isRequired,
  originalPrice: PropTypes.number,
  dimensions: PropTypes.object.isRequired,
  type: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  loading: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onDimensionChange: PropTypes.func.isRequired
};

GeneralProps.defaultProps = {
  originalPrice: undefined,
  type: 'product',
  loading: false,
  title: 'General Properties',
  description: ''
};

export default withStyles(styles)(GeneralProps);
