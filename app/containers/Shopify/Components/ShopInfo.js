import React from 'react';
import { Tooltip, Zoom, Typography } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles, makeStyles } from '@material-ui/core/styles';

const StyledTooltip = withStyles(theme => ({
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 14
  }

}))(Tooltip);

const useStyles = makeStyles(() => ({
  info: {
    margin: '0px 20px',
    cursor: 'pointer'
  },
  icon: {
    width: '24px',
    height: '24px',
    position: 'relative',
    top: '-4px',
    left: '-4px'
  }
}));

function ShopInfo(props) {
  const { name, domain } = props;

  const classes = useStyles();

  return (
    <StyledTooltip TransitionComponent={Zoom}
      title={domain}
      placement="left"
      interactive
      {...props}>
      <div className={classes.info}>
        <img src="https://cdn.shopify.com/shopifycloud/web/assets/v1/fadd62d4f33b5391d0eaa0de0ca7491a.svg"
          alt={name}
          className={classes.icon}
        />
        <Typography variant="h6"
          component="span">
          {name}
        </Typography>
      </div>
    </StyledTooltip>
  );
}

export default ShopInfo;

ShopInfo.propTypes = {
  name: PropTypes.string.isRequired,
  domain: PropTypes.string
};
