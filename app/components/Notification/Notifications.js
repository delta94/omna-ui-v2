import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import { IconButton } from '@material-ui/core';
import Alert from './Alert';
import { deleteNotification } from '../../actions/NotificationActions';

const styles = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
  customStyle: {
    maxWidth: '100%',
    borderRadius: '5px'
  },
  box: {
    marginBottom: theme.spacing(2),
  }
});

function Notifications(props) {
  const { classes, list, onDeleteNotification } = props;

  const handleClose = (index) => onDeleteNotification(index);

  return (
    <Fragment>
      {list.size !== 0 && list.map(({ message, variant, action }, index) =>
        (
          <Alert
            key={`${index.toString()}${Math.random()}`}
            message={message}
            variant={variant}
            action={
              (
                <Fragment>
                  {action}
                  <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={() => handleClose(index)}
                  >
                    <CloseIcon />
                  </IconButton>
                </Fragment>
              )
            }
          />
        )
      )}
    </Fragment>
  );
}

Notifications.propTypes = {
  classes: PropTypes.object.isRequired,
  list: PropTypes.object.isRequired,
  onDeleteNotification: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  onDeleteNotification: bindActionCreators(deleteNotification, dispatch),
});

const Notifications2Mapped = withSnackbar(withStyles(styles)(Notifications));

export default connect(
  null,
  mapDispatchToProps
)(Notifications2Mapped);

