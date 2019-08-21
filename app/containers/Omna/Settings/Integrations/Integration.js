import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import BlockIcon from '@material-ui/icons/Block';

import Utils from '../../Common/Utils';

const Integration = props => {
  const {
    name,
    channel,
    logo,
    authorized,
    classes,
    onIntegrationAuthorized,
    onIntegrationUnauthorized,
    onIntegrationDeleted
  } = props;

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          logo ? (
            <Avatar
              src={logo}
              alt="logo"
              aria-label="Recipe"
              className={classes.avatar}
            />
          ) : null
        }
        title={name}
        subheader={Utils.fullChannelName(channel)}
      />
      <CardActions className={classes.actions}>
        {authorized ? (
          <Tooltip title="unauthorize">
            <IconButton
              aria-label="unauthorize"
              onClick={onIntegrationUnauthorized}
            >
              <BlockIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="authorize">
            <IconButton
              aria-label="authorize"
              onClick={onIntegrationAuthorized}
            >
              <VerifiedUserIcon />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="delete">
          <IconButton aria-label="delete" onClick={onIntegrationDeleted}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

Integration.propTypes = {
  name: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  channel: PropTypes.string.isRequired,
  authorized: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  onIntegrationAuthorized: PropTypes.func.isRequired,
  onIntegrationUnauthorized: PropTypes.func.isRequired,
  onIntegrationDeleted: PropTypes.func.isRequired
};

export default Integration;
