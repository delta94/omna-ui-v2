import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withSnackbar } from 'notistack';
import get from 'lodash/get';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem
} from '@material-ui/core';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import HomeIcon from '@material-ui/icons/Home';
import API from 'dan-containers/Utils/api';
import Utils, { getTenant } from 'dan-containers/Common/Utils';
// import { GET_TENANT_ID } from '../../actions/actionConstants';
import {
  setTenantStatus,
  setTenantId,
  setReloadTenants,
  setReloadLandingPage,
  setDeactivationDate,
  setEnabledTenant,
  setTenantName
} from '../../actions/TenantActions';
import {
  pushNotification,
  setNotificationList
} from '../../actions/NotificationActions';
import {
  TENANT_NOT_READY_INFO,
  DISABLED_TENANT_INFO,
  SUBSCRIBE_INFO
} from '../Notification/AlertConstants';
import {
  installOv2AvailableIntegrationAction,
  subscribeAction
} from '../Notification/AlertActions';
import { installAvailableIntegration } from '../../actions/AvailableIntegrationsActions';

const styles = () => ({
  root: {
    backgroundColor: 'rgba(255,255,255, .1)',
    borderRadius: 4,
    paddingTop: 0
  },
  icon: {
    color: 'white',
    margin: 0
  },
  selectedTenant: {
    '& > span': {
      color: 'white'
    }
  }
});

