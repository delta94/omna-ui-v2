import React from 'react';
import { PropTypes } from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
const styles = {
  root: {
    zIndex: 1400,
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'fixed',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  circularProgress: {
    zIndex: 1500,
    position: 'fixed',
    top: 'calc(50% - 45px)',
    left: 'calc(50% - 45px)'
  }
};

function Loading(props) {
  const { classes } = props;
  return (
    <div className={classes.root}>
      <CircularProgress
        className={classes.circularProgress}
        size={70}
        thickness={2}
        color="secondary"
      />
    </div>
  );
}

Loading.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles)(Loading);
