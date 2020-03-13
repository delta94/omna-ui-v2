import React from 'react';
import { Link, IconButton } from '@material-ui/core';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';
import { Link as RouterLink } from 'react-router-dom';

export const subscribeAction = (
  <IconButton onClick={() => window.open('https://cenit.io/billing')}>
    <Link
      variant="body2"
      style={{ marginRight: '10px' }}
    >
      billing settings
    </Link>
  </IconButton>
);

export const goToTaskAction = (id) => (
  <Link
    variant="body2"
    style={{ marginRight: '10px' }}
    component={RouterLink}
    to={`app/tasks/${id}`}
  >
    Go to task
  </Link>
);

export const installOv2CollectionAction = (onInstallCollection) => (
  <IconButton
    key="install"
    aria-label="install"
    color="inherit"
    onClick={() => onInstallCollection()}
  >
    <VerticalAlignBottomIcon />
  </IconButton>
);
