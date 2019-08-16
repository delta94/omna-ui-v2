import React, { useState, useEffect } from 'react';
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
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
//
import get from 'lodash/get';
import moment from 'moment';
import Loading from 'dan-components/Loading';
//
import API from '../../Utils/api';
import AlertDialog from '../../Common/AlertDialog';
import GenericTableToolBar from '../../Common/GenericTableToolBar';

const styles = theme => ({
  inputWidth: {
    width: '300px',
  },
  marginTop: {
    marginTop: theme.spacing.unit,
  },
  marginLeft: {
    marginLeft: theme.spacing.unit,
  },
  padding: {
    padding: theme.spacing.unit,
  },
  paper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    padding: '5px',
  },
  actions: {
    padding: theme.spacing.unit * 1
  },
  tableRoot: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  icon: {
    color: '#9e9e9e',
  },
});

function Flows(props) {
  const [loading, setLoading] = useState(true);
  const [flows, setFlows] = useState([]);
  const [alertDialog, setAlertDialog] = useState({
    open: false,
    objectId: '',
    objectName: '',
    message: ''
  });

  const { classes, history } = props;

  async function fetchFlows() {
    const { enqueueSnackbar } = props;
    try {
      const response = await API.get('flows');
      setFlows(response ? response.data.data : []);
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
  }

  async function initializeDataTable() {
    setLoading(true);
    await fetchFlows();
    setLoading(false);
  }

  useEffect(() => {
    initializeDataTable();
  }, []);

  const handleDeleteFlow = async () => {
    const { enqueueSnackbar } = props;
    try {
      setLoading(true);
      await API.delete(`flows/${alertDialog.objectId}`);
      enqueueSnackbar('Workflow deleted successfuly', {
        variant: 'success'
      });
      await fetchFlows();
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
    setLoading(false);
  };

  const handleOnClickDeleteFlow = (id, title, integration) => {
    setAlertDialog({
      open: true,
      objectId: id,
      message: `Are you sure you want to remove "${title}: ${integration}" workflow?`
    });
  };

  const handleDialogConfirm = () => {
    handleDeleteFlow();
    setAlertDialog({ open: false });
  };

  const handleDialogCancel = () => {
    setAlertDialog({ open: false });
  };

  const handleAddAction = () => {
    history.push('/app/settings/workflows/add-workflow');
  };

  const handleStartFlow = async (id) => {
    const { enqueueSnackbar } = props;
    try {
      await API.get(`flows/${id}/start`);
      enqueueSnackbar('Workflow started successfuly', {
        variant: 'success'
      });
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
  };

  const handleEditFlow = (id) => {
    history.push(`/app/settings/workflows/edit-workflow/${id}`);
  };

  const handleToggleScheduler = async (id) => {
    const { enqueueSnackbar } = props;
    try {
      setLoading(true);
      await API.get(`flows/${id}/toggle/scheduler/status`);
      fetchFlows();
      enqueueSnackbar('Scheduler toggled successfuly', {
        variant: 'success'
      });
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
    setLoading(false);
  };

  return (
    <div>
      <Paper className={classes.tableRoot}>
        <GenericTableToolBar
          actionList={['Add']}
          rowCount={flows.length}
          onAdd={handleAddAction}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>title</TableCell>
              <TableCell align="center">integration</TableCell>
              <TableCell align="center">Created at</TableCell>
              <TableCell align="center">Updated at</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flows.map(({
              id, title, createdAt, updatedAt, integration, task
            }) => (
              <TableRow key={id}>
                <TableCell component="th" scope="row">{title}</TableCell>
                <TableCell align="center">{integration.name}</TableCell>
                <TableCell align="center">{moment(createdAt).format('Y-MM-DD H:mm:ss')}</TableCell>
                <TableCell align="center">{moment(updatedAt).format('Y-MM-DD H:mm:ss')}</TableCell>
                <TableCell align="center">
                  <Tooltip title="edit">
                    <IconButton aria-label="edit" onClick={() => handleEditFlow(id)}>
                      <Ionicon icon="md-create" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="start">
                    <IconButton aria-label="start" onClick={() => handleStartFlow(id)}>
                      <Ionicon icon="md-play" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="delete">
                    <IconButton aria-label="delete" onClick={() => handleOnClickDeleteFlow(id, title, integration.name)}>
                      <Ionicon icon="md-trash" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={task.scheduler && task.scheduler.active ? 'disable scheduler' : 'enable scheduler'}>
                    <IconButton aria-label="start" onClick={() => handleToggleScheduler(id)}>
                      {task.scheduler && task.scheduler.active ? <Ionicon icon="ios-close" />
                        : <Ionicon icon="ios-timer" />
                      }
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
            }
          </TableBody>
        </Table>
      </Paper>

      <AlertDialog
        open={alertDialog.open}
        message={alertDialog.message}
        handleCancel={handleDialogCancel}
        handleConfirm={handleDialogConfirm}
      />
      {loading && <Loading />}
    </div>
  );
}

Flows.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(withStyles(styles)(Flows));
