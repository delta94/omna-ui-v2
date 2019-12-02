import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

function FormBuilder(props) {
  const {
    id, type, label, value, name, required, placeholder, options, disabled, onChange
  } = props;
  return (
    <TextField
      id={id}
      label={label}
      value={value}
      name={name || label}
      placeholder={placeholder}
      onChange={onChange}
      required={required}
      disabled={disabled}
      select={type === 'single_select'}
      margin="normal"
      variant="outlined"
      style={{ width: '300px' }}
    >
      {options && options.map(option => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
}

FormBuilder.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  required: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default FormBuilder;
