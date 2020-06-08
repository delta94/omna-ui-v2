import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

function NumberFormatCustom(props) {
  const { inputRef, name, prefix, decimalScale, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            name,
            value: values.floatValue,
          },
        });
      }}
      isNumericString={false}
      thousandSeparator
      fixedDecimalScale
      decimalScale={decimalScale}
      prefix={prefix}
    />
  );
}

NumberFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  prefix: PropTypes.string,
  decimalScale: PropTypes.number,
  inputRef: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

NumberFormatCustom.defaultProps = {
  prefix: '',
  decimalScale: 2
};

export default NumberFormatCustom;
