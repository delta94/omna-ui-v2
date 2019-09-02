import React, { Component } from 'react';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';

// material-ui
import { withStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
//
import Loading from 'dan-components/Loading';
//
import FormActions from '../../Common/FormActions';
import API from '../../Utils/api';
import Utils from '../../Common/Utils';


const styles = () => ({
  inputWidth: {
    width: '300px',
  },
  margin: {
    margin: '10px'
  }
});

class AddIntegrationForm extends Component {
  state = {
    integration: '',
    channel: '',
    authorized: true,
    errors: {},
    loadingState: false,
    channels: []
  }

  componentDidMount() {
    this.getChannels();
  }

  getChannels() {
    API.get('integrations/channels').then(response => {
      this.setState({ channels: response.data, loadingState: false });
    }).catch((error) => {
      // handle error
      console.log(error);
    }).then(() => {
      this.setState({ loadingState: false });
    });
  }

  onInputChange = (e) => { this.setState({ [e.target.name]: e.target.value }); }

  onCheckBoxChange = (e) => { this.setState({ [e.target.name]: e.target.checked }); };

  onSubmit = (e) => {
    const { enqueueSnackbar, history } = this.props;
    e.preventDefault();
    const { integration: name, channel, authorized } = this.state;

    // validate form
    if (!name) {
      this.setState({ errors: { integration: 'integration is required' } });
    } else if (!channel) {
      this.setState({ errors: { channel: 'channel is required' } });
    } else {
      this.setState({ loadingState: true });
      API.post('/integrations', { data: { name, channel } }).then(() => {
        enqueueSnackbar('Integration created successfully', {
          variant: 'success'
        });
        history.goBack();
        if (authorized) {
          this.handleAuthorization(name);
        }
      }).catch((error) => {
        if (error && error.response.data.message) {
          enqueueSnackbar(error.response.data.message, {
            variant: 'error'
          });
        }
      }).then(() => {
        this.setState({ loadingState: false });
      });
    }
  }

  handleAuthorization = (id) => {
    const path = `integrations/${id}/authorize`;
    Utils.handleAuthorization(path);
  }

  render() {
    const { classes, history } = this.props;
    const {
      integration, channel, channels, authorized, errors, loadingState
    } = this.state;

    return (
      <div>
        { loadingState && <Loading /> }
        <Paper className="display-flex justify-content-center">
          <form onSubmit={this.onSubmit} className="display-flex flex-direction-column" noValidate autoComplete="off">
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
              id="channel"
              select
              label="Channel"
              value={channel}
              name="channel"
              onChange={this.onInputChange}
              SelectProps={{
                MenuProps: {
                  className: classes.inputWidth
                },
              }}
              margin="normal"
              variant="outlined"
              className={classes.inputWidth}
              error={!!errors.channel}
              helperText={errors.channel}
            >
              {channels.data && channels.data.map(option => (
                <MenuItem key={option.name} value={option.name}>
                  {option.title}
                </MenuItem>
              ))}
            </TextField>

            <FormControlLabel
              control={
                <Checkbox name="authorized" checked={authorized} onChange={this.onCheckBoxChange} value="authorized" color="default" />
              }
              label="Authorized"
            />

            <Divider variant="middle" />
            <FormActions history={history} />
          </form>
        </Paper>
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
