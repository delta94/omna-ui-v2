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
  Menu,
  MenuItem,
  Tooltip,
  Typography
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Block';
import { getLogo, getResourceOptions } from 'dan-containers/Common/Utils';

const Integration = props => {
  const [anchorEl, setAnchorEl] = useState();
  const {
    name,
    group,
    logo,
    authorized,
    classes,
    integrated,
    onAuthorizeIntegration,
    onUnauthorizeIntegration,
    onDeleteIntegration,
    onEditIntegration,
    onImportResource,
    onViewResource,
    noActions,
    handleAddIntegration
  } = props;

  const subtitle = group.replace(/\[|\]/g, '');
  const resourceOptions = getResourceOptions();

  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleImportResource = value => {
    onImportResource(value);
    handleClose();
  };

  const handleViewResource = value => {
    onViewResource(value);
    handleClose();
  };

  const handleOptionClick = option => {
    switch (option) {
      case 'authorize':
        onAuthorizeIntegration();
        break;
      case 'unauthorize':
        onUnauthorizeIntegration();
        break;
      case 'delete':
        onDeleteIntegration();
        break;
      case 'edit':
        onEditIntegration();
        break;
      default:
        handleClose();
    }

    handleClose();
  };

  return (
    <div>
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
                  src={getLogo(subtitle.replace(/ /g, '').slice(0, -2))}
                  alt="logo"
                  aria-label="Recipe"
                  className={classes.avatar}
                />
              ) : null
            }
            title={
              <Typography
                component="h5"
                variant="subtitle2"
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

            {!integrated && (
              <Tooltip title="Add integration">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleAddIntegration}
                >
                  Add
                </Button>
              </Tooltip>
            )}
          </div>
        ) : (
          <CardActions
            style={{
              position: 'relative',
              bottom: 0
            }}
          >
            {authorized ? (
              <Tooltip title="Authorized">
                <CheckCircleIcon style={{ color: '#4CAF50' }} />
              </Tooltip>
            ) : (
              <Tooltip title="Unauthorized">
                <CancelIcon />
              </Tooltip>
            )}
            <div
              style={{
                flex: '1 1 100%'
              }}
            />
            <Tooltip title="Options">
              <IconButton aria-label="options" onClick={handleOpenMenu}>
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
          </CardActions>
        )}
      </Card>

      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {authorized ? (
          <MenuItem
            aria-label="unauthorize"
            onClick={() => handleOptionClick('unauthorize')}
          >
            Unauthorize
          </MenuItem>
        ) : (
          <MenuItem
            aria-label="authorize"
            onClick={() => handleOptionClick('authorize')}
          >
            Authorize
          </MenuItem>
        )}

        <Divider />

        {resourceOptions &&
          resourceOptions.map(({ name: _name, value }) => (
            <MenuItem key={value} onClick={() => handleImportResource(value)}>
              {`Import ${_name}`}
            </MenuItem>
          ))}

        <Divider />

        <MenuItem key="brand" onClick={() => handleViewResource('brand')}>
              {`View Brands`}
        </MenuItem>
        <Divider />

        <MenuItem aria-label="edit" onClick={() => handleOptionClick('edit')}>
          Edit
        </MenuItem>
        <MenuItem
          aria-label="delete"
          onClick={() => handleOptionClick('delete')}
        >
          Delete
        </MenuItem>
      </Menu>
    </div>
  );
};

Integration.defaultProps = {
  authorized: false,
  group: '',
  handleAddIntegration: () => {},
  integrated: false,
  logo: false,
  name: '',
  noActions: false,
  onAuthorizeIntegration: () => {},
  onDeleteIntegration: () => {},
  onEditIntegration: () => {},
  onUnauthorizeIntegration: () => {}
};

Integration.propTypes = {
  authorized: PropTypes.bool,
  classes: PropTypes.object.isRequired,
  group: PropTypes.string,
  handleAddIntegration: PropTypes.func,
  integrated: PropTypes.bool,
  logo: PropTypes.bool,
  name: PropTypes.string,
  noActions: PropTypes.bool,
  onAuthorizeIntegration: PropTypes.func,
  onImportResource: PropTypes.func.isRequired,
  onViewResource: PropTypes.func.isRequired,
  onDeleteIntegration: PropTypes.func,
  onEditIntegration: PropTypes.func,
  onUnauthorizeIntegration: PropTypes.func
};

export default Integration;
