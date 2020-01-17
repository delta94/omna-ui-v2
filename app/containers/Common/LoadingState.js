import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import Fade from '@material-ui/core/Fade';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column'
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600'
  },
  spinner: {
    margin: 16
  }
});

function LoadingState(props) {
  const { classes, loading, text } = props;

  return (
    <div className={classes.root}>
      <Fade in={loading} unmountOnExit>
        <Fragment>
          <CircularProgress className={classes.spinner} />
          {text ? (
            <Typography className={classes.loadingText}>
              {`${text}...`}
            </Typography>
          ) : null}
        </Fragment>
      </Fade>
    </div>
  );
}

LoadingState.propTypes = {
  classes: PropTypes.object.isRequired,
  text: PropTypes.string,
  loading: PropTypes.bool
};

LoadingState.defaultProps = {
  text: 'Loading',
  loading: true
};

export default withStyles(styles)(LoadingState);
