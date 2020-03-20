import React from 'react';
import PropTypes from 'prop-types';
import { get, map } from 'lodash';
import { Button, Typography } from '@material-ui/core';
import ElementPlusValuePrinter from './ElementPlusValuePrinter';
import { markDayOfWeek, markWeekOfMonth, markMonthOfYear } from './TaskUtils';

const TaskScheduler = ({ classes, scheduler }) => {
  const daysOfWeek = markDayOfWeek(get(scheduler, 'days_of_week', []));
  const weeksOfMonth = markWeekOfMonth(get(scheduler, 'weeks_of_month', []));
  const monthsOfYear = markMonthOfYear(get(scheduler, 'months_of_year', []));

  return (
    <div className={classes.root}>
      <div className={classes.marginLeft2u}>
        <div className="display-flex align-items-baseline">
          <div>
            <Typography variant="subtitle2" color="primary">
              {scheduler.active && scheduler.active === true
                ? 'Active'
                : 'Inactive'}
            </Typography>
          </div>
        </div>
        <div className="display-flex align-items-baseline">
          <div>
            <Typography variant="subtitle2">Start Date:</Typography>
          </div>
          <div className={classes.marginLeft}>
            <Typography variant="caption">
              {get(scheduler, 'start_date', null)}
            </Typography>
          </div>
          <div className={classes.marginLeft2u}>
            <Typography variant="subtitle2">End Date:</Typography>
          </div>
          <div className={classes.marginLeft}>
            <Typography variant="caption">
              {get(scheduler, 'end_date', null)}
            </Typography>
          </div>
        </div>
        <ElementPlusValuePrinter
          element="Time"
          value={get(scheduler, 'time', '')}
          elementVariant="subtitle2"
          valueVariant="caption"
          elementColor="default"
          valueColor="inherit"
        />
        <div className="item-margin-top">
          <Typography variant="subtitle2">Days of Week:</Typography>
          <Typography variant="caption">
            <div className="display-flex flex-wrap-wrap align-items-baseline">
              {map(daysOfWeek, (value, llave) => (
                <div key={llave} className="item-margin-left">
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={!value}
                    color="primary"
                    className={classes.button}
                  >
                    {llave}
                  </Button>
                </div>
              ))}
            </div>
          </Typography>
        </div>
        <div className="item-margin-top">
          <Typography variant="subtitle2">Weeks of Month:</Typography>
          <Typography variant="caption">
            <div className="display-flex flex-wrap-wrap align-items-baseline">
              {map(weeksOfMonth, (value, llave) => (
                <div key={llave} className="item-margin-left">
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={!value}
                    color="primary"
                    className={classes.button}
                  >
                    {llave}
                  </Button>
                </div>
              ))}
            </div>
          </Typography>
        </div>
        <div className="item-margin-top">
          <Typography variant="subtitle2">Months of Year:</Typography>
          <Typography variant="caption">
            <div className="display-flex flex-wrap-wrap align-items-baseline">
              {map(monthsOfYear, (value, llave) => (
                <div key={llave} className="item-margin-left">
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={!value}
                    color="primary"
                    className={classes.button}
                  >
                    {llave}
                  </Button>
                </div>
              ))}
            </div>
          </Typography>
        </div>
      </div>
    </div>
  );
};

TaskScheduler.propTypes = {
  classes: PropTypes.object.isRequired,
  scheduler: PropTypes.object.isRequired
};

export default TaskScheduler;
