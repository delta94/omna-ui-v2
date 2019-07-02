import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

// material-ui
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import API from '../../Utils/api';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit
  },
  inputWidth: {
    width: '300px',
  },
  marginTop: {
    marginTop: theme.spacing.unit,
  },
  marginLeft: {
    marginLeft: theme.spacing.unit,
  },
  paper: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  }
});


function FlowForm(props) {
  const [flowType, setFlowType] = useState('');
  const [flowsTypes, setFlowsTypes] = useState([]);
  const [store, setStore] = useState('');
  const [storeOptions, setStoreOptions] = useState([]);
  const [active, setActive] = useState(false);

  const { classes } = props;

  useEffect(() => {
    async function fetchFlowOptions() {
      const { enqueueSnackbar } = props;
      try {
        const response = await API.get('flows/types');
        setFlowsTypes(response.data.data);
      } catch (error) {
        enqueueSnackbar(error.response.data ? error.response.data.message : 'Unknown error', {
          variant: 'error'
        });
      }
    }
    fetchFlowOptions();
  }, []);

  useEffect(() => {
    async function fetchStoreOptions() {
      const { enqueueSnackbar } = props;
      try {
        const response = await API.get('stores');
        setStoreOptions(response.data.data);
      } catch (error) {
        enqueueSnackbar(error.response.data ? error.response.data.message : 'Unknown error', {
          variant: 'error'
        });
      }
    }
    fetchStoreOptions();
  }, []);


  const onInputFlowChange = (e) => { setFlowType(e.target.value); };

  const onInputStoreChange = (e) => { setStore(e.target.value); };

  const onCheckBoxChange = (e) => { setActive(e.target.checked); };

  function clearFields() {
    setFlowType('');
    setStore('');
  }

  const handleAddFlow = async () => {
    const { enqueueSnackbar } = props;

    try {
      await API.post('flows', { data: { store_id: store, type: flowType } });
      enqueueSnackbar('Workflow created successfully', {
        variant: 'success'
      });
      clearFields();
    } catch (error) {
      enqueueSnackbar(error.response.data ? error.response.data.message : 'Unknown error', {
        variant: 'error'
      });
    }
  };

  return (
    <Paper className={classes.root}>
      <div className={classes.paper}>
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
        <Button
          variant="contained"
          size="medium"
          color="primary"
          disabled={!(flowType && store)}
          className={classes.marginLeft}
          onClick={handleAddFlow}
        >
          Add Flow
        </Button>
      </div>
      <div>
        <Typography variant="h6">
          Scheduler
        </Typography>
        <FormControlLabel
          control={
            (
              <Checkbox
                name="active"
                checked={active}
                onChange={onCheckBoxChange}
                value="active"
                color="default"
              />
            )
          }
          label="Active"
        />
      </div>
    </Paper>
  );
}

FlowForm.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(withStyles(styles)(FlowForm));
