import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
// material-ui
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import MomentUtils from '@date-io/moment';
import { DatePicker, TimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
/* import { TimePicker } from 'material-ui-pickers'; */
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import InputLabel from '@material-ui/core/InputLabel';
//
const WEEKS_OF_MONTH = ['First', 'Second', 'Third', 'Last'];
const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS_OF_YEAR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const styles = theme => ({
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    minWidth: 300,
    width: '100%',
  },
  gridItem: {
    margin: theme.spacing(1),
  }
});


function Scheduler(props) {
  const {
    classes, daysOfWeek, weeksOfMonth, monthsOfYear, startDate, endDate, time, active, action
  } = props;

  const onStartDateChange = (e) => { props.onStartDateChange(e); };

  const onEndDateChange = (e) => { props.onEndDateChange(e); };

  const onTimeChange = (e) => { props.onTimeChange(e); };

  const onDaysOfWeekChange = (e) => { props.onDaysOfWeekChange(e.target.value); };

  const onWeeksOfMonthChange = (e) => { props.onWeeksOfMonthChange(e.target.value); };

  const onMonthsOfYearChange = (e) => { props.onMonthsOfYearChange(e.target.value); };

  const inputLabel = React.useRef(null);

  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current.offsetWidth);
  }, []);

  return (
    <Grid cpontainer>
      <Grid container spacing={2} wrap="wrap">
        <Grid item xs={12} sm={6} md={4}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              id="starDate-id"
              label="Start date"
              format="YYYY/MM/DD"
              placeholder="2018/10/10"
              value={startDate}
              onChange={onStartDateChange}
              animateYearScrolling={false}
              inputVariant="outlined"
              className={classes.formControl}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <DatePicker
              label="End date"
              format="YYYY/MM/DD"
              placeholder="2018/10/10"
              value={endDate}
              onChange={onEndDateChange}
              animateYearScrolling={false}
              inputVariant="outlined"
              className={classes.formControl}
            />
          </MuiPickersUtilsProvider>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MuiPickersUtilsProvider utils={MomentUtils}>
            <TimePicker
              className={classNames(classes.formControl)}
              ampm={false}
              label="Time"
              inputVariant="outlined"
              value={time}
              onChange={onTimeChange}
            />
          </MuiPickersUtilsProvider>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel ref={inputLabel}>Days of week</InputLabel>
            <Select
              multiple
              value={daysOfWeek}
              onChange={onDaysOfWeekChange}
              labelWidth={labelWidth}
              renderValue={selected => (
                <div className={classes.chips}>
                  {selected.map(value => (
                    <Chip key={value} label={value} className={classes.chip} />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {DAYS_OF_WEEK.map(value => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel ref={inputLabel}>Months of year</InputLabel>
            <Select
              multiple
              value={monthsOfYear}
              onChange={onMonthsOfYearChange}
              labelWidth={labelWidth}
              renderValue={selected => (
                <div className={classes.chips}>
                  {selected.map(value => (
                    <Chip key={value} label={value} className={classes.chip} />
                  ))}
                </div>
              )}
              MenuProps={MenuProps}
            >
              {MONTHS_OF_YEAR.map(value => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel ref={inputLabel}>Weeks of month</InputLabel>
            <Select
              multiple
              value={weeksOfMonth}
              onChange={onWeeksOfMonthChange}
              labelWidth={labelWidth}
              MenuProps={MenuProps}
            >
              {WEEKS_OF_MONTH.map(value => (
                <MenuItem key={value} value={value}>
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {action === 'edit' && (
        <Grid style={{ marginTop: '16px' }}>
          <Chip color={active ? 'primary' : 'default'} label={active ? 'Scheduler is activated' : 'Scheduler is disactivated'} />
        </Grid>
      )}
    </Grid>
  );
}

Scheduler.defaultProps = {
  daysOfWeek: [],
  weeksOfMonth: [],
  monthsOfYear: [],
  startDate: new Date(),
  endDate: new Date(),
  time: new Date(),
  active: false,
};

Scheduler.propTypes = {
  classes: PropTypes.object.isRequired,
  daysOfWeek: PropTypes.array,
  weeksOfMonth: PropTypes.array,
  monthsOfYear: PropTypes.array,
  startDate: PropTypes.shape({}),
  endDate: PropTypes.shape({}),
  time: PropTypes.shape({}),
  active: PropTypes.bool,
  action: PropTypes.string.isRequired,
  onStartDateChange: PropTypes.func.isRequired,
  onEndDateChange: PropTypes.func.isRequired,
  onTimeChange: PropTypes.func.isRequired,
  onDaysOfWeekChange: PropTypes.func.isRequired,
  onWeeksOfMonthChange: PropTypes.func.isRequired,
  onMonthsOfYearChange: PropTypes.func.isRequired,
};

export default withSnackbar(withStyles(styles)(Scheduler));
