import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { Fade } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { Header, Sidebar } from 'dan-components';
import Notifications from 'dan-components/Notification/Notifications';
import dataMenu from 'dan-api/ui/menu';
import shopifyMenu from 'dan-api/ui/shopifyMenu';
import { isOmnaShopify } from 'dan-containers/Common/Utils';
import Decoration from '../Decoration';
import styles from '../appStyles-jss';
import { GET_TENANT } from '../../../actions/actionConstants';

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
      notifications
    } = this.props;
    
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
          dataMenu={isOmnaShopify() ? shopifyMenu : dataMenu}
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
            {/* titleException.indexOf(history.location.pathname) < 0 && (
              <div className={classes.pageTitle}>
                <Typography component="h4" className={bgPosition === 'header' ? classes.darkTitle : classes.lightTitle} variant="h4">{place}</Typography>
                <BreadCrumb separator=" / " theme={bgPosition === 'header' ? 'dark' : 'light'} location={history.location} />
              </div>
            ) */}

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
  notifications: PropTypes.object
};

LeftSidebarLayout.defaultProps = {
  notifications: []
};

const mapStateToProps = state => ({
  notifications: state.getIn(['notification', 'notifications']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  getTenant: () => dispatch({ type: GET_TENANT })
});

const LeftSidebarLayoutMaped = connect(
  mapStateToProps,
  mapDispatchToProps
)(LeftSidebarLayout);

export default withStyles(styles)(LeftSidebarLayoutMaped);
