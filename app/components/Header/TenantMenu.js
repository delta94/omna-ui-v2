import React, { useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import get from 'lodash/get';
import { withSnackbar } from 'notistack';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import classNames from 'classnames';
import API from '../../containers/Utils/api';

const styles = () => ({
  inputWidth: {
    width: '100px',
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
      const { enqueueSnackbar } = props;
      try {
        const response = await API.get('tenants');
        const { data } = response.data;
        setTenantList(data);
      } catch (error) {
        enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
          variant: 'error'
        });
      }
    }
    getTenants();
  }, []);

  const handleTenantChange = (e) => {
    setTenant(e.target.value);
  };

  return (
    <div>
      <TextField
        required
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
  classes: PropTypes.object.isRequired
};

export default withSnackbar(withStyles(styles)(TenantMenu));
