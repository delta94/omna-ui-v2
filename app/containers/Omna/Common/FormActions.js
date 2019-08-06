import React from 'react';
import Button from '@material-ui/core/Button';

import PropTypes from 'prop-types';

function FormActions(props) {
  const {
    cancelBtnLabel, acceptBtnLabel, acceptBtnAction, acceptBtnDisabled, history, type
  } = props;

  const handleCancelAction = () => {
    history.goBack();
  };

  return (
    <div className="display-flex flex-direction-row-inverse" style={{ marginBottom: '25px', marginTop: '25px' }}>
      <Button
        variant="contained"
        size="medium"
        color="primary"
        type={type}
        disabled={acceptBtnDisabled}
        onClick={acceptBtnAction}
        style={{ marginLeft: '10px' }}
      >
        {acceptBtnLabel}
      </Button>
      <Button
        variant="contained"
        size="medium"
        color="default"
        onClick={handleCancelAction}
        style={{ marginLeft: '10px' }}
      >
        {cancelBtnLabel}
      </Button>
    </div>
  );
}

FormActions.defaultProps = {
  cancelBtnLabel: 'Cancel',
  acceptBtnLabel: 'Add',
  type: 'submit',
  acceptBtnDisabled: false,
  acceptBtnAction: () => {}
};

FormActions.propTypes = {
  history: PropTypes.object.isRequired,
  cancelBtnLabel: PropTypes.string,
  acceptBtnLabel: PropTypes.string,
  type: PropTypes.string,
  acceptBtnAction: PropTypes.func,
  acceptBtnDisabled: PropTypes.bool,
};

export default FormActions;
