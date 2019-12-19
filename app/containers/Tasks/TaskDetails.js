import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import map from 'lodash/map';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { withSnackbar } from 'notistack';
import moment from 'moment';
import Ionicon from 'react-ionicons';

/* material-ui */
// core
import { withStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
// our
import API from '../Utils/api';
import GenericTabsHead from '../Common/GenericTabsHead';
import LoadingState from '../Common/LoadingState';
import AlertDialog from '../Common/AlertDialog';
import GenericErrorMessage from '../Common/GenericErrorMessage';
import Utils from '../Common/Utils';
import PageHeader from '../Common/PageHeader';

const variantIcon = Utils.iconVariants();

const myClass = {
  info: 'isa_info',
  success: 'isa_success',
  warning: 'isa_warning',
  error: 'isa_error',
};

const tabHeaders = [
  {
    label: 'Executions', key: 0
  },
  {
    label: 'Scheduler', key: 1
  },
  {
    label: 'Notifications', key: 2
  }
];

function NotificationBottom({ type, message }) {
  const Icon = type !== 'success' && type !== 'error' && type !== 'warning' ? variantIcon.info : variantIcon[type];
  return (
    <div className={myClass[type]}>
      <div className="display-flex justify-content-flex-start">
        <div>
          <Ionicon icon={Icon} />
        </div>
        <div className="display-flex flex-direction-column flex-wrap-wrap item-margin-left">
          {message}
        </div>
      </div>
    </div>
  );
}

NotificationBottom.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};

function TabContainer({ children }) {
  return (
    <Typography component="div" style={{ margin: '10px' }}>
      {children}
    </Typography>
  );
}
TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

function ElementPlusValuePrinter({
  element,
  value,
  elementVariant,
  elementColor,
  valueVariant,
  valueColor
}) {
  return (
    <div className="display-flex align-items-baseline">
      <div>
        <Typography variant={elementVariant} color={elementColor}>
          <strong>
            {element}
            :
          </strong>
        </Typography>
      </div>
      <div className="item-margin-left">
        <Typography variant={valueVariant} color={valueColor}>
          {value}
        </Typography>
      </div>
    </div>
  );
}
ElementPlusValuePrinter.propTypes = {
  element: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  elementVariant: PropTypes.string.isRequired,
  elementColor: PropTypes.string.isRequired,
  valueVariant: PropTypes.string.isRequired,
  valueColor: PropTypes.string.isRequired
};

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 2,
    overflowX: 'auto'
  },
  tabRoot: {
    backgroundColor: theme.palette.background.paper
  },
  marginLeft: {
    marginLeft: theme.spacing.unit
  },
  marginLeft2u: {
    marginLeft: theme.spacing.unit * 2
  },
  leftIcon: {
    marginRight: theme.spacing.unit
  },
  iconSmall: {
    fontSize: 20
  },
  margin: {
    margin: theme.spacing.unit
  },
  error: {
    color: 'red'
  },
  green: {
    color: 'green'
  },
  gray: {
    color: 'gray'
  }
});

/* ======= Principal Class ======= */
class TaskDetails extends React.Component {
  state = {
    task: { data: {} },
    loading: true,
    content: 0,
    success: true,
    messageError: '',
    alertDialog: {
      open: false,
      message: '',
      id: '',
      action: ''
    }
  };

  componentDidMount() {
    const taskId = get(this.props, 'match.params.id', null);
    const task = get(this.props, 'location.state.task', null);
    if (task !== null && taskId === get(task, 'data.id', null)) {
      this.setState({ task, loading: false });
    } else {
      this.getAPItask(taskId);
    }
  }

