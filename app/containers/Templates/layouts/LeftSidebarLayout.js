import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Fade } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Header, Sidebar } from 'dan-components';
import Notifications from 'dan-components/Notification/Notifications';
import dataMenu from 'dan-api/ui/menu';
import { ShopifyAdminMenu, ShopifyMenu, dataMenuPlanUnactive } from 'dan-api/ui/shopifyMenu';
import Decoration from '../Decoration';
import styles from '../appStyles-jss';

class LeftSidebarLayout extends React.Component {
  render() {
    const {
      classes,
      children,
      toggleDrawer,
      sidebarOpen,
      loadTransition,
      pageLoaded,
      mode,
      gradient,
      deco,
      history,
      bgPosition,
      changeMode,
      place,
      handleOpenGuide,
      notifications,
      fromShopifyApp,
      fromShopifyAppAdmin,
      planStatus
    } = this.props;

    let data = dataMenu;

    if (fromShopifyApp) {
      if (planStatus !== 'active') {
        data = dataMenuPlanUnactive;
      } else if (fromShopifyAppAdmin) {
        data = ShopifyAdminMenu;
      } else {
        data = ShopifyMenu;
      }
    }

    return (
      <Fragment>
        <Header
          toggleDrawerOpen={toggleDrawer}
          margin={sidebarOpen}
          gradient={gradient}
          position="left-sidebar"
          changeMode={changeMode}
          mode={mode}
          title={place}
          history={history}
          openGuide={handleOpenGuide}
        />

        <Sidebar
          open={sidebarOpen}
          toggleDrawerOpen={toggleDrawer}
          loadTransition={loadTransition}
          dataMenu={data}
          leftSidebar
        />
        <main
          className={classNames(
            classes.content,
            !sidebarOpen ? classes.contentPaddingLeft : ''
          )}
          id="mainContent"
        >
          <Decoration
            mode={mode}
            gradient={gradient}
            decoration={deco}
            bgPosition={bgPosition}
            horizontalMenu={false}
          />
          <section
            className={classNames(classes.mainWrap, classes.sidebarLayout)}
          >
            {/* {titleException.indexOf(history.location.pathname) < 0 && (
              <div className={classes.pageTitle}>
                <Typography component="h4" className={bgPosition === 'header' ? classes.darkTitle : classes.lightTitle} variant="h4">{place}</Typography>
                <BreadCrumb separator=" / " theme={bgPosition === 'header' ? 'dark' : 'light'} location={history.location} />
              </div>
            )
           } */}
            <Notifications list={notifications} />

            {!pageLoaded && (
              <img
                src="/images/spinner.gif"
                alt="spinner"
                className={classes.circularProgress}
              />
            )}
            <Fade
              in={pageLoaded}
              mountOnEnter
              unmountOnExit
              {...(pageLoaded ? { timeout: 700 } : {})}
            >
              <div className={!pageLoaded ? classes.hideApp : ''}>
                {/* Application content will load here */}
                {children}
              </div>
            </Fade>
          </section>
        </main>
      </Fragment>
    );
  }
}

LeftSidebarLayout.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  history: PropTypes.object.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  loadTransition: PropTypes.func.isRequired,
  changeMode: PropTypes.func.isRequired,
  sidebarOpen: PropTypes.bool.isRequired,
  pageLoaded: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  gradient: PropTypes.bool.isRequired,
  deco: PropTypes.bool.isRequired,
  bgPosition: PropTypes.string.isRequired,
  place: PropTypes.string.isRequired,
  titleException: PropTypes.array.isRequired,
  handleOpenGuide: PropTypes.func.isRequired,
  notifications: PropTypes.object,
  fromShopifyApp: PropTypes.bool.isRequired,
  fromShopifyAppAdmin: PropTypes.bool.isRequired,
  planStatus: PropTypes.string.isRequired
};

LeftSidebarLayout.defaultProps = {
  notifications: []
};

const mapStateToProps = state => ({
  notifications: state.getIn(['notification', 'notifications']),
  fromShopifyApp: state.getIn(['user', 'fromShopifyApp']),
  fromShopifyAppAdmin: state.getIn(['user', 'fromShopifyAppAdmin']),
  planStatus: state.getIn(['user', 'planStatus']),
  place: state.getIn(['ui', 'title']),
  ...state
});

const LeftSidebarLayoutMaped = connect(
  mapStateToProps,
  null
)(LeftSidebarLayout);

export default withStyles(styles)(LeftSidebarLayoutMaped);
