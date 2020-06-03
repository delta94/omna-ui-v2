import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import {
  AppBar,
  Fab,
  Hidden,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography
} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import MenuIcon from '@material-ui/icons/Menu';
import ShopInfo from 'dan-containers/Shopify/Components/ShopInfo';
import { currentTenant } from 'dan-containers/Common/Utils';
import UserMenu from './UserMenu';
import TenantMenu from './TenantMenu';
// import SearchUi from '../Search/SearchUi';
import styles from './header-jss';

// const elem = document.documentElement;

class Header extends React.Component {
  state = {
    open: false,
    turnDarker: false,
    showTitle: false,
    anchorEl: null
  };

  // Initial header style
  flagDarker = false;

  flagTitle = false;

  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll);
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const doc = document.documentElement;
    const scroll = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    const newFlagDarker = scroll > 30;
    const newFlagTitle = scroll > 40;
    if (this.flagDarker !== newFlagDarker) {
      this.setState({ turnDarker: newFlagDarker });
      this.flagDarker = newFlagDarker;
    }
    if (this.flagTitle !== newFlagTitle) {
      this.setState({ showTitle: newFlagTitle });
      this.flagTitle = newFlagTitle;
    }
  };

  /*   openFullScreen = () => {
      this.setState({ fullScreen: true });
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { // Firefox
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { // Chrome, Safari & Opera
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { // IE/Edge
        elem.msRequestFullscreen();
      }
    }; */

  /*   closeFullScreen = () => {
      this.setState({ fullScreen: false });
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }; */

  turnMode = mode => {
    const { changeMode } = this.props;
    if (mode === 'light') {
      changeMode('dark');
    } else {
      changeMode('light');
    }
  };

  handleHelpClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleHelpClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const {
      classes,
      toggleDrawerOpen,
      margin,
      position,
      gradient,
      title,
      history
    } = this.props;
    const { open, turnDarker, showTitle, anchorEl } = this.state;

    const setMargin = sidebarPosition => {
      if (sidebarPosition === 'right-sidebar') {
        return classes.right;
      }
      return classes.left;
    };

    return (
      <AppBar
        className={classNames(
          classes.appBar,
          classes.floatingBar,
          margin && classes.appBarShift,
          setMargin(position),
          turnDarker && classes.darker,
          gradient ? classes.gradientBg : classes.solidBg
        )}
      >
        <Toolbar
          disableGutters={!open}
          style={{ justifyContent: 'space-between' }}
        >
          <Fab
            size="small"
            className={classes.menuButton}
            aria-label="Menu"
            onClick={toggleDrawerOpen}
          >
            <MenuIcon />
          </Fab>
          <Hidden smDown>
            <div className={classes.headerProperties}>
              <div
                className={classNames(
                  classes.headerAction,
                  showTitle && classes.fadeOut
                )}
              >
                {/* {fullScreen ? (
                  <Tooltip title="Exit Full Screen" placement="bottom">
                    <IconButton
                      className={classes.button}
                      onClick={this.closeFullScreen}
                    >
                      <FullScreenExitIcon />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Full Screen" placement="bottom">
                    <IconButton
                      className={classes.button}
                      onClick={this.openFullScreen}
                    >
                      <FullScreenIcon />
                    </IconButton>
                  </Tooltip>
                )} */}
                {/* <Tooltip title="Turn Dark/Light" placement="bottom">
                  <IconButton
                    className={classes.button}
                    onClick={() => this.turnMode(mode)}
                  >
                    <Ionicon icon="ios-bulb-outline" />
                  </IconButton>
                </Tooltip> */}
                <Tooltip title="Help" placement="bottom">
                  <IconButton
                    className={classes.button}
                    onClick={this.handleHelpClick}
                  >
                    <HelpIcon />
                  </IconButton>
                </Tooltip>
                <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={this.handleHelpClose}
                >
                  <MenuItem onClick={this.handleHelpClose}>Documentation</MenuItem>
                  <MenuItem onClick={this.handleHelpClose}>Support</MenuItem>
                </Menu>
              </div>
              <Typography
                component="h2"
                className={classNames(
                  classes.headerTitle,
                  showTitle && classes.show
                )}
              >
                {title}
              </Typography>
            </div>
          </Hidden>

          {/* {disableSearchBox && (
            <div className={classes.searchWrapper}>
              <div className={classNames(classes.wrapper, classes.light)}>
                <div className={classes.search}>
                  <SearchIcon />
                </div>
                <SearchUi history={history} />
              </div>
            </div>
          )} */}

          {currentTenant ? (
            currentTenant.fromShopifyApp ? (
              <ShopInfo
                name={currentTenant.shop}
                title={currentTenant.shopDomain}
              />
            ) : (
              <div
                className={classNames(classes.headerProperties)}
                style={{ flex: 'auto 0' }}
              >
                <TenantMenu history={history} />
                <Hidden xsDown>
                  <span className={classes.separatorV} />
                </Hidden>
                <UserMenu />
              </div>
            )
          ) : null}
        </Toolbar>
      </AppBar>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  toggleDrawerOpen: PropTypes.func.isRequired,
  margin: PropTypes.bool.isRequired,
  gradient: PropTypes.bool.isRequired,
  position: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  changeMode: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default withStyles(styles)(Header);
