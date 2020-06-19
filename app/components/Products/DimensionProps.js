/* eslint-disable react/jsx-no-duplicate-props */
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import NumberFormatCustom from 'dan-components/NumberFormatCustom';

const styles = theme => ({
  dimensionItems: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  dimensionContainer: {
    marginTop: theme.spacing(2)
  },
  title: {
    margin: theme.spacing(1)
  },
  formControl: {
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    },
    [theme.breakpoints.up('sm')]: {
      width: '500px'
    },
    margin: theme.spacing(1)
  },
});

const DimensionProps = memo((props) => {
  const {
    weight, height, length, width, content, overwrite = false, overwriteOption = false, classes, onDimensionChange
  } = props;

  const handleOverwriteChange = (e) => onDimensionChange({ target: { name: e.target.name, value: e.target.checked } });

  const handleContentChange = (e) => onDimensionChange({ target: { name: e.target.name, value: e.target.value } });

  return (
    <Paper className={classes.dimensionContainer} elevation={1}>
      <Typography className={classes.title} variant="subtitle2" gutterBottom>
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
          id="weight-numberformat-input"
          inputProps={{
            prefix: 'kg '
          }}
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
          id="height-numberformat-input"
          inputProps={{
            prefix: 'cm '
          }}
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
          id="width-numberformat-input"
          inputProps={{
            prefix: 'cm '
          }}
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
          id="length-numberformat-input"
          inputProps={{
            prefix: 'cm '
          }}
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
        {overwriteOption && (
          <FormControlLabel
            className={classes.formControl}
            control={
              (
                <Checkbox
                  id="overwrite-input"
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
        )}
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
  overwriteOption: PropTypes.bool,
  content: PropTypes.string,
  classes: PropTypes.object.isRequired,
  onDimensionChange: PropTypes.func.isRequired
};

DimensionProps.defaultProps = {
  weight: undefined,
  height: undefined,
  length: undefined,
  width: undefined,
  content: '',
  overwrite: false,
  overwriteOption: false
};

export default withStyles(styles)(DimensionProps);
