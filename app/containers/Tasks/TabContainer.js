import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';

const TabContainer = ({ children }) => {
  return (
    <Typography component="div" style={{ margin: '10px' }}>
      {children}
    </Typography>
  );
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

export default TabContainer;
