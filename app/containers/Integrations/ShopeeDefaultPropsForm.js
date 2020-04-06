import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

const ShopeeDefaultPropsForm = ({ classes }) => {
  const [defaultProps, setDefaultProps] = useState({
    daysToShip: 0
    // selecetedLogistic: ''
  });

  const onInputChange = e => {
    const { name, value } = e.target;
    setDefaultProps({ ...defaultProps, [name]: value });
  };

  return (
    <div>
      <TextField
        required
        label="Days to ship"
        value={defaultProps.daysToShip}
        name="daysToShip"
        onChange={onInputChange}
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
  classes: PropTypes.object.isRequired
};

export default ShopeeDefaultPropsForm;
