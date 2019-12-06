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
import API from '../../containers/Utils/api';
import Utils from '../../containers/Common/Utils';
import { GET_TENANT_ID } from '../../actions/actionConstants';
import {
  setTenantStatus,
  setTenantId,
  setReloadTenants,
  setReloadLandingPage,
  setDeactivationDate,
  setEnabledTenant,
  setTenantName
} from '../../actions/TenantActions';

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

function TenantMenu(props) {
  const { classes, reloadTenants } = props;
  const [name, setName] = useState('');
  const [tenantList, setTenantList] = useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedIndex, setSelectedIndex] = React.useState(1);

  useEffect(() => {
    async function changeTenant() {
      const { tenantId, changeReloadTenants, enqueueSnackbar } = props;
      if (reloadTenants) {
        try {
          const params = { limit: 100, offset: 0 };
          const response = await API.get('tenants', { params });
          const { data } = response.data;
          changeReloadTenants(false);
          data.unshift({ id: '0', name: 'Tenants' });
          setTenantList(data);
          const found = data.find(element => element.id === tenantId);
          setName(found.name);
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
      const { enqueueSnackbar, tenantId } = props;
      try {
        // TO DO: adjust total of elements to show in combobox
        const params = { limit: 100, offset: 0 };
        const response = await API.get('tenants', { params });
        const { data } = response.data;
        data.unshift({ id: '0', name: 'Tenants' });
        setTenantList(data);
        const found = data.findIndex(element => element.id === tenantId);
        setSelectedIndex(found);
        // const found = data.find(element => element.id === tenantId);
        const element = data[found];
        setName(element.name);
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
      const tenant = Utils.getTenant();
      tenant.name = data.name;
      tenant.token = data.token;
      tenant.secret = data.secret;
      tenant.isReadyToOmna = data.is_ready_to_omna;
      tenant.tenantId = data.id;
      tenant.enabled = Utils.isTenantEnabled(data.deactivation);
      Utils.setTenant(tenant);
      changeTenantStatus(data.is_ready_to_omna);
      changeTenantId(data.id);
      changeDeactivationDate(data.deactivation);
      changeEnabledTenant(tenant.enabled);
      changeTenantName(data.name);
      if (!data.is_ready_to_omna) {
        history.push('/app/tenant-configuration');
      } else {
        changeReloadLandingPage(true);
        history.push('/app');
      }
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
          <ListItemText
            primary={name}
            className={classes.selectedTenant}
          />
          <ListItemIcon style={{ margin: 0 }}>
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
      >
        {tenantList.map((option, index) => (
          <MenuItem
            key={option.id}
            value={option.id}
            disabled={index === 0}
            selected={index === selectedIndex}
            onClick={event => handleTenantChange(event, option.id, option.name, index)
            }
          >
            {option.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

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
  enqueueSnackbar: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  tenantId: state.getIn(['tenant', 'tenantId']),
  reloadTenants: state.getIn(['tenant', 'reloadTenants']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  getTenantId: () => dispatch({ type: GET_TENANT_ID }),
  changeTenantStatus: bindActionCreators(setTenantStatus, dispatch),
  changeTenantId: bindActionCreators(setTenantId, dispatch),
  changeReloadTenants: bindActionCreators(setReloadTenants, dispatch),
  changeReloadLandingPage: bindActionCreators(setReloadLandingPage, dispatch),
  changeDeactivationDate: bindActionCreators(setDeactivationDate, dispatch),
  changeEnabledTenant: bindActionCreators(setEnabledTenant, dispatch),
  changeTenantName: bindActionCreators(setTenantName, dispatch)
});

const TenantMenuMapped = withSnackbar(withStyles(styles)(TenantMenu));

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TenantMenuMapped);
