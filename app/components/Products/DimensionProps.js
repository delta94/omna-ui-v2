import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import NumberFormat from 'react-number-format';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import 'dan-styles/vendors/slick-carousel/slick-carousel.css';
import 'dan-styles/vendors/slick-carousel/slick.css';
import 'dan-styles/vendors/slick-carousel/slick-theme.css';
import styles from './product-jss';

function NumberFormatCustom(props) {
  const { inputRef, name, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            name,
            value: parseFloat(values.value),
          },
        });
      }}
      thousandSeparator
      fixedDecimalScale
      decimalScale={2}
      prefix={name === 'weight' ? 'kg' : 'cm'}
    />
  );
};

NumberFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

const DimensionProps = memo((props) => {
  const {
    weight, height, length, width, content, classes, onDimensionChange
  } = props;

  return (
    <Paper className={classes.dimensionContainer} elevation={0}>
      <Typography variant="subtitle2" gutterBottom>
        Package
      </Typography>
      <div className={classes.dimensionItems}>
        <TextField
          className={classes.formControl}
          label="Weight"
          name="weight"
          value={weight}
          onChange={(e) => onDimensionChange(e)}
          variant="outlined"
          id="formatted-numberformat-input"
          InputProps={{
            inputComponent: NumberFormatCustom,
          }}
        />
        <TextField
          className={classes.formControl}
          label="Height"
          name="height"
          value={height}
          onChange={(e) => onDimensionChange(e)}
          variant="outlined"
          id="formatted-numberformat-input"
          InputProps={{
            inputComponent: NumberFormatCustom,
          }}
        />
        <TextField
          className={classes.formControl}
          label="Width"
          name="width"
          value={width}
          onChange={(e) => onDimensionChange(e)}
          variant="outlined"
          id="formatted-numberformat-input"
          InputProps={{
            inputComponent: NumberFormatCustom,
          }}
        />
        <TextField
          className={classes.formControl}
          label="Length"
          name="length"
          value={length}
          onChange={(e) => onDimensionChange(e)}
          variant="outlined"
          id="formatted-numberformat-input"
          InputProps={{
            inputComponent: NumberFormatCustom,
          }}
        />
        <TextField
          className={classes.formControl}
          label="Content"
          name="content"
          value={content}
          onChange={(e) => onDimensionChange(e)}
          variant="outlined"
          id="content-input"
        />
      </div>
    </Paper>
  );
});

DimensionProps.propTypes = {
  weight: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  length: PropTypes.number.isRequired,
  width: PropTypes.number,
  content: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  onDimensionChange: PropTypes.func.isRequired
};

export default withStyles(styles)(DimensionProps);
