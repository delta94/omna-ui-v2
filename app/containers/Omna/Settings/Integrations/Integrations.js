import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withSnackbar } from 'notistack';
import get from 'lodash/get';
// material-ui
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import LoadingState from '../../Common/LoadingState';
import AlertDialog from '../../Common/AlertDialog';
import Utils from '../../Common/Utils';
import GenericTablePagination from '../../Common/GenericTablePagination';
import API from '../../Utils/api';
import Integration from './Integration';

const styles = theme => ({
  cardList: {
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: '275px'
  },
  card: {
    minWidth: 275,
    margin: 5
  },
  actions: {
    justifyContent: 'center'
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
    alertDialog: {
      open: false,
      integrationId: '',
      integrationName: '',
      message: ''
    },
    limit: 5,
    page: 0
  };


  async componentDidMount() {
    this.initializeDatatable();
  }

  getIntegrations = async (params) => {
    const { enqueueSnackbar } = this.props;
    let reqParams = params;
    if (typeof reqParams !== 'undefined') {
      reqParams.with_details = true;
    } else {
      reqParams = { with_details: true };
    }
    try {
      // this.setState({ loading: true });
      const response = await API.get('/integrations', { params: reqParams });
      this.setState({
        integrations: get(response, 'data', { data: [], pagination: {} }),
        limit: get(response, 'data.pagination.limit', 0)
      });
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
    // this.setState({ loading: false });
  }

  handleAddIntegrationClick = () => {
    const { history } = this.props;
    history.push('/app/settings/integrations/add-integration');
  };

  handleAuthorization = (id) => {
    const path = `integrations/${id}/authorize`;
    Utils.handleAutorization(path);
  }

  handleUnAuthorization = id => {
    const { enqueueSnackbar } = this.props;
    this.setState({ loading: true });
    API.delete(`/integrations/${id}/authorize`, { data: { data: { integration_id: id } } }).then(response => {
      console.log(response);
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
      const response = await API.delete(`/integrations/${alertDialog.integrationId}`);
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
  }

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

  async initializeDatatable() {
    this.setState({ loading: true });
    await this.getIntegrations();
    this.setState({ loading: false });
  }

  render() {
    const { classes } = this.props;
    const {
      integrations, loading, alertDialog, limit, page
    } = this.state;

    const { pagination, data } = integrations;
    const count = get(pagination, 'total', 0);

    return (
      <div>
        {loading && <Loading />}
        <Paper>
          <div className="display-flex flex-direction-row-inverse">
            <Button
              variant="outlined"
              color="primary"
              style={{ margin: '10px' }}
              onClick={this.handleAddIntegrationClick}
            >
              Add Integration
            </Button>
          </div>
          <Divider variant="middle" />
          <div className={classes.cardList}>
            {data
              && data.map(
                ({
                  id,
                  name,
                  channel,
                  logo = Utils.urlLogo(channel),
                  authorized
                }) => (
                  <Integration
                    key={id}
                    name={name}
                    channel={channel}
                    logo={logo}
                    authorized={authorized}
                    onIntegrationAuthorized={() => this.handleAuthorization(id)}
                    onIntegrationUnauthorized={() => this.handleUnAuthorization(id)
                    }
                    onIntegrationDeleted={() => this.handleDeleteClick(id, name)
                    }
                    classes={classes}
                  />
                )
              )}
          </div>
          <Table>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={5}
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
        </Paper>
        <AlertDialog
          open={alertDialog.open}
          message={alertDialog.message}
          handleCancel={this.handleDialogCancel}
          handleConfirm={this.handleDialogConfirm}
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
