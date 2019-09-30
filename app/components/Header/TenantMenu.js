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
import { setTenantStatus, setTenantId } from '../../actions/TenantActions';

const styles = () => ({
  inputWidth: {
    minWidth: '105px',
  },
  margin: {
    margin: '10px'
  }
});

function TenantMenu(props) {
  const { classes } = props;
  const [tenant, setTenant] = useState('');
  const [tenantlist, setTenantList] = useState([]);


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

  const handleTenantChange = async (e) => {
    const {
      enqueueSnackbar, changeTenantStatus, changeTenantId, history
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
        history.push('/app');
      }
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
  };

  return (
    <div>
      <TextField
        id="tenants"
        select
        label="tenants"
        value={tenant}
        name="tenants"
        onChange={handleTenantChange}
        SelectProps={{
          MenuProps: {
            className: classes.inputWidth
          },
        }}
        margin="normal"
        variant="outlined"
        className={classNames(classes.inputWidth, classes.margin)}
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
  changeTenantStatus: PropTypes.func.isRequired,
  changeTenantId: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  tenantId: state.getIn(['tenant', 'tenantId']),
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  getTenantId: () => dispatch({ type: GET_TENANT_ID }),
  changeTenantStatus: bindActionCreators(setTenantStatus, dispatch),
  changeTenantId: bindActionCreators(setTenantId, dispatch)
});

const TenantMenuMaped = connect(
  mapStateToProps,
  mapDispatchToProps
)(TenantMenu);

export default withSnackbar(withStyles(styles)(TenantMenuMaped));