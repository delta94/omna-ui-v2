import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  circularProgress: {
    zIndex: 1500,
    position: 'fixed',
    top: 'calc(50% - 45px)',
    left: 'calc(50% - 45px)'
  },
  circularProgressText: {
    zIndex: 1500,
    position: 'fixed',
    top: 'calc(64% - 55px)',
    left: 'calc(40% - 45px)'
  }
});

function InstallShopify() {
  const classes = useStyles();

  return (
    <div>
      <CircularProgress
        className={classes.circularProgress}
        size={70}
        thickness={2}
        color="secondary"
      />
      <h2 className={classes.circularProgressText}>
        OMNA App is loading for Shopify
      </h2>
    </div>
  );
}

export default InstallShopify;
