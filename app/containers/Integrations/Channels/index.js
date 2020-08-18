import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
// material-ui
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { Loading } from 'dan-components';
import AlertDialog from 'dan-containers/Common/AlertDialog';
import PageHeader from 'dan-containers/Common/PageHeader';
import { getChannels, getIntegrations } from 'dan-actions/integrationActions';
import IntegrationForm from '../IntegrationForm';
import Integration from '../Integration';

const styles = theme => ({
  cardList: {
    display: 'flex',
    flexFlow: 'wrap',
    minWidth: 275
  },
  card: {
    margin: 5
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 2
  },
  background: {
    backgroundColor: theme.palette.background.paper
  }
});

class ChannelList extends Component {
  state = {
    openForm: false,
    channel: {},
    alertDialog: {
      open: false,
      integrationId: '',
      integrationName: '',
      message: ''
    },
    searchTerm: ''
  };

  componentDidMount() {
    this.makeRequest();
  }

  handleDialogCancel = () => {
    this.setState({ alertDialog: false });
  };

  handleDialogConfirm = async () => {
    this.setState({ alertDialog: false });
  };

  makeRequest = () => {
    const { onGetChannels, onGetIntegrations } = this.props;
    const { searchTerm } = this.state;
    const params = {
      term: searchTerm
    };

    const integrationsParams = {
      offset: 0,
      limit: 100
    };
    onGetIntegrations(integrationsParams);

    onGetChannels(params);
  };

  handleCloseForm = () => {
    this.setState({ openForm: false });
  };

  handleAddIntegrationClick = (event, channel) => {
    this.setState({ channel });
    this.setState({ openForm: true });
  };

  renderIntegrationItem = (channel, classes, integrated = false) => (
    <Grid item md={3} xs={12}>
      <Integration
        classes={classes}
        key={`${channel.id}-${channel.name}`}
        name={channel.name}
        group={channel.group}
        integrated={integrated}
        noActions
        handleAddIntegration={event => this.handleAddIntegrationClick(event, channel)}
      />
    </Grid>
  );

  render() {
    const {
      channels, classes, history, integrations, loading
    } = this.props;
    const { alertDialog, channel, openForm } = this.state;

    const { data } = channels;

    return (
      <div>
        <PageHeader title="Channels" history={history} />
        {loading ? <Loading /> : null}
        <div>
          <Grid container spacing={2}>
            {data && data.map(chan => {
              const match = integrations.get('data').find(integration => integration.get('channel') === chan.name);
              return this.renderIntegrationItem(chan, classes, Boolean(match));
            })}
          </Grid>
        </div>
        <AlertDialog
          open={alertDialog.open}
          message={alertDialog.message}
          handleCancel={this.handleDialogCancel}
          handleConfirm={this.handleDialogConfirm}
        />
        <IntegrationForm
          channel={channel.name}
          classes={classes}
          handleClose={this.handleCloseForm}
          open={openForm}
        />
      </div>
    );
  }
}

ChannelList.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  channels: PropTypes.array.isRequired,
  integrations: PropTypes.array.isRequired,
  onGetIntegrations: PropTypes.array.isRequired,
  onGetChannels: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  loading: state.getIn(['integration', 'loading']),
  channels: state.getIn(['integration', 'channels']),
  integrations: state.getIn(['integration', 'integrations'])
});

const mapDispatchToProps = dispatch => ({
  onGetChannels: query => dispatch(getChannels(query)),
  onGetIntegrations: query => dispatch(getIntegrations(query))
});

const ChannelsMapped = withSnackbar(withStyles(styles)(ChannelList));

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelsMapped);
