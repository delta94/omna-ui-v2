import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/styles';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import logo from 'dan-images/omna.svg';
import logoSmall from 'dan-images/omna_min.svg';
import MainMenu from './MainMenu';
import styles from './sidebar-jss';

class SidebarContent extends React.Component {
  state = {
    transform: 0
  };

  componentDidMount = () => {
    // Scroll content to top
    const mainContent = document.getElementById('sidebar');
    mainContent.addEventListener('scroll', this.handleScroll);
  };

  componentWillUnmount() {
    const mainContent = document.getElementById('sidebar');
    mainContent.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = event => {
    const scroll = event.target.scrollTop;
    this.setState({
      transform: scroll
    });
  };

  render() {
    const {
      classes,
      // turnDarker,
      drawerPaper,
      toggleDrawerOpen,
      loadTransition,
      leftSidebar,
      dataMenu
      // status,
      // anchorEl,
      // openMenuStatus,
      // closeMenuStatus,
      // changeStatus
    } = this.props;
    const { transform } = this.state;

    return (
      <div
        className={classNames(
          classes.drawerInner,
          !drawerPaper ? classes.drawerPaperClose : ''
        )}
      >
        <div className={classes.drawerHeader}>
          <div
            className={classNames(classes.profile, classes.user)}
            style={{
              opacity: 1 - transform / 100,
              marginTop: transform * -0.3
            }}
          >
            <NavLink to="/app">
              <img
                src={drawerPaper ? logo : logoSmall}
                alt="OMNA LTS"
                className={drawerPaper ? classes.logo : classes.logoSmall}
              />
            </NavLink>
          </div>
        </div>
        <div
          id="sidebar"
          className={classNames(
            classes.menuContainer,
            leftSidebar && classes.rounded,
            classes.withProfile
          )}
        >
          <MainMenu
            loadTransition={loadTransition}
            dataMenu={dataMenu}
            toggleDrawerOpen={toggleDrawerOpen}
          />
        </div>
      </div>
    );
  }
}

SidebarContent.propTypes = {
  classes: PropTypes.object.isRequired,
  drawerPaper: PropTypes.bool.isRequired,
  // turnDarker: PropTypes.bool,
  toggleDrawerOpen: PropTypes.func,
  loadTransition: PropTypes.func,
  leftSidebar: PropTypes.bool.isRequired,
  dataMenu: PropTypes.array.isRequired
  // status: PropTypes.string.isRequired,
  // anchorEl: PropTypes.object,
  // openMenuStatus: PropTypes.func.isRequired,
  // closeMenuStatus: PropTypes.func.isRequired,
  // changeStatus: PropTypes.func.isRequired
};

SidebarContent.defaultProps = {
  // turnDarker: false,
  toggleDrawerOpen: () => {},
  loadTransition: () => {},
  anchorEl: null,
  isLogin: true
};

export default withStyles(styles)(SidebarContent);
