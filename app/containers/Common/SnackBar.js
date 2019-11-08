import React, { Fragment } from 'react';

import SnackbarContent from '@material-ui/core/SnackbarContent';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import Link from '@material-ui/core/Link';
import { Link as RouterLink } from 'react-router-dom';
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

const action = (
  <div>
    <Link
      variant="body2"
      style={{ marginRight: '10px' }}
      component={RouterLink}
      to="/app/tenant-configuration"
    >
      Initialize tenant
    </Link>
    <Link
      variant="body2"
      component={RouterLink}
      to="/app/add-tenant"
    >
      Create new tenat
    </Link>
  </div>
);

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
    classes, className, message, variant, customStyle, open
  } = props;
  const Icon = variantIcon[variant];
  const customColor = customColors[variant];

  return (
    <Fragment>
      {open && (
        <div className={classes.box}>
          <SnackbarContent
            className={classNames(classes.customStyle, customStyle ? messageStyles[customColor] : classes[variant], className)}
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
  className: PropTypes.object.isRequired,
  message: PropTypes.string.isRequired,
  variant: PropTypes.string.isRequired,
  customStyle: PropTypes.bool.isRequired,
  open: PropTypes.bool.isRequired,
};

export default withStyles(styles)(MySnackBar);
