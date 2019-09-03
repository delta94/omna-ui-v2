import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import messageStyles from 'dan-styles/Messages.scss';

import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';

const getStatus = status => {
  switch (status) {
    case 'failed':
      return messageStyles.bgError;
    case 'broken':
      return messageStyles.bgError;
    case 'pending':
      return messageStyles.bgWarning;
    case 'completed':
      return messageStyles.bgSuccess;
    default:
      return messageStyles.bgInfo;
    // running, pending, completed, failed, broken, unscheduled
  }
};

const Status = props => {
  const { status, progress, classes } = props;

  return (
    <Tooltip title="Status">
      <Chip
        label={`${status} ${progress}%`}
        className={classNames(classes.chip, getStatus(status))}
      />
    </Tooltip>
  );
};

Status.propTypes = {
  value: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired
};

export default Status;