  getAPItask = (id) => {
    this.setState({ loading: true });

    API.get(`/tasks/${id}`)
      .then(response => {
        this.setState({ task: get(response, 'data', { data: {} }) });
      })
      .catch(error => {
        // handle error
        console.log(error);
        this.setState({ success: false, messageError: error.message });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  onClickGetAPItask = (id) => () => {
    this.getAPItask(id);
  }

  handleTabChange = (event, value) => {
    this.setState({ content: value });
  };

  deleteFromAPI = id => {
    const { enqueueSnackbar } = this.props;
    API.get(`/tasks/${id}/destroy`).then(() => {
      enqueueSnackbar('Task deleted successfully', { variant: 'success' });
    })
      .catch(error => {
        enqueueSnackbar(error, { variant: 'error' });
      })
      .finally(() => {
        this.setState({ alertDialog: false });
      });
  };

  handleAlertClick = (id, action) => () => {
    this.setState({
      alertDialog: {
        open: true,
        id,
        action,
        message: `Are you sure you want to "${action}" this task?`
      }
    });
  };

  handleDialogCancel = () => {
    this.setState({ alertDialog: false });
  };

  handleDialogConfirm = async () => {
    const { alertDialog } = this.state;
    const { id, action } = alertDialog;

    if (action === 'remove') {
      const { history } = this.props;
      this.deleteFromAPI(id);
      history.push('/app/tasks-list');
    } else if (action === 'run') {
      this.reRunFromAPI(id);
    }

    this.handleDialogCancel();
  };

  markDayOfWeek = days => {
    const daysOfWeek = {
      Mon: false,
      Tue: false,
      Wed: false,
      Thu: false,
      Fri: false,
      Sat: false,
      Sun: false
    };

    days.forEach(day => {
      daysOfWeek[day] = true;
    });

    return daysOfWeek;
  };

  markWeekOfMonth = weeks => {
    const weeksOfMonth = {
      First: false,
      Second: false,
      Third: false,
      Fourth: false,
      Last: false
    };

    weeks.forEach(week => {
      weeksOfMonth[week] = true;
    });

    return weeksOfMonth;
  };

  markMonthOfYear = months => {
    const monthsOfYear = {
      Jan: false,
      Feb: false,
      Mar: false,
      Apr: false,
      May: false,
      Jun: false,
      Jul: false,
      Aug: false,
      Sep: false,
      Oct: false,
      Nov: false,
      Dic: false
    };

    months.forEach(month => {
      monthsOfYear[month] = true;
    });

    return monthsOfYear;
  };

  reRunFromAPI(id) {
    const { enqueueSnackbar } = this.props;
    API.get(`/tasks/${id}/retry`)
      .then(() => {
        enqueueSnackbar('Task re-ran successfully', { variant: 'success' });
      })
      .catch(error => {
        enqueueSnackbar(error, { variant: 'error' });
      })
      .finally(() => {
        this.setState({ alertDialog: false });
      });
  }

  render() {
    const { classes, history } = this.props;
    const {
      content,
      loading,
      success,
      messageError,
      task,
      alertDialog
    } = this.state;
    const data = get(task, 'data', { data: {} });
    const scheduler = get(data, 'scheduler', null);
    const status = get(data, 'status', 'unknown');
    const notifications = get(data, 'notifications', []);
    const executions = get(data, 'executions', []);
    const id = get(data, 'id', '');

    const daysOfWeek = this.markDayOfWeek(get(scheduler, 'days_of_week', []));
    const weeksOfMonth = this.markWeekOfMonth(
      get(scheduler, 'weeks_of_month', [])
    );
    const monthsOfYear = this.markMonthOfYear(
      get(scheduler, 'months_of_year', [])
    );

    return (
      <div>
        <PageHeader title="Task Details" history={history} />
        <Paper>
          <div className="item-padding">
            {loading ? <LoadingState loading={loading} /> : null}
            {loading ? null : !success ? (
              <GenericErrorMessage messageError={messageError} />
            ) : (
              <div>
                {
                  // ********* BUTTONS *********
                }
                <div className="display-flex justify-content-space-between">
                  <Button
                    variant="text"
                    size="small"
                    color="primary"
                    component={Link}
                    to="/app/tasks"
                  >
                    <Ionicon icon={variantIcon.arrowBack} className={classNames(classes.leftIcon, classes.iconSmall)} />
                    Tasks
                  </Button>
                  <Button
                    variant="text"
                    size="small"
                    color="primary"
                    onClick={this.onClickGetAPItask(id)}
                  >
                    <Ionicon icon={variantIcon.refresh} className={classNames(classes.leftIcon, classes.iconSmall)} />
                    Reload Info
                  </Button>
                  <div>
                    {status === 'failed' ? (
                      <Tooltip title="You Can Re-run the Task">
                        <Button
                          variant="text"
                          size="small"
                          color="primary"
                          className={classes.button}
                          onClick={this.handleAlertClick(id, 'run')}
                        >
                          Run
                          <Ionicon icon={variantIcon.play} className={classes.rightIcon} />
                        </Button>
                      </Tooltip>
                    ) : null}
                    <Tooltip title="Delete Task">
                      <Button
                        variant="text"
                        size="small"
                        color="primary"
                        className={classes.button}
                        onClick={this.handleAlertClick(id, 'remove')}
                      >
                        Delete
                        <Ionicon icon={variantIcon.delete} className={classes.rightIcon} />
                      </Button>
                    </Tooltip>
                  </div>
                </div>
                <Divider />
                <div className={classNames(classes.root, classes.margin)}>
                  <div className="display-flex justify-content-space-between">
                    <Typography variant="subtitle1" color="primary">
                      <strong>{get(data, 'description', '')}</strong>
                      {' '}
                    </Typography>
                    <div className="display-flex justify-content-flex-end">
                      <ElementPlusValuePrinter
                        element="Progress"
                        value={get(data, 'progress', '') + '%'}
                        elementVariant="subtitle2"
                        valueVariant="caption"
                        elementColor="default"
                        valueColor="inherit"
                      />
                      <div className={classes.marginLeft}>
                        <div className="display-flex align-items-baseline">
                          <div>
                            <Typography variant="subtitle2">
                              <strong>Status: </strong>
                            </Typography>
                          </div>
                          <div className={classes.marginLeft}>
                            <Typography
                              variant="caption"
                              className={
                                status === 'failed'
                                  ? classes.error
                                  : status === 'completed'
                                    ? classes.green
                                    : classes.gray
                              }
                            >
                              <strong>{status}</strong>
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={classNames(classes.marginLeft2u)}>
                    <Typography variant="caption" color="inherit">
                      {id}
                      {' '}
                    </Typography>
                  </div>
                  <div className="display-flex justify-content-space-between justify-content-flex-start">
                    <ElementPlusValuePrinter
                      element="Created at"
                      value={
                        get(data, 'created_at', null) != null
                          ? moment(data.created_at).format('Y-MM-DD H:mm:ss')
                          : '--'
                      }
                      elementVariant="subtitle2"
                      valueVariant="caption"
                      elementColor="default"
                      valueColor="inherit"
                    />
                    <div className={classes.marginLeft2u}>
                      <ElementPlusValuePrinter
                        element="Updated at"
                        value={
                          get(data, 'updated_at', null) != null
                            ? moment(data.updated_at).format('Y-MM-DD H:mm:ss')
                            : '--'
                        }
                        elementVariant="subtitle2"
                        valueVariant="caption"
                        elementColor="default"
                        valueColor="inherit"
                      />
                    </div>
                  </div>
                </div>
                <div className={classes.tabRoot}>
                  <GenericTabsHead
                    tabHeaders={tabHeaders}
                    onChange={this.handleTabChange}
                    value={get(this.state, 'content', [])}
                  />
                  {/* Executions */}
                  {content === 0 && (
                    <TabContainer className="item-margin">
                      {executions.length > 0 ? (
                        executions.map(exec => (
                          // Considering that the object is unique in this list
                          <div className={classes.root} key={JSON.stringify(exec)}>
                            <div className={classes.marginLeft2u}>
                              <div className="display-flex align-items-baseline">
                                <div className={classes.marginLeft}>
                                  <Typography variant="subtitle2">
                                    <strong>Status: </strong>
                                  </Typography>
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
                                  <Typography variant="subtitle2">
                                    <strong>Start Date: </strong>
                                  </Typography>
                                </div>
                                <div className={classes.marginLeft}>
                                  <Typography variant="caption">
                                    {get(exec, 'started_at', null) != null ? moment(exec.started_at).format('Y-MM-DD H:mm:ss') : '--'}
                                  </Typography>
                                </div>
                                <div className={classes.marginLeft2u}>
                                  <Typography variant="subtitle2">
                                    <strong>Complete Date: </strong>
                                  </Typography>
                                </div>
                                <div className={classes.marginLeft}>
                                  <Typography variant="caption">
                                    {get(exec, 'completed_at', null) != null ? moment(exec.completed_at).format('Y-MM-DD H:mm:ss') : '--'}
                                  </Typography>
                                </div>
                              </div>
                            </div>
                            <Divider />
                          </div>
                        ))
                      ) : (
                        <NotificationBottom
                          type="info"
                          message="There is no retrieved information."
                        />
                      )}
                    </TabContainer>
                  )}
                  {/* Scheduler */}
                  {content === 1 && (
                    <TabContainer className="item-margin">
                      {scheduler ? (
                        <div className={classes.root}>
                          <div className={classes.marginLeft2u}>
                            <div className="display-flex align-items-baseline">
                              <div>
                                <Typography variant="subtitle2" color="primary">
                                  <strong>
                                    {scheduler.active && scheduler.active === true ? 'Active' : 'Inactive'}
                                  </strong>
                                </Typography>
                              </div>
                            </div>
                            <div className="display-flex align-items-baseline">
                              <div>
                                <Typography variant="subtitle2">
                                  <strong>Start Date: </strong>
                                </Typography>
                              </div>
                              <div className={classes.marginLeft}>
                                <Typography variant="caption">
                                  {get(scheduler, 'start_date', null)}
                                </Typography>
                              </div>
                              <div className={classes.marginLeft2u}>
                                <Typography variant="subtitle2">
                                  <strong>End Date: </strong>
                                </Typography>
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
                              <Typography variant="subtitle2">
                                <strong>Days of Week: </strong>
                              </Typography>
                              <Typography variant="caption">
                                <div className="display-flex flex-wrap-wrap align-items-baseline">
                                  {map(daysOfWeek, (value, llave) => (
                                    <div
                                      key={llave}
                                      className="item-margin-left"
                                    >
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
                              <Typography variant="subtitle2">
                                <strong>Weeks of Month: </strong>
                              </Typography>
                              <Typography variant="caption">
                                <div className="display-flex flex-wrap-wrap align-items-baseline">
                                  {map(weeksOfMonth, (value, llave) => (
                                    <div
                                      key={llave}
                                      className="item-margin-left"
                                    >
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
                              <Typography variant="subtitle2">
                                <strong>Months of Year: </strong>
                              </Typography>
                              <Typography variant="caption">
                                <div className="display-flex flex-wrap-wrap align-items-baseline">
                                  {map(monthsOfYear, (value, llave) => (
                                    <div
                                      key={llave}
                                      className="item-margin-left"
                                    >
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
                      ) : (
                        <NotificationBottom
                          type="info"
                          message="There is no retrieved information."
                        />
                      )}
                    </TabContainer>
                  )}
                  {/* Notifications */}
                  {content === 2 && (
                    <TabContainer>
                      <div>
                        {notifications.length > 0 ? (
                          notifications.map((not, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <div className="item-margin-top item-margin-bottom" key={index}>
                              <NotificationBottom
                                type={get(not, 'type', 'info')}
                                message={get(not, 'message', '')}
                              />
                            </div>
                          ))
                        ) : (
                          <div className="item-margin-top item-margin-bottom">
                            <NotificationBottom
                              type="info"
                              message="There is no retrieved information."
                            />
                          </div>
                        )}
                      </div>
                    </TabContainer>
                  )}
                </div>
              </div>
            )}
          </div>
          <AlertDialog
            open={alertDialog.open}
            message={alertDialog.message}
            handleCancel={this.handleDialogCancel}
            handleConfirm={this.handleDialogConfirm}
          />
        </Paper>
      </div>
    );
  }
}

TaskDetails.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default withSnackbar(
  withStyles(styles, { withTheme: true })(TaskDetails)
);
