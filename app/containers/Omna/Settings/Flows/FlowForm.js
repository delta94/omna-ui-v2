import React, { useState, useEffect, Fragment } from 'react';
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
// dandelion-template
import { PapperBlock } from 'dan-components';
//
import get from 'lodash/get';
//
import API from '../../Utils/api';
import Scheduler from './Scheduler';

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
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  }
});


function FlowForm(props) {
  const [flowType, setFlowType] = useState('');
  const [flowsTypes, setFlowsTypes] = useState([]);
  const [integration, setIntegration] = useState('');
  const [integrationsOptions, setIntegrationsOptions] = useState([]);
  const [active, setActive] = useState(false);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [weeksOfMonth, setWeeksOfMonth] = useState([]);
  const [monthsOfYear, setMonthsOfYear] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  const { classes } = props;

  useEffect(() => {
    async function fetchFlowOptions() {
      const { enqueueSnackbar } = props;
      try {
        const response = await API.get('flows/types');
        setFlowsTypes(response.data.data);
      } catch (error) {
        enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
          variant: 'error'
        });
      }
    }
    fetchFlowOptions();
  }, []);

  useEffect(() => {
    async function fetchIntegrationsOptions() {
      const { enqueueSnackbar } = props;
      try {
        const response = await API.get('integrations');
        setIntegrationsOptions(response.data.data);
      } catch (error) {
        enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
          variant: 'error'
        });
      }
    }
    fetchIntegrationsOptions();
  }, []);


  const onInputFlowChange = (e) => { setFlowType(e.target.value); };

  const onInputStoreChange = (e) => { setIntegration(e.target.value); };

  const onActiveChange = (e) => { setActive(e); };

  const onStartDateChange = (e) => { setStartDate(e); };

  const onEndDateChange = (e) => { setEndDate(e); };

  const onTimeChange = (e) => { setTime(e); };

  const onDaysOfWeekChange = (e) => { setDaysOfWeek(e); };

  const onWeeksOfMonthChange = (e) => { setWeeksOfMonth(e); };

  const onMonthsOfYearChange = (e) => { setMonthsOfYear(e); };


  function clearFields() {
    setFlowType('');
    setIntegration('');
  }

  const handleAddFlow = async () => {
    const { enqueueSnackbar } = props;

    try {
      const scheduler = {
        start_date: startDate,
        end_date: endDate,
        time,
        days_of_week: daysOfWeek,
        weeks_of_month: weeksOfMonth,
        months_of_year: monthsOfYear
      };
      await API.post('flows', { data: { integration_id: integration, type: flowType, scheduler } });
      enqueueSnackbar('Workflow created successfully', {
        variant: 'success'
      });
      clearFields();
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
  };

  return (
    <Fragment>
      <PapperBlock title="Workflow" icon="ios-shuffle" desc="Define a workflow from an available integration">
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
            id="integrations"
            select
            label="Integrations"
            value={integration}
            name="integrations"
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
            {integrationsOptions.map(option => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
      </PapperBlock>

      <PapperBlock title="Scheduler" icon="ios-clock-outline" desc="Select how often you want to run the workflow">
        <Scheduler
          startDate={startDate}
          endDate={endDate}
          time={time}
          active={active}
          daysOfWeek={daysOfWeek}
          weeksOfMonth={weeksOfMonth}
          monthsOfYear={monthsOfYear}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          onTimeChange={onTimeChange}
          onActiveChange={onActiveChange}
          onDaysOfWeekChange={onDaysOfWeekChange}
          onWeeksOfMonthChange={onWeeksOfMonthChange}
          onMonthsOfYearChange={onMonthsOfYearChange}
        />
      </PapperBlock>
      <div className="display-flex flex-direction-row-inverse" style={{ marginBottom: '25px', marginTop: '25px' }}>
        <Button
          variant="contained"
          size="medium"
          color="primary"
          disabled={!(flowType && integration)}
          className={classes.marginLeft}
          onClick={handleAddFlow}
        >
          Add Flow
        </Button>
        <Button
          variant="contained"
          size="medium"
          color="default"
          className={classes.marginLeft}
        >
          Cancel
        </Button>
      </div>
    </Fragment>
  );
}

FlowForm.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(withStyles(styles)(FlowForm));
