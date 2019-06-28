import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// material-ui
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
//
import API from '../../Utils/api';
import AlertDialog from '../../Common/AlertDialog';

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
  }
});

function Flows(props) {
  const [flows, setFlows] = useState([]);
  const [alertDialog, setAlertDialog] = useState({
    open: false,
    objectId: '',
    objectName: '',
    message: ''
  });

  const { classes } = props;

  async function fetchFlows() {
    const { enqueueSnackbar } = props;
    try {
      const response = await API.get('flows');
      setFlows(response.data.data);
    } catch (error) {
      enqueueSnackbar(error.response.data ? error.response.data.message : 'Unknown error', {
        variant: 'error'
      });
    }
  }

  useEffect(() => {
    fetchFlows();
  }, []);

  const handleDeleteFlow = async () => {
    const { enqueueSnackbar } = props;

    try {
      await API.delete(`flows/${alertDialog.objectId}`);
      enqueueSnackbar('Workflow deleted successfuly', {
        variant: 'success'
      });
      await fetchFlows();
    } catch (error) {
      enqueueSnackbar(error.response.data ? error.response.data.message : 'Unknown error', {
        variant: 'error'
      });
    }
  };

  const handleOnClickDeleteFlow = (id, title) => {
    setAlertDialog({
      open: true,
      objectId: id,
      message: `Are you sure you want to remove "${title}"  workflow?`
    });
  };

  const handleDialogConfirm = () => {
    handleDeleteFlow();
    setAlertDialog({ open: false });
  };

  const handleDialogCancel = () => {
    setAlertDialog({ open: false });
  };

  return (
    <div>
      <Paper className={classes.tableRoot}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>WorkFlow</TableCell>
              <TableCell align="center">Store</TableCell>
              <TableCell align="center">Channel</TableCell>
              <TableCell align="center">Created at</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flows.map(({
              id, title, store, created_at: createdAt
            }) => (
              <TableRow key={id}>
                <TableCell component="th" scope="row">
                  {title}
                </TableCell>
                <TableCell align="center">{store.name}</TableCell>
                <TableCell align="center">{store.channel}</TableCell>
                <TableCell align="center">{createdAt}</TableCell>
                <TableCell align="center">
                  <Tooltip title="delete">
                    <IconButton aria-label="delete" onClick={() => handleOnClickDeleteFlow(id, title)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <AlertDialog
        open={alertDialog.open}
        message={alertDialog.message}
        handleCancel={handleDialogCancel}
        handleConfirm={handleDialogConfirm}
      />
    </div>
  );
}

Flows.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(withStyles(styles)(Flows));
