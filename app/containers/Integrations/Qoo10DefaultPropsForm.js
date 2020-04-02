import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';

const Qoo10DefaultPropsForm = ({ classes }) => {
  const [defaultProps, setDefaultProps] = useState({
    productionPlace: '',
    adultYN: true,
    industrialCodeType: '',
    contactTel: '',
    contactEmail: '',
    shippingNo: ''
  });

  const onInputChange = e => {
    const { name, value } = e.target;
    setDefaultProps({ ...defaultProps, [name]: value });
  };

  return (
    <div>
      <TextField
        required
        label="Production Place"
        value={defaultProps.productionPlace}
        name="productionPlace"
        onChange={onInputChange}
        margin="normal"
        variant="outlined"
        className={classes.inputWidth}
      />

      <TextField
        required
        label="Days to ship"
        value={defaultProps.daysToShip}
        name="daysToShip"
        onChange={onInputChange}
        margin="normal"
        variant="outlined"
        className={classes.inputWidth}
      />

      <TextField
        required
        label="Industrial Code Type"
        value={defaultProps.industrialCodeType}
        name="industrialCodeType"
        onChange={onInputChange}
        margin="normal"
        variant="outlined"
        className={classes.inputWidth}
      />

      <TextField
        required
        label="Contact Tel"
        value={defaultProps.contactTel}
        name="contactTel"
        onChange={onInputChange}
        margin="normal"
        variant="outlined"
        className={classes.inputWidth}
      />

      <TextField
        required
        label="Contact Email"
        value={defaultProps.contactEmail}
        name="contactEmail"
        onChange={onInputChange}
        margin="normal"
        variant="outlined"
        className={classes.inputWidth}
      />

      <TextField
        required
        label="Shipping No."
        value={defaultProps.shippingNo}
        name="shippingNo"
        onChange={onInputChange}
        margin="normal"
        variant="outlined"
        className={classes.inputWidth}
      />
    </div>
  );
};

Qoo10DefaultPropsForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default Qoo10DefaultPropsForm;
