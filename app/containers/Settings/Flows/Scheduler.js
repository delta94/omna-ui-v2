import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
// material-ui
import { withSnackbar } from 'notistack';
import { withStyles } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MomentUtils from '@date-io/moment';
import { DatePicker, TimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
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
    margin: theme.spacing.unit,
    minWidth: 300,
    maxWidth: 350,
  },
  picker: {
    margin: `${theme.spacing(3)}px 5px`,
  }
});


function Scheduler(props) {
  const {
    classes, daysOfWeek, weeksOfMonth, monthsOfYear, startDate, endDate, time, active, status
  } = props;

  const onStartDateChange = (e) => { props.onStartDateChange(e); };

  const onEndDateChange = (e) => { props.onEndDateChange(e); };

  const onTimeChange = (e) => { props.onTimeChange(e); };

  const onActiveChange = (e) => { props.onActiveChange(e.target.checked); };

  const onDaysOfWeekChange = (e) => { props.onDaysOfWeekChange(e.target.value); };

  const onWeeksOfMonthChange = (e) => { props.onWeeksOfMonthChange(e.target.value); };

  const onMonthsOfYearChange = (e) => { props.onMonthsOfYearChange(e.target.value); };

  return (
    <div>
      <div className="display-flex flex-wrap-wrap">
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DatePicker
            label="Start date"
            value={startDate}
            onChange={onStartDateChange}
            animateYearScrolling={false}
            className={classes.formControl}
          />
        </MuiPickersUtilsProvider>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <DatePicker
            label="End date"
            value={endDate}
            onChange={onEndDateChange}
            animateYearScrolling={false}
            className={classes.formControl}
          />
        </MuiPickersUtilsProvider>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <div>
            <TimePicker
              className={classNames(classes.formControl)}
              ampm={false}
              label="Time"
              value={time}
              onChange={onTimeChange}
            />
          </div>
        </MuiPickersUtilsProvider>
      </div>
      <div>
        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="select-multiple-chip">Days of week</InputLabel>
          <Select
            multiple
            value={daysOfWeek}
            onChange={onDaysOfWeekChange}
            input={<Input id="select-multiple-chip" />}
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

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="select-multiple-chip">Months of year</InputLabel>
          <Select
            multiple
            value={monthsOfYear}
            onChange={onMonthsOfYearChange}
            input={<Input id="select-multiple-chip" />}
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

        <FormControl className={classes.formControl}>
          <InputLabel htmlFor="select-multiple">Weeks of month</InputLabel>
          <Select
            multiple
            value={weeksOfMonth}
            onChange={onWeeksOfMonthChange}
            input={<Input id="select-multiple" />}
            MenuProps={MenuProps}
          >
            {WEEKS_OF_MONTH.map(value => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {status && (
        <div>
          <FormControlLabel
            className={classes.formControl}
            disabled
            control={
              (
                <Checkbox
                  name="active"
                  checked={active}
                  onChange={onActiveChange}
                  value="active"
                  color="default"
                />
              )
            }
            label="Active"
          />
        </div>
      )}
    </div>
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
  status: true
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
  status: PropTypes.bool,
  onStartDateChange: PropTypes.func.isRequired,
  onEndDateChange: PropTypes.func.isRequired,
  onTimeChange: PropTypes.func.isRequired,
  onActiveChange: PropTypes.func.isRequired,
  onDaysOfWeekChange: PropTypes.func.isRequired,
  onWeeksOfMonthChange: PropTypes.func.isRequired,
  onMonthsOfYearChange: PropTypes.func.isRequired,
};

export default withSnackbar(withStyles(styles)(Scheduler));
