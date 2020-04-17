import React, { useState } from 'react';
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
import GetAppIcon from '@material-ui/icons/GetApp';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { getResourceOptions } from 'dan-containers/Common/Utils';

const resourceOptions = getResourceOptions();

const Integration = props => {
  const {
    name,
    group,
    logo,
    authorized,
    classes,
    onIntegrationAuthorized,
    onIntegrationUnauthorized,
    onIntegrationDeleted,
    onImportResource,
    noActions,
    handleAddIntegration
  } = props;

  const [anchorEl, setAnchorEl] = useState();

  const handleImportResource = (value) => {
    setAnchorEl(null);
    onImportResource(value);
  };


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
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={(e) => setAnchorEl(e.currentTarget)}>
              <GetAppIcon />
            </IconButton>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              {resourceOptions && resourceOptions.map(({ name: _name, value }) =>
                <MenuItem key={value} onClick={() => handleImportResource(value)}>
                   {_name}
                </MenuItem>
              )}
            </Menu>
          </CardActions>
        )}
    </Card>
  );
};

Integration.defaultProps = {
  name: '',
  logo: '',
  group: '',
  noActions: false,
  authorized: false,
  onIntegrationAuthorized: () => { },
  onIntegrationUnauthorized: () => { },
  onIntegrationDeleted: () => { },
  handleAddIntegration: () => { }
};

Integration.propTypes = {
  name: PropTypes.string,
  logo: PropTypes.string,
  group: PropTypes.string,
  authorized: PropTypes.bool,
  noActions: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  onIntegrationAuthorized: PropTypes.func,
  onIntegrationUnauthorized: PropTypes.func,
  onImportResource: PropTypes.func.isRequired,
  onIntegrationDeleted: PropTypes.func,
  handleAddIntegration: PropTypes.func
};

export default Integration;
