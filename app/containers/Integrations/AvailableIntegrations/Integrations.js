import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withSnackbar } from 'notistack';
import get from 'lodash/get';
// material-ui
import { withStyles } from '@material-ui/core/styles';
import {
  Button,
  Divider,
  Grid,
  Paper,
  Table,
  TableRow,
  TableFooter,
  TablePagination
} from '@material-ui/core';

import LoadingState from 'dan-containers/Common/LoadingState';
import AlertDialog from 'dan-containers/Common/AlertDialog';
import Utils from 'dan-containers/Common/Utils';
import GenericTablePagination from 'dan-containers/Common/GenericTablePagination';
import GenericErrorMessage from 'dan-containers/Common/GenericErrorMessage';
import API from 'dan-containers/Utils/api';
import PageHeader from 'dan-containers/Common/PageHeader';
import Integration from '../Integration';
import AddIntegrationForm from '../AddIntegrationForm';

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

class Integrations extends Component {
  state = {
    loading: true,
    integrations: { data: [], pagination: {} },
    openForm: false,
    channel: {},
    alertDialog: {
      open: false,
      integrationId: '',
      integrationName: '',
      message: ''
    },
    success: true,
    messageError: '',
    limit: 5,
    page: 0
  };

  async componentDidMount() {
    this.initializeDataTable();
  }

  getIntegrations = async params => {
    const { enqueueSnackbar } = this.props;
    let reqParams = params;
    if (typeof reqParams !== 'undefined') {
      reqParams.with_details = true;
    } else {
      reqParams = { with_details: true };
    }
    try {
      const response = await API.get('/integrations/channels', {
        params: reqParams
      });
      this.setState({
        integrations: get(response, 'data', { data: [], pagination: {} }),
        limit: get(response, 'data.pagination.limit', 0)
      });
    } catch (error) {
      this.setState({ success: false, messageError: error.message });
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
  };

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
    const { limit, page } = this.state;
    const params = {
      offset: page * limit,
      limit
    };

    this.getIntegrations(params);
  };

  handleChangeRowsPerPage = event => {
    this.setState(
      { limit: parseInt(event.target.value, 10) },
      this.makeRequest
    );
  };

  async initializeDataTable() {
    this.setState({ loading: true });
    await this.getIntegrations();
    this.setState({ loading: false });
  }

  handleAddIntegrationClick = (event, channel) => {
    this.setState({ channel });
    this.setState({ openForm: true });
  };

  handleCloseForm = () => {
    this.setState({ openForm: false });
  };

  render() {
    const { classes, history } = this.props;
    const {
      integrations,
      loading,
      alertDialog,
      channel,
      success,
      messageError,
      limit,
      openForm,
      page
    } = this.state;

    const { pagination, data } = integrations;
    const count = get(pagination, 'total', 0);

    console.log(data);
    return (
      <div>
        <PageHeader title="Available integrations" history={history} />
        {loading ? (
          <div className="item-padding">
            <LoadingState loading={loading} text="Loading" />
          </div>
        ) : null}
        {loading ? null : !success ? (
          <GenericErrorMessage messageError={messageError} />
        ) : (
          <div>
            <Grid container spacing={2}>
              {data &&
                data.map(channel => (
                  <Grid item md={3} xs={12}>
                    <Integration
                      key={name}
                      name={channel.name}
                      logo={Utils.getLogo(channel.group)}
                      group={channel.group}
                      classes={classes}
                      noActions
                      handleAddIntegration={event =>
                        this.handleAddIntegrationClick(event, channel)
                      }
                    />
                  </Grid>
                ))}
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
        )}

        <AlertDialog
          open={alertDialog.open}
          message={alertDialog.message}
          handleCancel={this.handleDialogCancel}
          handleConfirm={this.handleDialogConfirm}
        />

        <AddIntegrationForm
          channel={channel.name}
          classes={classes}
          handleClose={this.handleCloseForm}
          open={openForm}
        />
      </div>
    );
  }
}

Integrations.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(withStyles(styles)(Integrations));
