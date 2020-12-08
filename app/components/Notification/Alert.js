import React from 'react';
import PropTypes from 'prop-types';
import { Alert as AlertLab } from '@material-ui/lab';
function Alert(props) {
  const {
    message, variant, action, onClose
  } = props;

  return (
    <AlertLab severity={variant} action={action} onClose={onClose}>{message}</AlertLab>
  );
}

Alert.propTypes = {
  message: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired,
  action: PropTypes.object,
  onClose: PropTypes.func
};

Alert.defaultProps = {
  action: null,
  onClose: undefined,
};

export default Alert;
