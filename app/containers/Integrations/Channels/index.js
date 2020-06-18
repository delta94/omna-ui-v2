import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import get from 'lodash/get';
// material-ui
import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Table,
  TableRow,
  TableFooter,
  TablePagination
} from '@material-ui/core';
import { Loading } from 'dan-components';
import AlertDialog from 'dan-containers/Common/AlertDialog';
import GenericTablePagination from 'dan-containers/Common/GenericTablePagination';
import PageHeader from 'dan-containers/Common/PageHeader';
import { getChannels, getIntegrations } from 'dan-actions/integrationActions';
import { isOmnaShopify } from 'dan-containers/Common/Utils';
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
    limit: 5,
    page: 0,
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

  handleChangePage = (e, page) => {
    this.setState({ page });
    this.makeRequest();
  };

  makeRequest = () => {
    const { onGetChannels, onGetIntegrations, integrations } = this.props;
    const { limit, page, searchTerm } = this.state;
    const params = {
      offset: page * limit,
      limit,
      term: searchTerm
    };

    onGetChannels(params);

    onGetIntegrations({ offset: 0, limit });
    const integrationsParams = {
      offset: 0,
      limit: integrations.total
    };

    onGetIntegrations(integrationsParams);
  };

  handleChangeRowsPerPage = event => {
    this.setState(
      { limit: parseInt(event.target.value, 10) },
      this.makeRequest
    );
  };

  handleCloseForm = () => {
    this.setState({ openForm: false });
  };

  handleAddIntegrationClick = (event, channel) => {
    this.setState({ channel });
    this.setState({ openForm: true });
  };

  renderIntegrationItem = (channel, classes, integrated) => (
    <Grid item md={3} xs={12}>
      <Integration
        classes={classes}
        key={`${channel.id}-${channel.name}`}
        name={channel.name}
        group={channel.group}
        integrated={integrated}
        noActions
        handleAddIntegration={event =>
          this.handleAddIntegrationClick(event, channel)
        }
      />
    </Grid>
  );

  render() {
    const { channels, classes, history, integrations, loading } = this.props;
    const { alertDialog, channel, limit, openForm, page } = this.state;

    const { pagination, data } = channels;
    const count = get(pagination, 'total', 0);

    return (
      <div>
        <PageHeader title="Channels" history={history} />
        {loading ? <Loading /> : null}
        <div>
          <Grid container spacing={2}>
            {data &&
              data.map(chan => {
                const match = integrations
                  .get('data')
                  .find(
                    integration => integration.get('channel') === chan.name
                  );

                return match
                  ? null
                  : isOmnaShopify
                  ? !chan.name.includes('Shopify') &&
                    this.renderIntegrationItem(chan, classes, Boolean(match))
                  : this.renderIntegrationItem(chan, classes, Boolean(match));
              })}
          </Grid>
          <Table>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  count={count}
                  rowsPerPage={limit}
                  page={page}
                  SelectProps={{
                    native: true
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  ActionsComponent={GenericTablePagination}
                />
              </TableRow>
            </TableFooter>
          </Table>
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
