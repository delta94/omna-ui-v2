import React from 'react';
import PropTypes from 'prop-types';

import {
  Avatar,
  Card,
  CardActions,
  CardHeader,
  Divider,
  IconButton,
  Tooltip,
  Typography
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import BlockIcon from '@material-ui/icons/Block';

import Utils from '../../Common/Utils';

const Integration = props => {
  const {
    name,
    channel,
    group,
    logo,
    authorized,
    classes,
    onIntegrationAuthorized,
    onIntegrationUnauthorized,
    onIntegrationDeleted,
    noActions
  } = props;

  return (
    <Card
      className={classes.card}
      style={{
        flex: '1 1 auto',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
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
        title={
          <Typography
            component="h5"
            variant="h6"
            color="inherit"
            gutterBottom
          >
            {name}
          </Typography>
        }
        style={{ padding: '48px 16px' }}
        subheader={Utils.fullChannelName(channel)}
      />
      <Divider />
      {noActions ? (
        <div style={{ margin: 16 }}>
          <Typography
            component="h5"
            variant="body2"
            color="inherit"
            gutterBottom
          >
            {group}
          </Typography>
        </div>
      ) : (
        <CardActions style={{ position: 'relative', bottom: 0 }}>
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
      )}
    </Card>
  );
};

Integration.propTypes = {
  name: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  channel: PropTypes.string,
  authorized: PropTypes.bool.isRequired,
  classes: PropTypes.object.isRequired,
  onIntegrationAuthorized: PropTypes.func,
  onIntegrationUnauthorized: PropTypes.func,
  onIntegrationDeleted: PropTypes.func
};

export default Integration;
