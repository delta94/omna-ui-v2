import React from 'react';
import Button from '@material-ui/core/Button';

import PropTypes from 'prop-types';

const FormActions = props => {
  const {
    cancelButtonLabel,
    acceptButtonLabel,
    acceptButtonDisabled,
    history,
    onAcceptClick,
    onCancelClick,
    type
  } = props;

  const handleCancelAction = () => {
    typeof history !== 'undefined' ? history.goBack() : onCancelClick();
  };

  return (
    <div
      className="display-flex flex-direction-row-inverse"
      style={{ marginBottom: '25px', marginTop: '25px' }}
    >
      <Button
        variant="contained"
        size="medium"
        color="primary"
        type={type}
        disabled={acceptButtonDisabled}
        onClick={onAcceptClick}
        style={{ marginLeft: '10px' }}
      >
        {acceptButtonLabel}
      </Button>
      <Button
        variant="contained"
        size="medium"
        color="default"
        onClick={handleCancelAction}
        style={{ marginLeft: '10px' }}
      >
        {cancelButtonLabel}
      </Button>
    </div>
  );
};

FormActions.defaultProps = {
  cancelButtonLabel: 'Cancel',
  acceptButtonLabel: 'Save',
  type: 'submit',
  acceptButtonDisabled: false,
  onAcceptClick: () => {}
};

FormActions.propTypes = {
  history: PropTypes.object.isRequired,
  cancelButtonLabel: PropTypes.string,
  acceptButtonLabel: PropTypes.string,
  type: PropTypes.string,
  onAcceptClick: PropTypes.func,
  onCancelClick: PropTypes.func,
  acceptButtonDisabled: PropTypes.bool
};

export default FormActions;
