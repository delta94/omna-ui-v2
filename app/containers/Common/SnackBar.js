import React, { Fragment } from 'react';

import SnackbarContent from '@material-ui/core/SnackbarContent';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';

import messageStyles from 'dan-styles/Messages.scss';

// const defaultColors = ['success', 'warning', 'error', 'info'];
const customColors = {
  succes: 'bgSuccess', warning: 'bgWarning', error: 'bgError', info: 'bgInfo'
};

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

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
    marginBottom: theme.spacing.unit * 2,
  }
});

function MySnackBar(props) {
  const {
    classes, message, variant, customStyle, open, action
  } = props;
  const Icon = variantIcon[variant];
  const customColor = customColors[variant];

  return (
    <Fragment>
      {open && (
        <div className={classes.box}>
          <SnackbarContent
            className={classNames(classes.customStyle, customStyle ? messageStyles[customColor] : classes[variant])}
            message={(
              <span id="client-snackbar" className={classes.message}>
                <Icon className={classNames(classes.icon, classes.iconVariant)} />
                {message}
              </span>
            )}
            action={action}
          />
        </div>
      )}
    </Fragment>
  );
}

MySnackBar.propTypes = {
  classes: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired,
  customStyle: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
  action: PropTypes.object
};

MySnackBar.defaultProps = {
  action: null
};

export default withStyles(styles)(MySnackBar);
