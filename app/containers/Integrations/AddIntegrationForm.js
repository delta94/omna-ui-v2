import React, { Component } from 'react';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import {
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  MenuItem,
  TextField,
  withStyles,
  Typography
} from '@material-ui/core';
import Loading from 'dan-components/Loading';
import FormActions from 'dan-containers/Common/FormActions';
import API from 'dan-containers/Utils/api';
import {
  handleAuthorization,
  isOmnaShopify
} from 'dan-containers/Common/Utils';
import { getChannels } from 'dan-actions/integrationActions';
import ShopeeDefaultPropsForm from './ShopeeDefaultPropsForm';
import Qoo10DefaultPropsForm from './Qoo10DefaultPropsForm';

const styles = () => ({
  inputWidth: {
    width: 300,
    margin: '8px 0'
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
    locations: {},
    defaultProperties: { location: '' }
  };

  componentDidMount() {
    const { onGetChannels } = this.props;
    onGetChannels();
    this.getLocations();
  }

  getLocations = async () => {
    try {
      const { shop } = JSON.parse(localStorage.getItem('currentTenant'));
      const locations = await axios.get(
        `https://cenit.io/app/omna-dev/locations?shop=${shop}`
      );
      this.setState({ locations });
    } catch (error) {
      console.log(error);
    }
  };

  onInputChange = e => {
    const { name, value } = e.target;

    if (name.includes('defaultProperties')) {
      const prop = name.substring(name.indexOf('.') + 1);
      const { defaultProperties } = this.state;
      const defaultProps = { ...defaultProperties };
      defaultProps[prop] = value;
      this.setState({ defaultProperties: defaultProps });
    } else {
      this.setState({ [name]: value });
    }
  };

  onCheckBoxChange = e => {
    this.setState({ [e.target.name]: e.target.checked });
  };

  onSubmit = e => {
    e.preventDefault();
    const { enqueueSnackbar, handleClose } = this.props;
    const {
      integration: name,
      selectedChannel,
      authorized,
      defaultProperties
    } = this.state;
    const { shop } = JSON.parse(localStorage.getItem('currentTenant'));

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
          if (authorized && data.id) {
            this.handleIntegrationAuthorization(data.id);
          }

          axios
            .post(
              `https://cenit.io/app/omna-dev/setup/default/properties?shop=${shop}&channel=${selectedChannel}&default_properties=${JSON.stringify(
                defaultProperties
              )}`
            )
            .then(res => {
              enqueueSnackbar(res, {
                variant: 'success'
              });
            })
            .catch(error => {
              console.log(error);
              enqueueSnackbar(error, {
                variant: 'error'
              });
            });
        })
        .catch(error => {
          console.log(error);
          // if (error && error.response.data.message) {
          //   enqueueSnackbar(error.response.data.message, {
          //     variant: 'error'
          //   });
          // }
        })
        .then(() => {
          handleClose();
          this.setState({ loadingState: false });
        });
    }
  };

  handleIntegrationAuthorization = id => {
    const path = `integrations/${id}/authorize`;
    handleAuthorization(path);
  };

  handleClose = () => {
    const { handleClose } = this.props;
    this.setState({ selectedChannel: '' });
    handleClose();
  };

  render() {
    const {
      channel,
      channels,
      classes,
      handleClose,
      loading,
      open
    } = this.props;
    const {
      integration,
      selectedChannel,
      authorized,
      loadingState,
      errors,
      locations,
      defaultProperties
    } = this.state;
    console.log(this.state);

    if (selectedChannel === '' && open) {
      this.setState({ selectedChannel: channel });
    }

    const hasCustomDefaultProperties =
      channel && (channel.includes('Shopee') || channel.includes('Qoo10'));

    return (
      <div>
        {(loading || loadingState) && <Loading />}
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
                margin="dense"
                variant="outlined"
                className={classes.inputWidth}
                error={errors.integration}
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
                margin="dense"
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

              {isOmnaShopify() && (
                <div style={{ marginTop: 8 }}>
                  <Typography component="h5" variant="subtitle2">
                    Default Properties
                  </Typography>
                  <Divider />
                  <TextField
                    id="locations"
                    select
                    label="Locations"
                    value={defaultProperties.location}
                    name="defaultProperties.location"
                    onChange={this.onInputChange}
                    SelectProps={{
                      MenuProps: {
                        className: classes.inputWidth
                      }
                    }}
                    margin="dense"
                    variant="outlined"
                    className={classes.inputWidth}
                    error={!!errors.channel}
                    helperText={errors.channel}
                  >
                    {locations.data &&
                      locations.data.items.map(option => (
                        <MenuItem key={option.name} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))}
                  </TextField>

                  {hasCustomDefaultProperties ? (
                    <div>
                      {channel.includes('Shopee') && (
                        <ShopeeDefaultPropsForm
                          classes={classes}
                          defaultProperties={defaultProperties}
                          handleChange={this.onInputChange}
                        />
                      )}

                      {channel.includes('Qoo10') && (
                        <Qoo10DefaultPropsForm
                          classes={classes}
                          defaultProperties={defaultProperties}
                          handleChange={this.onInputChange}
                        />
                      )}
                    </div>
                  ) : null}
                </div>
              )}

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
  channel: PropTypes.object.isRequired,
  channels: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  onGetChannels: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  loading: state.getIn(['integration', 'loading']),
  channels: state.getIn(['integration', 'channels'])
});

const mapDispatchToProps = dispatch => ({
  onGetChannels: query => dispatch(getChannels(query))
});

const AddIntegrationFormMapped = withSnackbar(
  withStyles(styles)(AddIntegrationForm)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddIntegrationFormMapped);
