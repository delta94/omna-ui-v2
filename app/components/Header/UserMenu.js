import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { Button, Divider, Hidden } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExitToApp from '@material-ui/icons/ExitToApp';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { Link } from 'react-router-dom';
import { currentTenant, logout } from 'dan-containers/Common/Utils';
import dummy from 'dan-api/dummy/dummyContents';
import styles from './header-jss';

class UserMenu extends React.Component {
  state = {
    anchorEl: null,
    openMenu: null
  };

  handleMenu = menu => event => {
    const { openMenu } = this.state;
    this.setState({
      openMenu: openMenu === menu ? null : menu,
      anchorEl: event.currentTarget
    });
  };

  handleClose = () => {
    this.setState({ anchorEl: null, openMenu: null });
  };

  handleLogout = () => {
    this.setState({ anchorEl: null, openMenu: null });
    logout();
  };

  handleLogout = () => {
    this.setState({ anchorEl: null, openMenu: null });
    logout();
  };

  render() {
    const { anchorEl, openMenu } = this.state;
    const user = currentTenant ? currentTenant.user : null;

    return (
      <div>
        <Button onClick={this.handleMenu('user-setting')}>
          <Avatar
            alt={user ? user.name : 'user-avatar'}
            src={user ? user.picture : dummy.user.avatar}
          />
          <Hidden xsDown>
            <div style={{ color: 'white', marginLeft: 8 }}>
              {user ? user.name : ''}
            </div>
          </Hidden>
        </Button>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          open={openMenu === 'user-setting'}
          onClose={this.handleClose}
        >
          <MenuItem
            onClick={this.handleClose}
            component={Link}
            to="/add-tenant"
          >
            Create Tenant
          </MenuItem>
          <Divider />
          <MenuItem onClick={this.handleLogout}>
            <ListItemIcon>
              <ExitToApp />
            </ListItemIcon>
            Log out
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default withStyles(styles)(UserMenu);
