import React, { Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
// material-ui
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Ionicon from 'react-ionicons';
// dandelion-template
import { PapperBlock } from 'dan-components';
import Autocomplete from '@material-ui/lab/Autocomplete';
//
import FormActions from '../../Common/FormActions';
import Scheduler from './Scheduler';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit
  },
  inputWidth: {
    width: '300px'
  },
  marginTop: {
    marginTop: theme.spacing.unit
  },
  marginLeft: {
    marginLeft: theme.spacing.unit
  },
  paper: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
    maxWidth: 300
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  }
});

function FlowForm(props) {
  const {
    classes,
    history,
    flowType,
    flowsTypes,
    integration,
    integrationsOptions,
    onSubmit,
    scheduler,
    disableRule
  } = props;

  const {
    startDate,
    endDate,
    time,
    active,
    daysOfWeek,
    weeksOfMonth,
    monthsOfYear,
    status
  } = scheduler;

  const onInputFlowChange = e => {
    props.onInputFlowChange(e.target.value);
  };

  const onIntegrationChange = e => {
    debugger;
    props.onIntegrationChange(e.target.value);
  };

  const onActiveChange = e => {
    props.onActiveChange(e);
  };

  const onStartDateChange = e => {
    props.onStartDateChange(e);
  };

  const onEndDateChange = e => {
    props.onEndDateChange(e);
  };

  const onTimeChange = e => {
    props.onTimeChange(e);
  };

  const onDaysOfWeekChange = e => {
    props.onDaysOfWeekChange(e);
  };

  const onWeeksOfMonthChange = e => {
    props.onWeeksOfMonthChange(e);
  };

  const onMonthsOfYearChange = e => {
    props.onMonthsOfYearChange(e);
  };

  const onSubmitForm = e => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Fragment>
      <form onSubmit={onSubmitForm} noValidate autoComplete="off">
        <PapperBlock
          title="Workflow"
          icon="ios-shuffle"
          desc="Define a workflow from an available integration"
        >
          <div className={classes.paper}>
            <Typography variant="h6">I want to:</Typography>
            <TextField
              required
              id="flows"
              select
              label="Flows"
              value={flowType}
              name="flows"
              disabled={disableRule}
              onChange={onInputFlowChange}
              SelectProps={{
                MenuProps: {
                  className: classes.inputWidth
                }
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
            <Ionicon icon="ios-repeat" className={classes.marginLeft} />
            <Autocomplete
              autoHighlight
              id="combo-box-integrations"
              options={integrationsOptions}
              onChange={onIntegrationChange}
              getOptionLabel={option => option.name}
              style={{ width: 300 }}
              renderInput={params => (
                <TextField
                  {...params}
                  label="Integrations"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          </div>
        </PapperBlock>

        <PapperBlock
          title="Scheduler"
          icon="ios-clock-outline"
          desc="Select how often you want to run the workflow"
        >
          <Scheduler
            startDate={startDate}
            endDate={endDate}
            time={time}
            active={active}
            status={status}
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
        <FormActions
          history={history}
          acceptBtnDisabled={!(flowType && integration)}
        />
      </form>
    </Fragment>
  );
}

FlowForm.defaultProps = {
  disableRule: false,
  flowType: '',
  integration: '',
  scheduler: {}
};

FlowForm.propTypes = {
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  disableRule: PropTypes.bool,
  flowType: PropTypes.string,
  flowsTypes: PropTypes.array.isRequired,
  integration: PropTypes.string,
  integrationsOptions: PropTypes.array.isRequired,
  scheduler: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onInputFlowChange: PropTypes.func.isRequired,
  onIntegrationChange: PropTypes.func.isRequired,
  onActiveChange: PropTypes.func.isRequired,
  onStartDateChange: PropTypes.func.isRequired,
  onEndDateChange: PropTypes.func.isRequired,
  onTimeChange: PropTypes.func.isRequired,
  onDaysOfWeekChange: PropTypes.func.isRequired,
  onWeeksOfMonthChange: PropTypes.func.isRequired,
  onMonthsOfYearChange: PropTypes.func.isRequired
};

export default withSnackbar(withStyles(styles)(FlowForm));
