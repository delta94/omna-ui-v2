import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import Ionicon from 'react-ionicons';
import IconButton from '@material-ui/core/IconButton';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
//
import get from 'lodash/get';
import moment from 'moment';
import Loading from 'dan-components/Loading';
//
import API from '../../Utils/api';
import AlertDialog from '../../Common/AlertDialog';
import GenericTableToolBar from '../../Common/GenericTableToolBar';
import GenericTablePagination from '../../Common/GenericTablePagination';
import LoadingState from '../../Common/LoadingState';
import GenericTableHead from '../../Common/GenericTableHead';
import GenericErrorMessage from '../../Common/GenericErrorMessage';

const styles = theme => ({
  inputWidth: {
    width: '300px'
  },
  marginTop: {
    marginTop: theme.spacing.unit
  },
  marginLeft: {
    marginLeft: theme.spacing.unit
  },
  padding: {
    padding: theme.spacing.unit
  },
  paper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    padding: '5px'
  },
  actions: {
    padding: theme.spacing.unit * 1
  },
  tableRoot: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  icon: {
    color: '#9e9e9e'
  }
});

const headColumns = [
  {
    id: 'title',
    first: true,
    last: false,
    label: 'Title'
  },
  {
    id: 'integration',
    first: false,
    last: false,
    label: 'Integration'
  },
  {
    id: 'created_at',
    first: false,
    last: false,
    label: 'Created at'
  },
  {
    id: 'updated_at',
    first: false,
    last: false,
    label: 'Updated at'
  },
  {
    id: 'actions',
    first: false,
    last: false,
    label: 'Actions'
  }
];

class Flows extends Component {
  state = {
    loading: true,
    flows: { data: [], pagination: {} },
    messageError: '',
    alertDialog: {
      open: false,
      objectId: '',
      objectName: '',
      message: ''
    },
    limit: 5,
    page: 0
  };

  componentDidMount() {
    this.initializeDataTable();
  }

  fetchFlows = async params => {
    const { enqueueSnackbar } = this.props;
    try {
      const response = await API.get('/flows', { params });
      this.setState({
        flows: get(response, 'data', { data: [], pagination: {} }),
        limit: get(response, 'data.pagination.limit', 0)
      });
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
  };

  initializeDataTable = async () => {
    this.setState({ loading: true });
    await this.fetchFlows();
    this.setState({ loading: false });
  };

  handleDeleteFlow = async () => {
    const { enqueueSnackbar } = this.props;
    const { alertDialog } = this.state;

    try {
      this.setState({ loading: true });
      await API.delete(`flows/${alertDialog.objectId}`);
      enqueueSnackbar('Workflow deleted successfully', {
        variant: 'success'
      });
      await this.fetchFlows();
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }

    this.setState({ loading: false });
  };

  handleOnClickDeleteFlow = (id, title, integration) => {
    this.setState({
      alertDialog: {
        open: true,
        objectId: id,
        message: `Are you sure you want to remove "${title}: ${integration}" workflow?`
      }
    });
  };

  handleDialogConfirm = () => {
    this.handleDeleteFlow();
    this.setState({ alertDialog: { open: false } });
  };

  handleDialogCancel = () => {
    this.setState({ alertDialog: { open: false } });
  };

  handleAddAction = () => {
    const { history } = this.props;
    history.push('/app/settings/workflows/add-workflow');
  };

  handleStartFlow = async id => {
    const { enqueueSnackbar } = this.props;
    try {
      await API.get(`flows/${id}/start`);
      enqueueSnackbar('Workflow started successfully', {
        variant: 'success'
      });
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
  };

  handleEditFlow = id => {
    const { history } = this.props;
    history.push(`/app/settings/workflows/edit-workflow/${id}`);
  };

  handleToggleScheduler = async id => {
    const { enqueueSnackbar } = this.props;
    try {
      this.setState({ loading: true });
      await API.get(`flows/${id}/toggle/scheduler/status`);
      this.fetchFlows();
      enqueueSnackbar('Scheduler toggled successfully', {
        variant: 'success'
      });
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }

    this.setState({ loading: false });
  };

  handleChangePage = (e, page) => {
    this.setState({ page }, this.makeRequest);
  };

  makeRequest = () => {
    const { limit, page } = this.state;
    const params = {
      offset: page * limit,
      limit
    };

    this.fetchFlows(params);
  };

  handleChangeRowsPerPage = event => {
    this.setState(
      { limit: parseInt(event.target.value, 10) },
      this.makeRequest
    );
  };

  render() {
    const { classes } = this.props;
    const {
      flows,
      loading,
      messageError,
      alertDialog,
      limit,
      page
    } = this.state;

    const { pagination, data } = flows;
    const count = get(pagination, 'total', 0);

    return (
      <div>
        <Paper className={classes.tableRoot}>
          <div className="item-padding">
            {loading ? <LoadingState loading={loading} /> : null}
            {loading ? null : count === 0 ? (
              <GenericErrorMessage messageError={messageError} />
            ) : (
              <Fragment>
                <div className={classes.rootTable}>
                  <GenericTableToolBar
                    actionList={['Add']}
                    rowCount={count > limit ? limit : count}
                    onAdd={this.handleAddAction}
                  />
                  <Table>
                    <GenericTableHead
                      rowCount={count > limit ? limit : count}
                      headColumns={headColumns}
                    />
                    <TableBody>
                      {data.map(
                        ({
                          id,
                          title,
                          createdAt,
                          updatedAt,
                          integration,
                          task
                        }) => (
                          <TableRow key={id}>
                            <TableCell component="th" scope="row">
                              {title}
                            </TableCell>
                            <TableCell align="center">
                              {integration.name}
                            </TableCell>
                            <TableCell align="center">
                              {moment(createdAt).format('Y-MM-DD H:mm:ss')}
                            </TableCell>
                            <TableCell align="center">
                              {moment(updatedAt).format('Y-MM-DD H:mm:ss')}
                            </TableCell>
                            <TableCell align="center">
                              <Tooltip title="edit">
                                <IconButton
                                  aria-label="edit"
                                  onClick={() => this.handleEditFlow(id)}
                                >
                                  <Ionicon icon="md-create" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="start">
                                <IconButton
                                  aria-label="start"
                                  onClick={() => this.handleStartFlow(id)}
                                >
                                  <Ionicon icon="md-play" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="delete">
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => this.handleOnClickDeleteFlow(id, title)}
                                >
                                  <Ionicon icon="md-delete" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip
                                title={
                                  task.scheduler && task.scheduler.active
                                    ? 'disable scheduler'
                                    : 'enable scheduler'
                                }
                              >
                                <IconButton
                                  aria-label="start"
                                  onClick={() => this.handleToggleScheduler(id)}
                                >
                                  {task.scheduler && task.scheduler.active ? (
                                    <Ionicon icon="ios-close" />
                                  ) : (
                                    <Ionicon icon="ios-timer" />
                                  )}
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
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
              </Fragment>
            )}
          </div>
        </Paper>

        <AlertDialog
          open={alertDialog.open}
          message={alertDialog.message}
          handleCancel={this.handleDialogCancel()}
          handleConfirm={this.handleDialogConfirm()}
        />
        {loading && <Loading />}
      </div>
    );
  }
}

Flows.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(withStyles(styles)(Flows));
