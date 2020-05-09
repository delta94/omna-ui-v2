import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import classNames from 'classnames';
import { CircularProgress, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48
  },
  // circularProgress: {
  //   zIndex: 2001,
  //   position: 'fixed',
  //   top: 'calc(50% - 45px)',
  //   left: 'calc(50% - 45px)'
  // },
  fullPage: {
    zIndex: 2000,
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    position: 'fixed',
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
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
};

function Loading({ classes, fullPage, text }) {
  return (
    <div className={classNames(classes.root, fullPage && classes.fullPage)}>
      <Fragment>
        <CircularProgress
          className={classes.spinner}
          size={48}
          thickness={3}
          color="primary"
        />
        {text ? (
          <Typography className={classes.loadingText}>
            {`${text}...`}
          </Typography>
        ) : null}
      </Fragment>
    </div>
  );
}

Loading.defaultProps = {
  fullPage: true
};

Loading.propTypes = {
  classes: PropTypes.object.isRequired,
  fullPage: PropTypes.bool,
  text: PropTypes.string
};

export default withStyles(styles)(Loading);
