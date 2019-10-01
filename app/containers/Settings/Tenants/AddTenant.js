import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
// material-ui
import { withSnackbar } from 'notistack';
//
import get from 'lodash/get';
import Loading from 'dan-components/Loading';
import TenantForm from './TenantForm';
import API from '../../Utils/api';


function AddTenant(props) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const { history } = props;

  const onHandleNameChange = (value) => {
    setName(value);
  };

  const onSubmitForm = async () => {
    const { enqueueSnackbar } = props;
    try {
      setLoading(true);
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
    setLoading(false);
  };

  return (
    <Fragment>
      {loading && <Loading />}
      <TenantForm
        name={name}
        handleNameChange={onHandleNameChange}
        history={history}
        submitForm={onSubmitForm}
      />
    </Fragment>
  );
}

AddTenant.propTypes = {
  history: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(AddTenant);
