import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import get from 'lodash/get';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Paper,
  Table,
  TableRow,
  TableFooter,
  TablePagination,
  Tooltip,
  IconButton
} from '@material-ui/core';
import Ionicon from 'react-ionicons';
import AlertDialog from 'dan-containers/Common/AlertDialog';
import GenericTablePagination from 'dan-containers/Common/GenericTablePagination';
import PageHeader from 'dan-containers/Common/PageHeader';
import { getIntegrations, setLoading } from 'dan-actions/integrationActions';
import { Loading } from 'dan-components';
import AsyncSearch from 'dan-components/AsyncSearch/index2';
import API from 'dan-containers/Utils/api';
import Utils from 'dan-containers/Common/Utils';
import AddIntegrationForm from './AddIntegrationForm';
import Integration from './Integration';

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
  actions: {
    display: 'flex',
    justifyContent: 'flex-end'
  },
  background: {
    backgroundColor: theme.palette.background.paper
  }
});

class IntegrationList extends Component {
  state = {
    openForm: false,
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

  async componentDidMount() {
    this.initializeDataTable();
  }

  handleAddIntegrationClick = () => {
    const { history } = this.props;
    history.push('/integrations/add-integration');
  };

  handleAuthorization = id => {
    const path = `integrations/${id}/authorize`;
    Utils.handleAuthorization(path);
  };

  handleUnAuthorization = id => {
    const { enqueueSnackbar, onSetLoading } = this.props;
    onSetLoading(true);
    API.delete(`/integrations/${id}/authorize`, {
      data: { data: { integration_id: id } }
    })
      .then(() => {
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
        onSetLoading(false);
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
    const { onGetIntegrations } = this.props;
    const { limit, page, searchTerm } = this.state;
    const params = {
      offset: page * limit,
      limit,
      term: searchTerm,
      with_details: true
    };

    onGetIntegrations(params);
  };

  handleChangeRowsPerPage = event => {
    this.setState(
      { limit: parseInt(event.target.value, 10) },
      this.makeRequest
    );
  };

  handleAddIntegrationClick = () => {
    this.setState({ openForm: true });
  };

  handleCloseForm = () => {
    this.setState({ openForm: false });
  };

  handleSearch = e => {
    this.setState({ searchTerm: e.target.value }, this.makeRequest);
  };

  initializeDataTable() {
    this.makeRequest();
  }

  render() {
    const { classes, history, integrations, loading } = this.props;
    const { alertDialog, limit, openForm, page } = this.state;
    const { pagination, data } = integrations;
    const count = get(pagination, 'total', 0);

    return (
      <div>
        <PageHeader title="Installed integrations" history={history} />
        {loading ? <Loading /> : null}
        <div>
          <Paper style={{ margin: '0 4px 8px', padding: 10 }}>
            <div className={classes.actions}>
              <AsyncSearch
                label="Search integration name"
                loading={loading}
                onChange={this.handleSearch}
              />
              <Tooltip title="add">
                <IconButton aria-label="add" onClick={this.handleAddIntegrationClick}>
                  <Ionicon icon="md-add-circle" />
                </IconButton>
              </Tooltip>
              {/* <Button
                variant="outlined"
                color="primary"
                onClick={this.handleAddIntegrationClick}
              >
                Add Integration
              </Button> */}

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
                  channel_title: channelTitle
                }) => (
                  <Grid item md={3} xs={12}>
                    <Integration
                      key={id}
                      name={name}
                      group={channelTitle}
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

IntegrationList.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  integrations: PropTypes.array.isRequired,
  onGetIntegrations: PropTypes.func.isRequired,
  onSetLoading: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  loading: state.getIn(['integration', 'loading']),
  integrations: state.getIn(['integration', 'integrations'])
});

const mapDispatchToProps = dispatch => ({
  onGetIntegrations: query => dispatch(getIntegrations(query)),
  onSetLoading: query => dispatch(setLoading(query))
});

const MyIntegrationsMapped = withSnackbar(withStyles(styles)(IntegrationList));

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyIntegrationsMapped);
