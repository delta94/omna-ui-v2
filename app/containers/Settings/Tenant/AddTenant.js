import React, { useState } from 'react';
import PropTypes from 'prop-types';
// material-ui
import { withSnackbar } from 'notistack';
import get from 'lodash/get';
import TenantForm from './TenantForm';
import API from '../../Utils/api';


function AddTenant(props) {
  const [name, setName] = useState('');

  const { history } = props;

  const onHandleNameChange = (value) => {
    setName(value);
  };

  const onSubmitForm = async () => {
    const { enqueueSnackbar } = props;
    try {
      await API.post('tenants', { data: { name } });
      enqueueSnackbar('Tenant created successfuly', {
        variant: 'success'
      });
      history.push('/app');
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
  };

  return (
    <TenantForm
      name={name}
      handleNameChange={onHandleNameChange}
      submitForm={onSubmitForm}
      history={history}
    />
  );
}

AddTenant.propTypes = {
  history: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(AddTenant);
