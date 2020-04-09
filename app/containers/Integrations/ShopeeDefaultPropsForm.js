import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

const ShopeeDefaultPropsForm = ({
  classes,
  defaultProperties,
  handleChange
}) => {
  return (
    <div>
      <TextField
        required
        label="Days to ship"
        value={defaultProperties.daysToShip}
        name="defaultProperties.daysToShip"
        onChange={handleChange}
        margin="dense"
        variant="outlined"
        className={classes.inputWidth}
      />

      {/* <TextField
        required
        select
        label="Logistics"
        value={defaultProps.selectedLogistic}
        name="selectedLogistic"
        onChange={onInputChange}
        SelectProps={{
          MenuProps: {
            className: classes.inputWidth
          }
        }}
        margin="normal"
        variant="outlined"
        className={classes.inputWidth}
      >
        {logistics &&
          logistics.data.map(option => (
            <MenuItem key={option.name} value={option.name}>
              {option.title}
            </MenuItem>
          ))}
      </TextField> */}
    </div>
  );
};

ShopeeDefaultPropsForm.propTypes = {
  classes: PropTypes.object.isRequired,
  defaultProperties: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default ShopeeDefaultPropsForm;
