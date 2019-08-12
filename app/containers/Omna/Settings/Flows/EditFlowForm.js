import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// material-ui
import { withSnackbar } from 'notistack';
//
import get from 'lodash/get';
import moment from 'moment';
//
import API from '../../Utils/api';
import FlowForm from './FlowForm';
import withFetchOptions from './WithFetchOptions';

function EditFlowForm(props) {
  const {
    history, match, flowTypes, integrations
  } = props;

  const [flowType, setFlowType] = useState('');
  const [integration, setIntegration] = useState('');
  const [scheduler, setScheduler] = useState({
    active: false,
    daysOfWeek: [],
    weeksOfMonth: [],
    monthsOfYear: [],
    startDate: new Date(),
    endDate: new Date(),
    time: new Date()
  });


  useEffect(() => {
    async function getFlow() {
      const { enqueueSnackbar } = props;
      try {
        const response = await API.get(`flows/${match.params.id}`);
        const { data } = response.data;
        setFlowType(data.type);
        setIntegration(data.integration.id);
        const _scheduler = data.task.scheduler;
        const schedulerToShow = {
          active: _scheduler.active,
          startDate: moment(_scheduler.start_date),
          endDate: moment(_scheduler.end_date),
          time: moment(new Date().setHours(_scheduler.time.split(':')[0], _scheduler.time.split(':')[1])),
          daysOfWeek: _scheduler.days_of_week,
          weeksOfMonth: _scheduler.weeks_of_month,
          monthsOfYear: _scheduler.months_of_year
        };
        setScheduler(schedulerToShow);
      } catch (error) {
        console.log(error);
        enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
          variant: 'error'
        });
      }
    }
    getFlow();
  }, []);

  const onInputFlowChange = (e) => { setFlowType(e); };

  const onIntegrationChange = (e) => { setIntegration(e); };

  const onActiveChange = (e) => { setScheduler({ ...scheduler, active: e }); };

  const onStartDateChange = (e) => { setScheduler({ ...scheduler, startDate: e }); };

  const onEndDateChange = (e) => { setScheduler({ ...scheduler, endDate: e }); };

  const onTimeChange = (e) => { setScheduler({ ...scheduler, time: e }); };

  const onDaysOfWeekChange = (e) => { setScheduler({ ...scheduler, daysOfWeek: e }); };

  const onWeeksOfMonthChange = (e) => { setScheduler({ ...scheduler, weeksOfMonth: e }); };

  const onMonthsOfYearChange = (e) => { setScheduler({ ...scheduler, monthsOfYear: e }); };

  const handleEditFlow = async () => {
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
      await API.post(`flows/${match.params.id}`, { data: { scheduler: _scheduler } });
      enqueueSnackbar('Scheduler edited successfully', {
        variant: 'success'
      });
      history.goBack();
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
  };

  const onSubmit = () => {
    handleEditFlow();
  };

  return (
    <FlowForm
      flowType={flowType}
      flowsTypes={flowTypes}
      integration={integration}
      integrationsOptions={integrations}
      scheduler={scheduler}
      history={history}
      disableRule
      onInputFlowChange={onInputFlowChange}
      onIntegrationChange={onIntegrationChange}
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

EditFlowForm.propTypes = {
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  flowTypes: PropTypes.array.isRequired,
  integrations: PropTypes.array.isRequired
};

export default withSnackbar(withFetchOptions(EditFlowForm));
