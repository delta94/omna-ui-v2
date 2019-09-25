import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import dummy from 'dan-api/dummy/dummyContents';
import styles from './header-jss';
import Utils from '../../containers/Common/Utils';

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
    Utils.logout();
  };

  render() {
    const { anchorEl, openMenu } = this.state;
    const user = Utils.getUser() ? Utils.getUser().user : null;

    return (
      <div>
        <Button onClick={this.handleMenu('user-setting')}>
          <Avatar alt={user} src={dummy.user.avatar} />
          <div style={{ color: 'white', marginLeft: 8 }}>{user}</div>
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
          <MenuItem onClick={this.handleLogout}>
            Log out
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default withStyles(styles)(UserMenu);
