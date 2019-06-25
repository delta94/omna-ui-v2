import React, { useState, useEffect } from 'react';
import API from '../../../utils/api';
import LoadingState from '../../common/LoadingState';
import AlertDialog from '../../common/AlertDialog';

//material-ui
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import classNames from 'classnames';

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
})

const WorkflowsList = (props) => {
  const { classes, flows } = props;

  function handleDeleteFlow(id, title) {
    props.handleDeleteFlow(id, title);
  }

  return (
    <Paper className={classes.tableRoot}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>WorkFlow</TableCell>
            <TableCell align="center">Store</TableCell>
            <TableCell align="center">Channel</TableCell>
            <TableCell align="center">Created_at</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {flows.map(({ id, title, store, created_at }) => (
            <TableRow key={id}>
              <TableCell component="th" scope="row">
                {title}
              </TableCell>
              <TableCell align="center">{store.name}</TableCell>
              <TableCell align="center">{store.channel}</TableCell>
              <TableCell align="center">{created_at}</TableCell>
              <TableCell align="center">
                <Tooltip title="delete">
                  <IconButton aria-label="delete" onClick={handleDeleteFlow.bind(this, id, title)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

function Flows(props) {

  const [flowType, setFlowType] = useState('');
  const [flowsTypes, setFlowsTypes] = useState([]);
  const [store, setStore] = useState('');
  const [storeOptions, setStoreOptions] = useState([]);
  const [flows, setFlows] = useState([]);
  const [loadingFlows, setLoadingFlows] = useState(true);
  const [alertDialog, setAlertDialog] = useState({
    open: false,
    objectId: '',
    objectName: '',
    message: ''
  });

  const { classes } = props;

  useEffect(() => {
    async function fetchFlowOptions() {
      try {
        const response = await API.get('flows/types');
        setFlowsTypes(response.data.data);
      } catch (error) {
      }
    }
    fetchFlowOptions();
  }, []);

  useEffect(() => {
    async function fetchStoreOptions() {
      try {
        const response = await API.get('stores');
        setStoreOptions(response.data.data);
      } catch (error) {
      }
    }
    fetchStoreOptions();
  }, []);

  useEffect(() => {
    async function fetchFlows() {
      try {
        setLoadingFlows(true);
        const response = await API.get('flows');
        setFlows(response.data.data);
      } catch (error) {
      }
      setLoadingFlows(false);
    }
    fetchFlows();
  }, []);


  const onInputFlowChange = (e) => { setFlowType(e.target.value) }

  const onInputStoreChange = (e) => { setStore(e.target.value) }

  function clearFields() {
    setFlowType('');
    setStore('');
  }

  async function fetchFlows() {
    try {
      const response = await API.get('flows');
      setFlows(response.data.data);
    } catch (error) {
    }
  }

  const handleAddFlow = async () => {
    try {
      setLoadingFlows(true);
      await API.post('flows', { data: { 'store_id': store, 'type': flowType } });
      props.enqueueSnackbar('Workflow created successfully', {
        variant: 'success'
      });
      clearFields();
      await fetchFlows();
    } catch (error) {
      props.enqueueSnackbar(error.response.data ? error.response.data.message : 'Unknown error', {
        variant: 'error'
      });
    }
    setLoadingFlows(false);
  }

  const handleDeleteFlow = async () => {
    try {
      setLoadingFlows(true);
      await API.delete(`flows/${alertDialog.objectId}`);
      props.enqueueSnackbar('Workflow deleted successfuly', {
        variant: 'success'
      });
      await fetchFlows();
    } catch (error) {
      props.enqueueSnackbar(error.response.data ? error.response.data.message : 'Unknown error', {
        variant: 'error'
      });
    }
    setLoadingFlows(false);
  }

  const handleOnClickDeleteFlow = (id, title) => {
    setAlertDialog({
      open: true,
      objectId: id,
      message: `Are you sure you want to remove "${title}"  workflow?`
    })
  }

  const handleDialogConfirm = () => {
    handleDeleteFlow();
    setAlertDialog({ open: false });

  }

  const handleDialogCancel = () => {
    setAlertDialog({ open: false })
  }

  return (
    <div>
      <div>
        <Typography variant="h4" gutterBottom>
          Workflows
        </Typography>
      </div>
      <div className="display-flex flex-direction-column">
        <Paper className={classes.paper}>
          <Typography variant="h6">
            I want to:
          </Typography>
          <TextField
            required
            id="flows"
            select
            label="Flows"
            value={flowType}
            name="flows"
            onChange={onInputFlowChange}
            SelectProps={{
              MenuProps: {
                className: classes.inputWidth
              },
            }}
            margin="normal"
            variant="outlined"
            className={classNames(classes.inputWidth, classes.marginLeft)}
          >
            {flowsTypes.map(option => (
              <MenuItem key={option.type} value={option.type}>
                {option.title}
              </MenuItem>
            ))}
          </TextField>
          <KeyboardArrowRight className={classes.marginLeft} />
          <TextField
            required
            id="stores"
            select
            label="Stores"
            value={store}
            name="stores"
            onChange={onInputStoreChange}
            SelectProps={{
              MenuProps: {
                className: classes.inputWidth
              },
            }}
            margin="normal"
            variant="outlined"
            className={classNames(classes.inputWidth, classes.marginLeft)}
          >
            {storeOptions.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <Button variant="contained" size="medium" color="primary" disabled={flowType && store ? false : true} className={classes.marginLeft}
            onClick={handleAddFlow} >
            Add Flow
          </Button>
        </Paper>

        {loadingFlows ? <div className={classes.marginTop}><LoadingState loading={loadingFlows} text="Loading" /></div> :
          <WorkflowsList flows={flows} classes={classes} handleDeleteFlow={handleOnClickDeleteFlow} />
        }

      </div>
      <AlertDialog
        open={alertDialog.open}
        message={alertDialog.message}
        handleCancel={handleDialogCancel}
        handleConfirm={handleDialogConfirm}
      />
    </div>
  );

}

export default withSnackbar(withStyles(styles)(Flows));
