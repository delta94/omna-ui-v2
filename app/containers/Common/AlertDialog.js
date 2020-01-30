import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import PropTypes from 'prop-types';

const AlertDialog = props => {
  const handleCancel = () => {
    this.props.handleCancel();
  };

  const handleConfirm = () => {
    this.props.handleConfirm();
  };

  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleCancel} color="primary">
            {props.cancelButtonLabel}
          </Button>
          <Button onClick={props.handleConfirm} color="primary" autoFocus>
            {props.confirmButtonLabel}
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
  confirmButtonLabel: PropTypes.string
};

export default AlertDialog;
