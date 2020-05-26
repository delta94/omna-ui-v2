import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import NumberFormat from 'react-number-format';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

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
            value: parseFloat(values.value) || undefined,
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
    weight, height, length, width, content, overwrite = false, classes, onDimensionChange
  } = props;

  const handleOverwriteChange = (e) => onDimensionChange({ target: { name: e.target.name, value: e.target.checked } });

  const handleContentChange = (e) => onDimensionChange({ target: { name: e.target.name, value: e.target.value } });

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
          onChange={onDimensionChange}
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
          onChange={onDimensionChange}
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
          onChange={onDimensionChange}
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
          onChange={onDimensionChange}
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
          onChange={handleContentChange}
          variant="outlined"
          id="content-input"
        />
        <FormControlLabel
          className={classes.formControl}
          control={
            (
              <Checkbox
                name="overwrite"
                checked={overwrite}
                onChange={handleOverwriteChange}
                value="overwrite"
                color="default"
              />
            )
          }
          label="overwrite package information in all variants"
        />
      </div>
    </Paper>
  );
});

DimensionProps.propTypes = {
  weight: PropTypes.number,
  height: PropTypes.number,
  length: PropTypes.number,
  width: PropTypes.number,
  overwrite: PropTypes.bool,
  content: PropTypes.string,
  classes: PropTypes.object.isRequired,
  onDimensionChange: PropTypes.func.isRequired
};

DimensionProps.defaultProps = {
  weight: undefined,
  height: undefined,
  length: undefined,
  width: undefined,
  content: undefined,
  overwrite: false
};

export default withStyles(styles)(DimensionProps);
