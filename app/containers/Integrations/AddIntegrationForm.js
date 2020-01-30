import React, { Component } from 'react';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';

// material-ui
import {
  Dialog,
  DialogContent,
  DialogTitle,
  withStyles
} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';
//
import Loading from 'dan-components/Loading';
//
import FormActions from 'dan-containers/Common/FormActions';
import API from 'dan-containers/Utils/api';
import Utils from 'dan-containers/Common/Utils';
import PageHeader from 'dan-containers/Common/PageHeader';

const styles = () => ({
  inputWidth: {
    width: '300px'
  },
  margin: {
    margin: '10px'
  }
});

class AddIntegrationForm extends Component {
  state = {
    integration: '',
    selectedChannel: '',
    authorized: true,
    errors: {},
    loadingState: false,
    channels: []
  };

  componentDidMount() {
    this.getChannels();
  }

  getChannels() {
    API.get('integrations/channels')
      .then(response => {
        this.setState({ channels: response.data, loadingState: false });
      })
      .catch(error => {
        // handle error
        console.log(error);
      })
      .then(() => {
        this.setState({ loadingState: false });
      });
  }

  onInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onCheckBoxChange = e => {
    this.setState({ [e.target.name]: e.target.checked });
  };

  onSubmit = e => {
    const { enqueueSnackbar, history } = this.props;
    e.preventDefault();
    const { integration: name, selectedChannel, authorized } = this.state;

    // validate form
    if (!name) {
      this.setState({ errors: { integration: 'Integration is required' } });
    } else if (!selectedChannel) {
      this.setState({ errors: { selectedChannel: 'Channel is required' } });
    } else {
      this.setState({ loadingState: true });
      API.post('/integrations', { data: { name, channel: selectedChannel } })
        .then(response => {
          enqueueSnackbar('Integration created successfully', {
            variant: 'success'
          });
          const { data } = response.data;
          //history.goBack();
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
        })
        .then(() => {
          this.props.handleClose();
          this.setState({ loadingState: false });
        });
    }
  };

  handleAuthorization = id => {
    const path = `integrations/${id}/authorize`;
    Utils.handleAuthorization(path);
  };

  handleClose = () => {
    this.setState({ selectedChannel: '' });
    this.props.handleClose();
  };

  render() {
    const { channel, classes, handleClose, open } = this.props;
    const {
      integration,
      selectedChannel,
      channels,
      authorized,
      errors,
      loadingState
    } = this.state;

    if (selectedChannel === '' && open) {
      this.setState({ selectedChannel: channel });
    }

    return (
      <div>
        {loadingState && <Loading />}
        <Dialog aria-labelledby="form-dialog" onClose={handleClose} open={open}>
          <DialogTitle id="form-dialog-title">Add Integration</DialogTitle>
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
                error={!errors.integration}
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

AddIntegrationForm.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(withStyles(styles)(AddIntegrationForm));
