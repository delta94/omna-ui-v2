import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { withSnackbar } from 'notistack';
import { connect } from 'react-redux';
import { Button, Hidden, IconButton, Link } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ExitToApp from '@material-ui/icons/ExitToApp';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { withStyles } from '@material-ui/core/styles';
import { shopifyNotification } from 'dan-containers/Shopify/Services/ShopifyService';

import {
  logoutShopify
} from 'dan-containers/Common/Utils';
import {
  pushNotification
} from '../../actions/NotificationActions';



const styles = theme => ({
  info: {
    margin: '0px 20px',
    cursor: 'pointer'
  },
  icon: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    position: 'relative'
  }
});

class ShopifyMenu extends React.Component {
  state = {
    anchorEl: null
  };

  handleMenu = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleLogout = () => {
    this.handleClose();
    logoutShopify();
  };


  render() {

    const { classes, name, onPushNotification, history } = this.props;
    const { anchorEl } = this.state;
    // const user = currentTenant ? currentTenant.user : null;

    const subscribeAction = (

      <IconButton onClick={() => history.push('/shopify')}>
        <Link
          variant="body2"
          style={{ marginRight: '10px' }}
        >
          plan settings
        </Link>
      </IconButton>
    );

    const notification = shopifyNotification(subscribeAction)
    if (notification){
      onPushNotification(notification);
    }

    return (
      <div>
        <Button onClick={this.handleMenu}>
          <img
            alt={name}
            src="https://cdn.shopify.com/shopifycloud/web/assets/v1/fadd62d4f33b5391d0eaa0de0ca7491a.svg"
            className={classes.icon}
          />
          <Hidden xsDown>
            <div style={{ color: 'white', marginLeft: 8 }}>{name}</div>
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
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
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

ShopifyMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  name: PropTypes.string,
  onPushNotification: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

// export default withStyles(styles)(ShopifyMenu);

const mapDispatchToProps = dispatch => ({
  onPushNotification: bindActionCreators(pushNotification, dispatch)
});

const ShopifyMenuMapped = withSnackbar(withStyles(styles)(ShopifyMenu));

export default connect(
  null,
  mapDispatchToProps
)(ShopifyMenuMapped);

