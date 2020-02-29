import React from 'react';
import PropTypes from 'prop-types';

import {
  Avatar,
  Button,
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

import Utils from 'dan-containers/Common/Utils';

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
    noActions,
    handleAddIntegration
  } = props;

  let subtitle = group.replace('[', '');
  subtitle = subtitle.replace(']', '');

  return (
    <Card
      className={classes.card}
      style={{
        flex: '1 1 auto',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      {logo ? (
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
          subheader={subtitle}
        />
      ) : (
        <img
          alt="Logo"
          src={`/images/logo/${group.toLowerCase()}${
            group !== 'Shopify' && group !== 'Shopee'
              ? `.${name.slice(-2).toLowerCase()}`
              : ''
          }_logo_full.png`}
          style={{
            flex: '1 1 auto',
            padding: '48px'
          }}
        />
      )}
      <Divider />
      {noActions ? (
        <div
          style={{
            margin: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography
            component="h5"
            variant="body2"
            color="inherit"
            gutterBottom
          >
            {`${group} ${group !== 'Shopify' ? name.slice(-2) : ''}`}
          </Typography>

          <Tooltip title="Add integration">
            <Button
              variant="outlined"
              color="primary"
              onClick={handleAddIntegration}
            >
              Add
            </Button>
          </Tooltip>
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

Integration.defaultProps = {
  name: '',
  logo: '',
  channel: '',
  authorized: false,
  onIntegrationAuthorized: () => {},
  onIntegrationUnauthorized: () => {},
  onIntegrationDeleted: () => {}
};

Integration.propTypes = {
  name: PropTypes.string,
  logo: PropTypes.string,
  channel: PropTypes.string,
  authorized: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  onIntegrationAuthorized: PropTypes.func,
  onIntegrationUnauthorized: PropTypes.func,
  onIntegrationDeleted: PropTypes.func
};

export default Integration;
