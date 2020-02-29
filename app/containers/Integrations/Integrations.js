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
import Integration from './Integration';
import AddIntegrationForm from './AddIntegrationForm';
import PageHeader from 'dan-containers/Common/PageHeader';

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
      const response = await API.get('/integrations', { params: reqParams });
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

  handleAddIntegrationClick = () => {
    const { history } = this.props;
    history.push('/app/integrations/add-integration');
  };

  handleAuthorization = id => {
    const path = `integrations/${id}/authorize`;
    Utils.handleAuthorization(path);
  };

  handleUnAuthorization = id => {
    const { enqueueSnackbar } = this.props;
    this.setState({ loading: true });
    API.delete(`/integrations/${id}/authorize`, {
      data: { data: { integration_id: id } }
    })
      .then(response => {
        enqueueSnackbar('Integration unauthorized successfully', {
          variant: 'success'
        });
      })
      .catch(error => {
        enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
          variant: 'error'
        });
      })
      .then(() => {
        this.getIntegrations();
        this.setState({ loading: false });
      });
  };

  handleDialogCancel = () => {
    this.setState({ alertDialog: false });
  };

  handleDeleteIntegration = async () => {
    const { enqueueSnackbar } = this.props;
    try {
      const { alertDialog } = this.state;
      const response = await API.delete(
        `/integrations/${alertDialog.integrationId}`
      );
      if (response && response.data.success) {
        enqueueSnackbar('Integration deleted successfully', {
          variant: 'success'
        });
      }
      this.getIntegrations();
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
  };

  handleDialogConfirm = async () => {
    this.handleDeleteIntegration();
    this.setState({ alertDialog: false });
  };

  handleDeleteClick = (id, name) => {
    this.setState({
      alertDialog: {
        open: true,
        integrationId: id,
        integrationName: name,
        message: `Are you sure you want to remove "${name}" integration?`
      }
    });
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

  handleAddIntegrationClick = (event, value) => {
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
      success,
      messageError,
      limit,
      openForm,
      page
    } = this.state;

    const { pagination, data } = integrations;
    const count = get(pagination, 'total', 0);

    return (
      <div>
        <PageHeader title="My integrations" history={history} />
        {loading ? (
          <div className="item-padding">
            <LoadingState loading={loading} text="Loading" />
          </div>
        ) : null}
        {loading ? null : !success ? (
          <GenericErrorMessage messageError={messageError} />
        ) : (
          <div>
            <Paper style={{ margin: '0 4px 8px' }}>
              <div className="display-flex justify-content-space-between">
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ margin: '10px' }}
                  onClick={this.handleAddIntegrationClick}
                >
                  Add Integration
                </Button>
              </div>
            </Paper>
            <Grid container>
              {data &&
                data.map(
                  ({
                    id,
                    name,
                    channel,
                    logo = Utils.getLogo(channel),
                    authorized,
                    channel_title
                  }) => (
                    <Grid item md={3} xs={12}>
                      <Integration
                        key={id}
                        name={name}
                        group={channel_title}
                        logo={logo}
                        channel={channel}
                        authorized={authorized}
                        onIntegrationAuthorized={() =>
                          this.handleAuthorization(id)
                        }
                        onIntegrationUnauthorized={() =>
                          this.handleUnAuthorization(id)
                        }
                        onIntegrationDeleted={() =>
                          this.handleDeleteClick(id, name)
                        }
                        classes={classes}
                      />
                    </Grid>
                  )
                )}
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
