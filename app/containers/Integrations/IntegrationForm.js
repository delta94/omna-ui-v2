import React, { Component } from 'react';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  TextField,
  withStyles
} from '@material-ui/core';
import Loading from 'dan-components/Loading';
import FormActions from 'dan-containers/Common/FormActions';
import API from 'dan-containers/Utils/api';
import { handleAuthorization } from 'dan-containers/Common/Utils';
import {
  getChannels,
  getIntegrations,
  updateIntegration
} from 'dan-actions/integrationActions';

const styles = () => ({
  inputWidth: {
    width: '300px'
  },
  margin: {
    margin: '10px'
  }
});

class IntegrationForm extends Component {
  state = {
    integration: '',
    selectedChannel: '',
    authorized: true,
    errors: {},
    loadingState: false
  };

  componentDidMount() {
    const { integrations, onGetChannels, onGetIntegrations } = this.props;
    onGetChannels();
    if (!integrations) onGetIntegrations();
  }

  onInputChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  onCheckBoxChange = e => {
    const { name, checked } = e.target;
    this.setState({ [name]: checked });
  };

  onSubmit = e => {
    e.preventDefault();
    const {
      editableIntegration,
      enqueueSnackbar,
      handleClose,
      integrations,
      onUpdateIntegration
    } = this.props;
    const {
      integration: name,
      selectedChannel: channel,
      authorized
    } = this.state;

    if (!name) {
      this.setState({ errors: { integration: 'Integration is required' } });
    } else if (!channel) {
      this.setState({ errors: { channel: 'Channel is required' } });
    } else if (editableIntegration) {
      onUpdateIntegration({
        id: editableIntegration.id,
        name,
        channel,
        authorized
      });
    } else {
      const { data: jsIntegrations } = integrations.toJS();
      const found = jsIntegrations.find(
        integration => integration.channel === channel
      );
      if (found) {
        enqueueSnackbar('An integration for this channel already exist.', {
          variant: 'error'
        });
      } else {
        API.post('/integrations', { data: { name, channel } })
          .then(response => {
            enqueueSnackbar('Integration created successfully', {
              variant: 'success'
            });
            const { data } = response.data;
            if (authorized && data.id) {
              this.handleAuthorization(data.id);
            }
          })
          .catch(error => {
            if (error && error.response.data.message) {
              enqueueSnackbar(error.response.data.message, {
                variant: 'error'
              });
            }
          });
      }
    }

    handleClose();
  };

  handleAuthorization = id => {
    const path = `integrations/${id}/authorize`;
    handleAuthorization(path);
  };

  handleClose = () => {
    const { handleClose } = this.props;
    this.setState(
      { integration: '', selectedChannel: '', authorized: false },
      handleClose()
    );
  };

  render() {
    const {
      channel,
      channels,
      classes,
      loading,
      open,
      editableIntegration
    } = this.props;
    const {
      integration,
      selectedChannel,
      authorized,
      loadingState,
      errors
    } = this.state;

    if (selectedChannel === '' && open) {
      channel &&
        this.setState({
          selectedChannel: channel,
          integration: `integration_${channel
            .slice(3, -2)
            .concat('_', channel.slice(-2))
            .toLowerCase()}`
        });
    }

    // const hasCustomDefaultProperties =
    //   channel && (channel.includes('Shopee') || channel.includes('Qoo10'));

    if (editableIntegration && integration === '') {
      this.setState({
        authorized: editableIntegration.authorized,
        integration: editableIntegration.name,
        selectedChannel: editableIntegration.channel
      });
    }

    return (
      <div>
        {(loading || loadingState) && <Loading />}
        <Dialog
          aria-labelledby="form-dialog"
          onClose={this.handleClose}
          open={open}
        >
          <DialogTitle id="form-dialog-title">
            {editableIntegration ? 'Edit' : 'Add'} Integration
          </DialogTitle>
          <DialogContent className={classes.formContainer}>
            <form
              onSubmit={this.onSubmit}
              className="display-flex flex-direction-column"
              noValidate
              autoComplete="off"
            >
              <TextField
                required
                id="name"
                label="Integration"
                value={integration}
                name="integration"
                placeholder="myintegration.lazada.sg"
                onChange={this.onInputChange}
                margin="normal"
                variant="outlined"
                className={classes.inputWidth}
                error={!!errors.integration}
                helperText={errors.integration}
              />

              <TextField
                required
                id="selectedChannel"
                select
                label="Channel"
                value={selectedChannel}
                name="selectedChannel"
                onChange={this.onInputChange}
                SelectProps={{
                  MenuProps: {
                    className: classes.inputWidth
                  }
                }}
                margin="normal"
                variant="outlined"
                className={classes.inputWidth}
                error={!!errors.channel}
                helperText={errors.channel}
              >
                {channels.data &&
                  channels.data.map(option => (
                    <MenuItem key={option.name} value={option.name}>
                      {option.title}
                    </MenuItem>
                  ))}
              </TextField>

              <FormControlLabel
                control={
                  <Checkbox
                    name="authorized"
                    checked={authorized}
                    onChange={this.onCheckBoxChange}
                    value="authorized"
                  />
                }
                label="Authorized"
              />

              <FormActions onCancelClick={this.handleClose} />
            </form>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

IntegrationForm.defaultProps = {
  editableIntegration: null
};

IntegrationForm.propTypes = {
  classes: PropTypes.object.isRequired,
  channel: PropTypes.object.isRequired,
  channels: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  editableIntegration: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  integrations: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onGetChannels: PropTypes.func.isRequired,
  onGetIntegrations: PropTypes.func.isRequired,
  onUpdateIntegration: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  loading: state.getIn(['integration', 'loading']),
  integrations: state.getIn(['integration', 'integrations']),
  channels: state.getIn(['integration', 'channels'])
});

const mapDispatchToProps = dispatch => ({
  onGetChannels: query => dispatch(getChannels(query)),
  onGetIntegrations: query => dispatch(getIntegrations(query)),
  onUpdateIntegration: integration => dispatch(updateIntegration(integration))
});

const AddIntegrationFormMapped = withSnackbar(
  withStyles(styles)(IntegrationForm)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddIntegrationFormMapped);
