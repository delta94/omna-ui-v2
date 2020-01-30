import React from 'react';
import PropTypes from 'prop-types';
// material-ui
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
// dandelion-template
import { PapperBlock } from 'dan-components';

import FormActions from '../../Common/FormActions';

const styles = () => ({
  inputWidth: {
    width: '300px',
  },
  paper: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  }
});

function TenantForm(props) {
  const { classes, history, name } = props;

  const handleNameChange = (e) => { props.handleNameChange(e.target.value); };

  const onSubmitForm = (e) => {
    e.preventDefault();
    props.submitForm();
  };

  return (
    <div>
      <form onSubmit={onSubmitForm} noValidate autoComplete="off">
        <PapperBlock title="Tenant" icon="ios-add-circle-outline" desc="After tenant creation you can start adding integrations and creating flows">
          <TextField
            required
            id="name"
            label="name"
            value={name}
            name="integration"
            onChange={handleNameChange}
            margin="normal"
            variant="outlined"
            className={classes.inputWidth}
          />
        </PapperBlock>
        <FormActions
          history={history}
          acceptButtonDisabled={!name}
        />
      </form>

    </div>
  );
}

TenantForm.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  handleNameChange: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired
};

export default withSnackbar(withStyles(styles)(TenantForm));
