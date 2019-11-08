import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
// material-ui
import { withSnackbar } from 'notistack';
//
import Loading from 'dan-components/Loading';
//
import get from 'lodash/get';
import moment from 'moment';
//
import API from '../../Utils/api';
import FlowForm from './FlowForm';
import withFetchOptions from './WithFetchOptions';
import PageHeader from '../../Common/PageHeader';

function AddFlowForm(props) {
  const [loading, setLoading] = useState(false);
  const [flowType, setFlowType] = useState('');
  const [integration, setIntegration] = useState('');
  const [scheduler, setScheduler] = useState({
    status: false,
    daysOfWeek: [],
    weeksOfMonth: [],
    monthsOfYear: [],
    startDate: new Date(),
    endDate: new Date(),
    time: new Date()
  });

  const { history, flowTypes, integrations } = props;

  const onInputFlowChange = (e) => { setFlowType(e); };

  const onIntegrationChange = (e) => { setIntegration(e); };

  const onActiveChange = (e) => { setScheduler({ ...scheduler, active: e }); };

  const onStartDateChange = (e) => { setScheduler({ ...scheduler, startDate: e }); };

  const onEndDateChange = (e) => { setScheduler({ ...scheduler, endDate: e }); };

  const onTimeChange = (e) => { setScheduler({ ...scheduler, time: e }); };

  const onDaysOfWeekChange = (e) => { setScheduler({ ...scheduler, daysOfWeek: e }); };

  const onWeeksOfMonthChange = (e) => { setScheduler({ ...scheduler, weeksOfMonth: e }); };

  const onMonthsOfYearChange = (e) => { setScheduler({ ...scheduler, monthsOfYear: e }); };

  const handleAddFlow = async () => {
    const { enqueueSnackbar } = props;

    try {
      setLoading(true);
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
      history.goBack();
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
    setLoading(false);
  };

  const onSubmit = () => {
    handleAddFlow();
  };

  return (
    <Fragment>
      <PageHeader title="Add Workflow" history={history} />
      {loading && <Loading />}
      <FlowForm
        flowType={flowType}
        flowsTypes={flowTypes}
        integration={integration}
        integrationsOptions={integrations}
        scheduler={scheduler}
        history={history}
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
    </Fragment>
  );
}

AddFlowForm.propTypes = {
  history: PropTypes.object.isRequired,
  flowTypes: PropTypes.array.isRequired,
  integrations: PropTypes.array.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(withFetchOptions(AddFlowForm));
