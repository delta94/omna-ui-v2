import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import PropTypes from 'prop-types';

const AlertDialog = props => {
  const {
    open, title, message, cancelButtonLabel, confirmButtonLabel, handleCancel, handleConfirm
  } = props;

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} color="primary">
            {cancelButtonLabel}
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            {confirmButtonLabel}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

AlertDialog.defaultProps = {
  open: false,
  title: 'Alert',
  message: 'Are you sure you want to do the action?',
  cancelButtonLabel: 'Cancel',
  confirmButtonLabel: 'Confirm'
};

AlertDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  cancelButtonLabel: PropTypes.string,
  confirmButtonLabel: PropTypes.string,
  handleCancel: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired
};

export default AlertDialog;
