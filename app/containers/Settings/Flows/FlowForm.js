import React, { Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
// material-ui
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Type from 'dan-styles/Typography.scss';
import CompareArrowsIcon from '@material-ui/icons/CompareArrows';
// dandelion-template
import { PapperBlock } from 'dan-components';
import Avatar from '@material-ui/core/Avatar';
import { getLogo } from 'dan-containers/Common/Utils';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import AutoSuggestion from 'dan-components/AutoSuggestion';
//
import FormActions from 'dan-containers/Common/FormActions';
import Scheduler from './Scheduler';

const styles = theme => ({
  root: {
    padding: theme.spacing(1)
  },
  inputWidth: {
    width: '40%',
    minWidth: '300px',
  },
  margin: {
    margin: theme.spacing(1)
  },
  marginTop: {
    marginTop: theme.spacing(1)
  },
  marginLeft: {
    marginLeft: theme.spacing(1)
  },
  marginRight: {
    marginRight: theme.spacing(1)
  },
  paper: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  integrationLabel: {
    display: 'flex',
    alignItems: 'center'
  },
  alignCenter: {
    justifyContent: 'space-around'
  }
});

function FlowForm(props) {
  const {
    classes,
    history,
    flowTitle,
    flowType,
    flowsTypes,
    integration,
    integrationsOptions,
    onSubmit,
    scheduler,
    action,
    loading,
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
  } = scheduler;

  const inputLabel = React.useRef(null);
  const [labelWidth, setLabelWidth] = React.useState(0);

  React.useEffect(() => {
    setLabelWidth(inputLabel.current ? inputLabel.current.offsetWidth : undefined);
  }, []);

  const onInputFlowChange = e => {
    props.onInputFlowChange(e.target.value);
  };

  const onIntegrationChange = (e, item) => {
    props.onIntegrationChange(item || '');
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
    <form onSubmit={onSubmitForm} noValidate autoComplete="off">
      <PapperBlock
        title="Action"
        icon="ios-shuffle"
        desc="Workflows will allow you to run actions on specific integrations"
      >
        {!loading ? (
          <div className={classNames(classes.paper, action === 'edit' ? classes.alignCenter : undefined)}>
            {action === 'edit' ? (
              <Typography variant="h6" gutterBottom>
                <span className={classNames(Type.textInfo, Type.bold)}>
                  {flowTitle}
                </span>
              </Typography>
            ) : (
              <FormControl variant="outlined" className={classes.inputWidth}>
                <InputLabel ref={inputLabel} id="flows">
                  Flows
                </InputLabel>
                <Select
                  labelId="boolean-label"
                  id="flows"
                  name="flows"
                  disabled={disableRule}
                  onChange={onInputFlowChange}
                  labelWidth={labelWidth}
                >
                  {flowsTypes.map(option => (
                    <MenuItem key={option.type} value={option.type}>
                      {option.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <CompareArrowsIcon className={classes.margin} style={{ fontSize: 40 }} />
            {action === 'edit' ? (
              <div className={classes.integrationLabel}>
                {integration && (
                  <Fragment>
                    <Avatar
                      src={getLogo(integration.channel_title)}
                      alt="logo"
                      aria-label="Recipe"
                      className={classes.marginRight}
                    />
                    <Typography variant="h6" gutterBottom>
                      <span className={classNames(Type.textInfo, Type.bold)}>
                        {integration.name}
                      </span>
                    </Typography>
                  </Fragment>
                )}
              </div>
            ) : (
              <AutoSuggestion
                id="integration-id"
                label="Integrations"
                className={classes.inputWidth}
                options={integrationsOptions}
                onChange={(e, value) => onIntegrationChange(e, value)}
                value={integration}
              />
            )
            }
          </div>
        ) : (
          <span>Loading...</span>
        )}
      </PapperBlock>

      <PapperBlock
        title="Scheduler"
        icon="ios-clock-outline"
        desc="This configuration will allow you to run the workflow automatically"
      >
        <Scheduler
          startDate={startDate}
          endDate={endDate}
          time={time}
          active={active}
          action={action}
          daysOfWeek={daysOfWeek}
          weeksOfMonth={weeksOfMonth}
          monthsOfYear={monthsOfYear}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
          onTimeChange={onTimeChange}
          onDaysOfWeekChange={onDaysOfWeekChange}
          onWeeksOfMonthChange={onWeeksOfMonthChange}
          onMonthsOfYearChange={onMonthsOfYearChange}
        />
      </PapperBlock>
      <FormActions
        history={history}
        acceptButtonDisabled={!(flowType && integration)}
      />
    </form>
  );
}

FlowForm.defaultProps = {
  disableRule: false,
  flowType: '',
  integration: undefined,
  action: 'edit',
  flowTitle: '',
  loading: false,
  scheduler: {}
};

FlowForm.propTypes = {
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  action: PropTypes.string,
  loading: PropTypes.bool,
  flowTitle: PropTypes.string,
  disableRule: PropTypes.bool,
  flowType: PropTypes.string,
  flowsTypes: PropTypes.array.isRequired,
  integration: PropTypes.object,
  integrationsOptions: PropTypes.array.isRequired,
  scheduler: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onInputFlowChange: PropTypes.func.isRequired,
  onIntegrationChange: PropTypes.func.isRequired,
  onStartDateChange: PropTypes.func.isRequired,
  onEndDateChange: PropTypes.func.isRequired,
  onTimeChange: PropTypes.func.isRequired,
  onDaysOfWeekChange: PropTypes.func.isRequired,
  onWeeksOfMonthChange: PropTypes.func.isRequired,
  onMonthsOfYearChange: PropTypes.func.isRequired
};

export default withSnackbar(withStyles(styles)(FlowForm));
