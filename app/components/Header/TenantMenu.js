import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withSnackbar } from 'notistack';
import get from 'lodash/get';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import API from '../../containers/Utils/api';
import Utils from '../../containers/Common/Utils';
import { GET_TENANT_ID } from '../../actions/actionConstants';
import {
  setTenantStatus,
  setTenantId,
  setReloadTenants,
  setReloadLandingPage
} from '../../actions/TenantActions';

// const styles = () => ({
//   root: {
//     '& label.Mui-focused': {
//       color: 'green'
//     },
//     '& .MuiInput-underline:after': {
//       borderBottomColor: 'green'
//     },
//     '& .MuiOutlinedInput-root': {
//       '& fieldset': {
//         borderColor: 'red'
//       },
//       '&:hover fieldset': {
//         borderColor: 'yellow'
//       },
//       '&.Mui-focused fieldset': {
//         borderColor: 'green'
//       }
//     }
//   },
//   inputWidth: {
//     // minWidth: '105px',
//   },
//   margin: {
//     // margin: '10px'
//   },
//   tenantSelect: {
//     '& .MuiOutlinedInput-root': {
//       '& fieldset': {
//         borderColor: 'red'
//       }
//     }
//   }
// });

const styles = () => ({
  root: {
    '& label.Mui-focused': {
      color: 'green'
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: 'green'
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'red'
      },
      '&:hover fieldset': {
        borderColor: 'yellow'
      },
      '&.Mui-focused fieldset': {
        borderColor: 'green'
      }
    }
  },
  tenantSelect: {
    color: 'white'
  },
  notchedOutline: {
    borderColor: '#FFFFFF',
    borderWidth: 1,
    '&:hover': {
      borderColor: '#FFFFFF',
      borderWidth: 2
    }
  }
});

function TenantMenu(props) {
  const { classes, reloadTenants } = props;
  const [tenant, setTenant] = useState('');
  const [tenantlist, setTenantList] = useState([]);

  useEffect(() => {
    const { tenantId, changeReloadTenants, enqueueSnackbar } = props;
    if (reloadTenants) {
      const params = { limit: 100, offset: 0 };
      API.get('tenants', { params })
        .then(response => {
          const { data } = response.data;
          changeReloadTenants(false);
          setTenantList(data);
          setTenant(tenantId);
        })
        .catch(error => {
          enqueueSnackbar(
            get(error, 'response.data.message', 'Unknown error'),
            {
              variant: 'error'
            }
          );
        });
    }
  }, [reloadTenants]);

  useEffect(() => {
    async function getTenants() {
      const { enqueueSnackbar, tenantId } = props;
      try {
        // TO DO: adjust total of elements to show in combobox
        const params = { limit: 100, offset: 0 };
        const response = await API.get('tenants', { params });
        const { data } = response.data;
        setTenantList(data);
        setTenant(tenantId);
      } catch (error) {
        enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
          variant: 'error'
        });
      }
    }
    getTenants();
  }, []);

  const handleTenantChange = async e => {
    const {
      enqueueSnackbar,
      changeTenantStatus,
      changeReloadLandingPage,
      changeTenantId,
      history
    } = props;
    try {
      setTenant(e.target.value);
      const response = await API.get(`tenants/${e.target.value}`);
      const { data } = response.data;
      const user = Utils.getUser();
      user.token = data.token;
      user.secret = data.secret;
      user.isReadyToOmna = data.is_ready_to_omna;
      user.tenantId = data.id;
      Utils.setUser(user);
      changeTenantStatus(data.is_ready_to_omna);
      changeTenantId(data.id);
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

  return (
    <div className={classes.root}>
      <TextField
        id="tenants"
        select
        label="Tenants"
        value={tenant}
        name="tenants"
        onChange={handleTenantChange}
        // SelectProps={{
        //   MenuProps: {
        //     className: classes.inputWidth
        //   }
        // }}
        variant="outlined"
        margin="dense"
        InputLabelProps={{
          classes: {
            root: classes.tenantSelect
          }
        }}
        InputProps={{
          classes: {
            input: classes.tenantSelect,
            notchedOutline: classes.notchedOutline
          }
        }}
      >
        {tenantlist.map(option => (
          <MenuItem key={option.id} value={option.id}>
            {option.name}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
}

TenantMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  reloadTenants: PropTypes.bool.isRequired,
  changeTenantStatus: PropTypes.func.isRequired,
  changeReloadLandingPage: PropTypes.func.isRequired,
  changeTenantId: PropTypes.func.isRequired,
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
  changeReloadLandingPage: bindActionCreators(setReloadLandingPage, dispatch)
});

const TenantMenuMapped = withSnackbar(withStyles(styles)(TenantMenu));

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TenantMenuMapped);
