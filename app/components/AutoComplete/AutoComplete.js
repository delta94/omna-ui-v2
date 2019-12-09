import React from 'react';
import PropTypes from 'prop-types';
import { SingleSelect } from 'react-select-material-ui';

const AutoComplete = props => {
  const { data, handleChange, placeholder } = props;
  const options = data.map(item => ({ value: item, label: item.name }));

  return (
    <SingleSelect
      placeholder={placeholder || 'Select an item'}
      options={options}
      onChange={value => handleChange(value)}
    />
  );
};

AutoComplete.propTypes = {
  data: PropTypes.array.isRequired,
  handleChange: PropTypes.func,
  placeholder: PropTypes.string
};

export default AutoComplete;
