import React from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

const Qoo10DefaultPropsForm = ({
  classes,
  defaultProperties,
  handleChange
}) => {
  return (
    <div>
      <TextField
        required
        label="Production Place"
        value={defaultProperties.productionPlace}
        name="defaultProperties.productionPlace"
        onChange={handleChange}
        margin="dense"
        variant="outlined"
        className={classes.inputWidth}
      />

      <TextField
        required
        label="Days to ship"
        value={defaultProperties.adultYN}
        name="defaultProperties.adultYN"
        onChange={handleChange}
        margin="dense"
        variant="outlined"
        className={classes.inputWidth}
      />

      <TextField
        required
        label="Industrial Code Type"
        value={defaultProperties.industrialCodeType}
        name="defaultProperties.industrialCodeType"
        onChange={handleChange}
        margin="dense"
        variant="outlined"
        className={classes.inputWidth}
      />

      <TextField
        required
        label="Contact Tel"
        value={defaultProperties.contactTel}
        name="defaultProperties.contactTel"
        onChange={handleChange}
        margin="dense"
        variant="outlined"
        className={classes.inputWidth}
      />

      <TextField
        required
        label="Contact Email"
        value={defaultProperties.contactEmail}
        name="defaultProperties.contactEmail"
        onChange={handleChange}
        margin="dense"
        variant="outlined"
        className={classes.inputWidth}
      />

      <TextField
        required
        label="Shipping No."
        value={defaultProperties.shippingNo}
        name="defaultProperties.shippingNo"
        onChange={handleChange}
        margin="dense"
        variant="outlined"
        className={classes.inputWidth}
      />
    </div>
  );
};

Qoo10DefaultPropsForm.propTypes = {
  classes: PropTypes.object.isRequired,
  defaultProperties: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default Qoo10DefaultPropsForm;
