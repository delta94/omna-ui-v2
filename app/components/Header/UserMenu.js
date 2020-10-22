import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { Button, Divider, Hidden } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExitToApp from '@material-ui/icons/ExitToApp';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { Link } from 'react-router-dom';
import { logout, logoutShopify } from 'dan-containers/Common/Utils';
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
    const { fromShopifyApp } = this.props;
    this.setState({ anchorEl: null, openMenu: null });
    fromShopifyApp ? logoutShopify() : logout();
  };

  render() {
    const { anchorEl, openMenu } = this.state;
    const { user, fromShopifyApp, classes } = this.props;

    return (
      <div>
        <Button onClick={this.handleMenu('user-setting')}>
          <Avatar
            alt={user.get('name') || 'user-avatar'}
            src={user.get('picture') || dummy.user.avatar}
            className={fromShopifyApp ? classes.avatar : ''}
          />
          <Hidden xsDown>
            <div style={{ color: 'white', marginLeft: 8 }}>
              {user.get('name') || ''}
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
          {!fromShopifyApp && (
            <MenuItem
              onClick={this.handleClose}
              component={Link}
              to="/add-tenant"
            >
              Create Tenant
            </MenuItem>
          )}
          {!fromShopifyApp && <Divider />}
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

UserMenu.propTypes = {
  fromShopifyApp: PropTypes.bool.isRequired,
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.getIn(['user', 'user']),
  ...state
});

const UserMenuMapped = withStyles(styles)(UserMenu);

export default connect(
  mapStateToProps,
  null
)(UserMenuMapped);
