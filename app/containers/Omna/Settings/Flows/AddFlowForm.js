import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// material-ui
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core';
//
import get from 'lodash/get';
import moment from 'moment';
//
import API from '../../Utils/api';
import FlowForm from './FlowForm';

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


function AddFlowForm(props) {
  const [flowType, setFlowType] = useState('');
  const [flowsTypes, setFlowsTypes] = useState([]);
  const [integration, setIntegration] = useState('');
  const [integrationsOptions, setIntegrationsOptions] = useState([]);
  const [scheduler, setScheduler] = useState({
    status: false,
    daysOfWeek: [],
    weeksOfMonth: [],
    monthsOfYear: [],
    startDate: new Date(),
    endDate: new Date(),
    time: new Date()
  });

  const { classes, history } = props;

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

  const onInputFlowChange = (e) => { setFlowType(e); };

  const onInputStoreChange = (e) => { setIntegration(e); };

  const onActiveChange = (e) => { setScheduler({ ...scheduler, active: e }); };

  const onStartDateChange = (e) => { setScheduler({ ...scheduler, startDate: e }); };

  const onEndDateChange = (e) => { setScheduler({ ...scheduler, endDate: e }); };

  const onTimeChange = (e) => { setScheduler({ ...scheduler, time: e }); };

  const onDaysOfWeekChange = (e) => { setScheduler({ ...scheduler, daysOfWeek: e }); };

  const onWeeksOfMonthChange = (e) => { setScheduler({ ...scheduler, weeksOfMonth: e }); };

  const onMonthsOfYearChange = (e) => { setScheduler({ ...scheduler, monthsOfYear: e }); };

  function clearFields() {
    setFlowType('');
    setIntegration('');
  }

  const handleAddFlow = async () => {
    const { enqueueSnackbar } = props;

    try {
      const _scheduler = {
        start_date: moment(scheduler.startDate).format('Y-MM-DD'),
        end_date: moment(scheduler.endDate).format('Y-MM-DD'),
        time: moment(scheduler.time).format('h:mm'),
        days_of_week: scheduler.daysOfWeek,
        weeks_of_month: scheduler.weeksOfMonth,
        months_of_year: scheduler.monthsOfYear
      };
      await API.post('flows', { data: { integration_id: integration, type: flowType, scheduler: _scheduler } });
      enqueueSnackbar('Workflow created successfully', {
        variant: 'success'
      });
      clearFields();
      history.goBack();
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
  };

  const onSubmit = () => {
    handleAddFlow();
  };

  return (
    <FlowForm
      flowType={flowType}
      flowsTypes={flowsTypes}
      integration={integration}
      integrationsOptions={integrationsOptions}
      scheduler={scheduler}
      history={history}
      classes={classes}
      onInputFlowChange={onInputFlowChange}
      onInputStoreChange={onInputStoreChange}
      onActiveChange={onActiveChange}
      onStartDateChange={onStartDateChange}
      onEndDateChange={onEndDateChange}
      onTimeChange={onTimeChange}
      onDaysOfWeekChange={onDaysOfWeekChange}
      onWeeksOfMonthChange={onWeeksOfMonthChange}
      onMonthsOfYearChange={onMonthsOfYearChange}
      onSubmit={onSubmit}
    />
  );
}

AddFlowForm.propTypes = {
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(withStyles(styles)(AddFlowForm));
