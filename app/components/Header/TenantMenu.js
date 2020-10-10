import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withSnackbar } from 'notistack';
import Loading from 'dan-components/Loading';
import get from 'lodash/get';
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField
} from '@material-ui/core';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import API from 'dan-containers/Utils/api';
import {
  getLocalStorage,
  isTenantEnabled,
  getDeactivationDate,
  setLocalStorage
} from 'dan-containers/Common/Utils';
import {
  setTenantStatus,
  setTenantId,
  setReloadTenants,
  setReloadLandingPage,
  setDeactivationDate,
  setEnabledTenant,
  setTenantName,
  setUser
} from 'dan-actions/UserActions';
import {
  pushNotification,
  setNotificationList
} from 'dan-actions/NotificationActions';
import { installAvailableIntegration } from 'dan-actions/AvailableIntegrationsActions';
import {
  TENANT_NOT_READY_INFO,
  DISABLED_TENANT_INFO,
  SUBSCRIBE_INFO
} from '../Notification/AlertConstants';
import {
  installOv2AvailableIntegrationAction,
  subscribeAction
} from '../Notification/AlertActions';

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
  const { tenantId, classes, reloadTenants, onSetNotifications, enqueueSnackbar } = props;
  const [name, setName] = useState('');
  const [tenantList, setTenantList] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  // const [selectedIndex, setSelectedIndex] = React.useState(1);

  const loadNotications = (tenantName, isReadyToOmna, deactivationDate) => {
    const { onPushNotification, onInstall } = props;
    const isEnabled = isTenantEnabled(deactivationDate);
    const subscribeNotif = {
      message: SUBSCRIBE_INFO`${tenantName}`,
      variant: 'error',
      action: subscribeAction
    };
    !isEnabled ? onPushNotification(subscribeNotif) : null;
    const deactivation = getDeactivationDate(deactivationDate);
    const deactivationNotif = {
      message: DISABLED_TENANT_INFO`${tenantName}${deactivation}`,
      variant: 'info',
      action: subscribeAction
    };
    deactivation >= 1 ? onPushNotification(deactivationNotif) : null;
    const tenantNotReadyNotif = {
      message: TENANT_NOT_READY_INFO,
      variant: 'warning',
      action: installOv2AvailableIntegrationAction(() => onInstall('omna_v2', enqueueSnackbar))
    };
    !isReadyToOmna ? onPushNotification(tenantNotReadyNotif) : null;
  };

  useEffect(() => {
    async function changeTenant() {
      const { changeReloadTenants } = props;
      if (reloadTenants) {
        try {
          const params = { limit: 100, offset: 0 };
          const response = await API.get('tenants', { params });
          const { data } = response.data;
          changeReloadTenants(false);
          setTenantList(data);
          const tenant = data.find(element => element.id === tenantId);
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
      if (tenantId) {
        try {
          // TO DO: adjust total of elements to show in combobox
          const params = { limit: 100, offset: 0 };
          const response = await API.get('tenants', { params });
          const { data } = response.data;
          setTenantList(data);
          const found = data.findIndex(element => element.id === tenantId);
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
    }
    getTenants();
  }, [tenantId]);

  const handleTenantChange = async (e, _id, _name) => {
    const {
      changeTenantStatus,
      changeReloadLandingPage,
      changeTenantId,
      changeDeactivationDate,
      changeEnabledTenant,
      changeTenantName,
      history
    } = props;
    try {
      setLoading(true);
      setName(_name);
      setAnchorEl(null);
      const response = await API.get(`tenants/${_id}`);
      const { data } = response.data;
      const {
        id,
        name: tenantName,
        token,
        secret,
        is_ready_to_omna: isReadyToOmna,
        deactivation
      } = data;
      const storage = getLocalStorage();
      storage.token = token;
      storage.secret = secret;
      storage.tenantId = id;
      setLocalStorage(storage);
      changeTenantStatus(isReadyToOmna);
      changeTenantId(id);
      changeDeactivationDate(deactivation);
      changeTenantName(tenantName);
      changeEnabledTenant(isTenantEnabled(deactivation));
      onSetNotifications([]);
      loadNotications(tenantName, isReadyToOmna, deactivation);
      changeReloadLandingPage(true);
      history.push('/');
    } catch (error) {
      setLoading(false);
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
    setLoading(false);
  };

  const handleClickListItem = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const filterTenants = event => {
    setFilteredTenants(
      tenantList.map(tenant => {
        return tenant.name
          .toLowerCase()
          .includes(event.target.value.toLowerCase())
          ? tenant
          : '';
      })
    );
  };

  return (
    <div className={classes.root}>
      {loading ? <Loading /> : null}
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
          <ListItemIcon style={{ margin: 0, paddingLeft: 24, width: 20 }}>
            <ArrowDownIcon className={classes.icon} />
          </ListItemIcon>
        </ListItem>
      </List>

      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        disableAutoFocusItem
      >
        <MenuItem>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            onChange={filterTenants}
            placeholder="Tenants"
            onKeyDown={e => e.stopPropagation()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start" style={{ display: 'contents' }}>
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </MenuItem>
        {(filteredTenants.length > 0 ? filteredTenants : tenantList).map(
          (option, index) => (
            <MenuItem
              key={option.id}
              value={option.id}
              // selected={index === selectedIndex}
              onClick={event => handleTenantChange(event, option.id, option.name, index)}
            >
              {option.name}
            </MenuItem>
          )
        )}
      </Menu>
    </div>
  );
};

TenantMenu.defaultProps = {
  tenantId: ''
};

TenantMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  tenantId: PropTypes.string,
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
  tenantId: state.getIn(['user', 'tenantId']),
  reloadTenants: state.getIn(['user', 'reloadTenants']),
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
  onSetNotifications: bindActionCreators(setNotificationList, dispatch),
  onSetUser: bindActionCreators(setUser, dispatch)
});

const TenantMenuMapped = withSnackbar(withStyles(styles)(TenantMenu));

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TenantMenuMapped);
