import React from 'react';
import { get } from 'lodash';
import moment from 'moment';
import { Divider, Typography } from '@material-ui/core';

const TaskExecutions = ({ classes, executions }) => {
  return executions.map(exec => (
    <div className={classes.root} key={JSON.stringify(exec)}>
      <div className={classes.paddingBottom2u}>
        <div className="display-flex align-items-baseline">
          <div className={classes.marginLeft}>
            <Typography variant="subtitle2">Status:</Typography>
          </div>
          <div className={classes.marginLeft}>
            <Typography
              variant="caption"
              className={
                get(exec, 'status', '') === 'failed'
                  ? classes.error
                  : exec.status === 'completed'
                  ? classes.green
                  : classes.gray
              }
            >
              {exec.status}
            </Typography>
          </div>
          <div className={classes.marginLeft2u}>
            <Typography variant="subtitle2">Start Date:</Typography>
          </div>
          <div className={classes.marginLeft}>
            <Typography variant="caption">
              {get(exec, 'started_at', null) != null
                ? moment(exec.started_at).format('Y-MM-DD H:mm:ss')
                : '--'}
            </Typography>
          </div>
          <div className={classes.marginLeft2u}>
            <Typography variant="subtitle2">Complete Date:</Typography>
          </div>
          <div className={classes.marginLeft}>
            <Typography variant="caption">
              {get(exec, 'completed_at', null) != null
                ? moment(exec.completed_at).format('Y-MM-DD H:mm:ss')
                : '--'}
            </Typography>
          </div>
        </div>
      </div>
      <Divider />
    </div>
  ));
};

export default TaskExecutions;
