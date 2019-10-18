import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

import { Paper, TextField, Divider } from '@material-ui/core';
import FormActions from '../../Common/FormActions';

const styles = () => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  inputWidth: {
    width: '300px',
  },
  margin: {
    margin: '10px'
  }
});

function WebhookForm(props) {
  const {
    classes, history, address, topic, topicOptions, integration, integrationOptions
  } = props;

  const onAddressChange = (e) => { props.onAddressChange(e.target.value); };
  const onTopicChange = (e) => { props.onTopicChange(e.target.value); };
  const onIntegrationChange = (e) => { props.onIntegrationChange(e.target.value); };

  const onSubmitForm = (e) => {
    e.preventDefault();
    props.onSubmitForm();
  };

  return (
    <Paper className={classes.root}>
      <form className="display-flex flex-direction-column" noValidate autoComplete="off" onSubmit={onSubmitForm}>
        <TextField
          required
          id="address"
          label="URL"
          placeholder="The webhook's url"
          value={address}
          name="address"
          onChange={onAddressChange}
          margin="normal"
          variant="outlined"
          className={classes.inputWidth}
        />
        <TextField
          required
          id="topics"
          select
          label="topics"
          value={topic}
          name="topic"
          onChange={onTopicChange}
          SelectProps={{
            MenuProps: {
              className: classes.inputWidth
            },
          }}
          margin="normal"
          variant="outlined"
          className={classes.inputWidth}
        >
          {topicOptions.map(option => (
            <MenuItem key={option.topic} value={option.topic}>
              {option.topic}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          required
          id="integrations"
          select
          label="Integrations"
          value={integration}
          name="integrations"
          onChange={onIntegrationChange}
          SelectProps={{
            MenuProps: {
              className: classes.inputWidth
            },
          }}
          margin="normal"
          variant="outlined"
          className={classes.inputWidth}
        >
          {integrationOptions.map(option => (
            <MenuItem key={option.id} value={option.id}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
        <Divider variant="fullWidth" />
        <FormActions history={history} acceptBtnDisabled={!topic || !address || !integration} />
      </form>
    </Paper>
  );
}

WebhookForm.propTypes = {
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  topic: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  integration: PropTypes.string.isRequired,
  topicOptions: PropTypes.array.isRequired,
  integrationOptions: PropTypes.array.isRequired,
  onAddressChange: PropTypes.string.isRequired,
  onTopicChange: PropTypes.string.isRequired,
  onIntegrationChange: PropTypes.func.isRequired,
  onSubmitForm: PropTypes.func.isRequired
};

export default withStyles(styles)(WebhookForm);
