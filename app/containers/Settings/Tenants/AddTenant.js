import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
// material-ui
import { withSnackbar } from 'notistack';
//
import get from 'lodash/get';
import Loading from 'dan-components/Loading';
import TenantForm from './TenantForm';
import API from '../../Utils/api';
import { setReloadTenants } from '../../../actions/TenantActions';
import PageHeader from '../../Common/PageHeader';


function AddTenant(props) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const { history } = props;

  const onHandleNameChange = (value) => {
    setName(value);
  };

  const onSubmitForm = async () => {
    const { enqueueSnackbar, changeReloadTenants } = props;
    try {
      setLoading(true);
      await API.post('tenants', { data: { name } });
      changeReloadTenants(true);
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
      <PageHeader title="Create Tenant" history={history} />
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
  enqueueSnackbar: PropTypes.func.isRequired,
  changeReloadTenants: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  reloadTenants: state.getIn(['tenant', 'reloadTenants']),
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  changeReloadTenants: bindActionCreators(setReloadTenants, dispatch)
});

const AddTenantMaped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AddTenant);


export default withSnackbar(AddTenantMaped);
