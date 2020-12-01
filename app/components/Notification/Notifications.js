import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withSnackbar } from 'notistack';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { deleteNotification } from 'dan-actions/NotificationActions';
import Alert from './Alert';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2)
    },
    marginBottom: theme.spacing(1)
  },
}));

function Notifications(props) {
  const { list, onDeleteNotification } = props;

  const classes = useStyles();

  const handleClose = (index) => onDeleteNotification(index);

  const handleActionClick = (index, callback) => {
    callback();
    setTimeout(() => onDeleteNotification(index), 1500);
  };

  return (
    <div className={classes.root}>
      {list.size !== 0 && list.map(({ message, variant, action }, index) => (
        <Alert
          key={`${index.toString()}${Math.random()}`}
          message={message}
          variant={variant}
          action={
            (
              <Fragment>
                {action && (
                  <Button color="inherit" size="small" onClick={() => handleActionClick(index, action.callback)}>
                    {action.title}
                  </Button>
                )}
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
          onClose={() => handleClose(index)}
        />
      )
      )}
    </div>
  );
}

Notifications.propTypes = {
  list: PropTypes.object.isRequired,
  onDeleteNotification: PropTypes.func.isRequired
};

/* Action.propTypes = {
  index: PropTypes.number.isRequired,
  action: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
}; */

const mapDispatchToProps = dispatch => ({
  onDeleteNotification: bindActionCreators(deleteNotification, dispatch),
});

const Notifications2Mapped = withSnackbar(Notifications);

export default connect(
  null,
  mapDispatchToProps
)(Notifications2Mapped);