const TenantMenu = props => {
  const { classes, reloadTenants, onSetNotifications } = props;
  const [name, setName] = useState('');
  const [tenantList, setTenantList] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  const currentTenant = getTenant();

  const loadNotications = (tenantName, isReadyToOmna, deactivationDate) => {
    const { onPushNotification, onInstall, enqueueSnackbar } = props;
    const isEnabled = Utils.isTenantEnabled(deactivationDate);
    const subscribeNotif = {
      message: SUBSCRIBE_INFO`${tenantName}`,
      variant: 'error',
      action: subscribeAction
    };
    !isEnabled ? onPushNotification(subscribeNotif) : null;
    const deactivation = Utils.getDeactivationDate(deactivationDate);
    const deactivationNotif = {
      message: DISABLED_TENANT_INFO`${tenantName}${deactivation}`,
      variant: 'info',
      action: subscribeAction
    };
    deactivation >= 1 ? onPushNotification(deactivationNotif) : null;
    const tenantNotReadyNotif = {
      message: TENANT_NOT_READY_INFO,
      variant: 'warning',
      action: installOv2AvailableIntegrationAction(() =>
        onInstall('omna_v2', enqueueSnackbar)
      )
    };
    !isReadyToOmna ? onPushNotification(tenantNotReadyNotif) : null;
  };

  useEffect(() => {
    async function changeTenant() {
      const { changeReloadTenants, enqueueSnackbar } = props;
      if (reloadTenants) {
        try {
          const params = { limit: 100, offset: 0 };
          const response = await API.get('tenants', { params });
          const { data } = response.data;
          changeReloadTenants(false);
          data.unshift({ id: '0', name: 'Tenants' });
          setTenantList(data);
          const tenant = data.find(
            element => element.id === currentTenant.tenantId
          );
          setName(tenant.name);
          const {
            name: tenantName,
            is_ready_to_omna: isReadyToOmna,
            deactivation
          } = tenant;
          loadNotications(tenantName, isReadyToOmna, deactivation);
        } catch (error) {
          enqueueSnackbar(
            get(error, 'response.data.message', 'Unknown error'),
            {
              variant: 'error'
            }
          );
        }
      }
    }
    changeTenant();
  }, [reloadTenants]);

  useEffect(() => {
    async function getTenants() {
      const { enqueueSnackbar } = props;
      try {
        // TO DO: adjust total of elements to show in combobox
        const params = { limit: 100, offset: 0 };
        const response = await API.get('tenants', { params });
        const { data } = response.data;
        data.unshift({ id: '0', name: 'Tenants' });
        setTenantList(data);
        const found = data.findIndex(
          element => element.id === currentTenant.tenantId
        );
        setSelectedIndex(found);
        const tenant = data[found];
        const {
          name: tenantName,
          is_ready_to_omna: isReadyToOmna,
          deactivation
        } = tenant;
        setName(tenantName);
        loadNotications(tenantName, isReadyToOmna, deactivation);
      } catch (error) {
        enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
          variant: 'error'
        });
      }
    }
    getTenants();
  }, []);

  const handleTenantChange = async (e, tenantId, _name, index) => {
    const {
      enqueueSnackbar,
      changeTenantStatus,
      changeReloadLandingPage,
      changeTenantId,
      changeDeactivationDate,
      changeEnabledTenant,
      changeTenantName,
      history
    } = props;
    try {
      setName(_name);
      setSelectedIndex(index);
      setAnchorEl(null);
      const response = await API.get(`tenants/${tenantId}`);
      const { data } = response.data;
      const {
        id,
        name: tenantName,
        token,
        secret,
        is_ready_to_omna: isReadyToOmna,
        deactivation
      } = data;
      const tenant = getTenant();
      tenant.name = tenantName;
      tenant.token = token;
      tenant.secret = secret;
      tenant.isReadyToOmna = isReadyToOmna;
      tenant.tenantId = id;
      tenant.enabled = isTenantEnabled(deactivation);
      setTenant(tenant);
      changeTenantStatus(isReadyToOmna);
      changeTenantId(id);
      changeDeactivationDate(deactivation);
      changeTenantName(tenantName);
      changeEnabledTenant(tenant.enabled);
      onSetNotifications([]);
      loadNotications(tenantName, isReadyToOmna, deactivation);
      changeReloadLandingPage(true);
      history.push('/');
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
  };

  const handleClickListItem = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="Tenants" style={{ padding: 0 }}>
        <ListItem
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          aria-label="tenant"
          onClick={handleClickListItem}
        >
          <ListItemIcon style={{ margin: 0 }}>
            <HomeIcon className={classes.icon} />
          </ListItemIcon>
          <ListItemText primary={name} className={classes.selectedTenant} />
          <ListItemIcon style={{ margin: 0 }}>
            <ArrowDownIcon
              className={classes.icon}
              style={{ marginLeft: 36, minWidth: 16 }}
            />
          </ListItemIcon>
        </ListItem>
      </List>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {tenantList.map((option, index) => (
          <MenuItem
            key={option.id}
            value={option.id}
            disabled={index === 0}
            selected={index === selectedIndex}
            onClick={event =>
              handleTenantChange(event, option.id, option.name, index)
            }
          >
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

TenantMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  reloadTenants: PropTypes.bool.isRequired,
  changeTenantStatus: PropTypes.func.isRequired,
  changeReloadLandingPage: PropTypes.func.isRequired,
  changeDeactivationDate: PropTypes.func.isRequired,
  changeEnabledTenant: PropTypes.func.isRequired,
  changeTenantId: PropTypes.func.isRequired,
  changeTenantName: PropTypes.func.isRequired,
  onSetNotifications: PropTypes.func.isRequired,
  onPushNotification: PropTypes.func.isRequired,
  onInstall: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  reloadTenants: state.getIn(['tenant', 'reloadTenants']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  changeTenantStatus: bindActionCreators(setTenantStatus, dispatch),
  changeTenantId: bindActionCreators(setTenantId, dispatch),
  changeReloadTenants: bindActionCreators(setReloadTenants, dispatch),
  changeReloadLandingPage: bindActionCreators(setReloadLandingPage, dispatch),
  changeDeactivationDate: bindActionCreators(setDeactivationDate, dispatch),
  changeEnabledTenant: bindActionCreators(setEnabledTenant, dispatch),
  changeTenantName: bindActionCreators(setTenantName, dispatch),
  onPushNotification: bindActionCreators(pushNotification, dispatch),
  onInstall: bindActionCreators(installAvailableIntegration, dispatch),
  onSetNotifications: bindActionCreators(setNotificationList, dispatch)
});

const TenantMenuMapped = withSnackbar(withStyles(styles)(TenantMenu));

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TenantMenuMapped);
