import React, { Component } from 'react';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';

// material-ui
import { withStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

import classNames from 'classnames';
import LoadingState from '../../Common/LoadingState';
import API from '../../Utils/api';
import { Utils } from '../../Common/Utils';


const styles = () => ({
  inputWidth: {
    width: '300px',
  },
  margin: {
    margin: '10px'
  }
});

class AddStoreForm extends Component {
  state = {
    store: '',
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
    API.get('stores/channels').then(response => {
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
    const { store: name, channel, authorized } = this.state;

    // validate form
    if (!name) {
      this.setState({ errors: { store: 'store is required' } });
    } else if (!channel) {
      this.setState({ errors: { channel: 'channel is required' } });
    } else {
      this.setState({ loadingState: true });
      API.post('/stores', { data: { name, channel } }).then(() => {
        enqueueSnackbar('Store created successfully', {
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
    window.location.replace(`${Utils.baseAPIURL()}/stores/${id}/authorize?redirect_id=${Utils.uri4Back2SPA()}`);
  }

  render() {
    const { classes } = this.props;
    const {
      store, channel, channels, authorized, errors, loadingState
    } = this.state;

    return (
      <div>
        <Paper className="display-flex justify-content-center">
          <form onSubmit={this.onSubmit} className="display-flex flex-direction-column" noValidate autoComplete="off">
            <TextField
              required
              id="name"
              label="Store"
              value={store}
              name="store"
              placeholder="mystore.lazada.sg"
              onChange={this.onInputChange}
              margin="normal"
              variant="outlined"
              className={classes.inputWidth}
              error={!!errors.store}
              helperText={errors.store}
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
            {loadingState ? <LoadingState loading />
              : (
                <Button variant="contained" type="submit" color="primary" className={classNames(classes.inputWidth, classes.margin)}>
                  Add
                </Button>
              )}
          </form>
        </Paper>
      </div>
    );
  }
}

AddStoreForm.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(withStyles(styles)(AddStoreForm));
