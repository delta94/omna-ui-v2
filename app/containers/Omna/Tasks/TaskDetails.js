import React from 'react';
import PropTypes from 'prop-types';
import API from './../Utils/api';
import GenericTabsHead from './../Common/GenericTabsHead';
import LoadingState from './../Common/LoadingState';
import get from 'lodash/get';
import map from 'lodash/map';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import AlertDialog from './../Common/AlertDialog';
import { withSnackbar } from 'notistack';
import {PapperBlock} from 'dan-components';

/* material-ui */
// core
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
// icons
import ArrowIcon from '@material-ui/icons/ArrowBack';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import DeleteIcon from '@material-ui/icons/Delete';


const tabHeaders = [  
    {label: "Executions", key: 0}, 
    {label: "Scheduler", key: 1}, 
    {label: "Notifications", key: 2}
 ];

function TabContainer({ children }) {
  return (
    <Typography component="div" style={{margin: '10px'}}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 2,
    overflowX: 'auto',
  },
  tabRoot: {
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    marginBottom: theme.spacing.unit * 2,
  },
  marginLeft: {
      marginLeft: theme.spacing.unit,
  },
  marginBottom: {
      marginBottom: theme.spacing.unit,
  },
  marginTop: {
      marginTop: theme.spacing.unit,
  },
  marginRight: {
      marginRight: theme.spacing.unit,
  },
  marginLeft2u: {
      marginLeft: theme.spacing.unit * 2,
  },
  marginBottom2u: {
      marginBottom: theme.spacing.unit * 2,
  },
  marginTop2u: {
      marginTop: theme.spacing.unit * 2,
  },
  marginRight2u: {
      marginRight: theme.spacing.unit * 2,
  },
  error: {
      color: 'red',
  },
  warning: {
      color: 'yellow',
  },
  green: {
      color: 'green',
  },
  gray: {
      color: 'gray',
  },
});

/* ======= Principal Class ======= */
class TaskDetails extends React.Component {
  state = {
      task: { data:{} },
      loading: true,
      content: 0,
      success: true,
      messageError: '',
      alertDialog: {
          open: false,
          message: '',
          id: '',
          action: '',
      },
  };

  componentDidMount() {
    const { task_id } = this.props.match.params;
    this.getAPItask(task_id);
  }
  
  getAPItask = (task_id) => {
        API.get(`/tasks/${task_id}`).then(response => {
            this.setState({ task: get(response, "data", { data: {} }) });
        }).catch((error) => {
            // handle error
            console.log(error);
            this.setState({ success: false, messageError: error.message });
        }).finally(() => {
            this.setState({ loading: false });
        });
  }

  handleTabChange = (event, value) => {
    this.setState({ content: value });
  };

  deleteFromAPI = (id) => {
      API.get(`/tasks/${id}/destroy`).then(response => {
          this.props.enqueueSnackbar('Task deleted successfully', {
              variant: 'success'
          });
      }).catch((error) => {
          this.props.enqueueSnackbar(error, {
              variant: 'error'
          });
      }).finally(() => {
          this.setState({ alertDialog: false });
      });
  }

  reRunFromAPI(id){
      API.get(`/tasks/${id}/retry`).then(response => {
          this.props.enqueueSnackbar('Task re-ran successfully', {
              variant: 'success'
          });
      }).catch((error) => {
          this.props.enqueueSnackbar(error, {
              variant: 'error'
          });
      }).finally(() => {
          this.setState({ alertDialog: false });
      });
  }

  handleAlertClick = (id, action) => {
      this.setState({alertDialog: {
          open: true,
          id: id,
          action: action,
          message: `Are you sure you want to "${action}" this task?`
      }});
  }

  handleDialogCancel = () => {
      this.setState({alertDialog: false, action: ''});
  }

  handleDialogConfirm = async () => {
      const { id, action } = this.state.alertDialog;

      if(action === "remove"){
          //this.deleteFromAPI(id);
          //this.props.history.push(`/tasks`);
          alert(`Remove action. Remember to make this code available`);
      }
      else if(action === "run"){
          //this.reRunFromAPI(id);
          alert(`Re-run action. Remember to make this code available`);
      }

      this.handleDialogCancel();
  }

  markDayOfWeek = (days) => {

    const days_of_week = {
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: false,
        Sun: false,
    };
    
    days.forEach(day => {
        days_of_week[day] = true;
    });

    return days_of_week;
  }

  markWeekOfMonth = (weeks) => {
    const weeks_of_month = {
        First: false,
        Second: false,
        Third: false,
        Fourth: false,
        Last: false,
    };

    weeks.forEach(week => {
        weeks_of_month[week] = true;
    });
      
    return weeks_of_month;
  }

  markMonthOfYear = (months) => {
    const months_of_year = {
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
        Dic: false,
    };

    months.forEach(month => {
        months_of_year[month] = true;
    });
      
    return months_of_year;
  }

  render() {
    const { classes } = this.props;
    const { content, loading, success, messageError, task, alertDialog } = this.state;
    const data = get(task, "data", { data:{} });
    var execCount = 0;
    var notCount = 0;
    const scheduler = get(data, "scheduler", null);
    const status = get(data, "status", "unknown");
    const notifications = get(data, "notifications", []);
    const executions = get(data, "executions", []);
    const id = get(data, "id", null);

    const days_of_week = this.markDayOfWeek(get(scheduler, "days_of_week", []));
    const weeks_of_month = this.markWeekOfMonth(get(scheduler, "weeks_of_month", []));
    const months_of_year = this.markMonthOfYear(get(scheduler, "months_of_year", []));

    return (
        <div>
            <PapperBlock icon={false}>
                <div>
                    {loading ? <LoadingState loading={loading} /> : null}
                    {loading ? null :
                        !success ?
                            <div className={classes.marginLeft2u}>
                                <Typography variant="h6" gutterBottom color="secondary">
                                    There is the following error: "{messageError}", please reload the page or tray again later.
                                </Typography>
                            </div> :
                                <Paper className={classes.root}>
                                    {
                                        //********* BUTTONS *********
                                    }
                                    <div className="display-flex justify-content-space-between">
                                        <Button variant="text" size="small" color="primary" component={Link} to={"/app/settings/tasks"}>
                                            <ArrowIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                                            Tasks
                                        </Button>
                                        <div>
                                            {
                                                status === "failed" ?
                                                    <Tooltip title="You Can Re-run the Task">
                                                        <Button variant="text" size="small" color="primary" className={classes.button} onClick={this.handleAlertClick.bind(this, id, "run")}>
                                                            Run
                                                            <PlayIcon className={classes.rightIcon} />
                                                        </Button>
                                                    </Tooltip> : null
                                            }
                                            <Tooltip title="Delete Task">
                                                <Button variant="text" size="small" color="primary" className={classes.button} onClick={this.handleAlertClick.bind(this, id, "remove")}>
                                                    Delete
                                                    <DeleteIcon className={classes.rightIcon} />
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    </div>
                                    <Divider />
                                    <div className={classNames(classes.marginLeft, classes.root)}>
                                        <Typography variant="h6">
                                            <strong>{id}</strong>
                                        </Typography>
                                    </div>
                                    <div className={classNames(classes.tabRoot, classes.marginLeft2u, classes.marginRight2u, classes.marginBottom2u)}>
                                        <div className="display-flex justify-content-space-between">
                                            <div className="display-flex align-items-baseline">
                                                <div>
                                                    <Typography variant="subtitle2">
                                                        <strong>Description: </strong>
                                                    </Typography>
                                                </div>
                                                <div className={classes.marginLeft}>
                                                    <Typography variant="subtitle2" color="primary">
                                                        {get(data, "description", "")}
                                                    </Typography>
                                                </div>
                                            </div>
                                            <div className="display-flex justify-content-flex-end">
                                                <div className="display-flex align-items-baseline">
                                                    <div>
                                                        <Typography variant="subtitle2">
                                                            <strong>Progress: </strong>
                                                        </Typography>
                                                    </div>
                                                    <div className={classes.marginLeft}>
                                                        <Typography variant="caption">
                                                            {get(data, "progress", 0)}
                                                        </Typography>
                                                    </div>
                                                </div>
                                                <div className={classes.marginLeft2u}>
                                                    <div className="display-flex align-items-baseline">
                                                        <div>
                                                            <Typography variant="subtitle2">
                                                                <strong>Status: </strong>
                                                            </Typography>
                                                        </div>
                                                        <div className={classes.marginLeft}>
                                                            <Typography variant="caption" className={status === "failed" ? classes.error : status === "completed" ? classes.green : classes.gray}>
                                                                <strong>{status}</strong>
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="display-flex justify-content-space-between justify-content-flex-start">
                                            <div className="display-flex align-items-baseline">
                                                <div>
                                                    <Typography variant="subtitle2">
                                                        <strong>Created at: </strong>
                                                    </Typography>
                                                </div>
                                                <div className={classes.marginLeft}>
                                                    <Typography variant="caption">
                                                        {get(data, "created_at", null)}
                                                    </Typography>
                                                </div>
                                            </div>
                                            <div className={classes.marginLeft2u}>
                                                <div className="display-flex align-items-baseline">
                                                    <div>
                                                        <Typography variant="subtitle2">
                                                            <strong>Updated at: </strong>
                                                        </Typography>
                                                    </div>
                                                    <div className={classes.marginLeft}>
                                                        <Typography variant="caption">
                                                            {get(data, "updated_at", null)}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes.tabRoot}>
                                        <GenericTabsHead 
                                            tabHeaders={tabHeaders}
                                            onChange={this.handleTabChange}
                                            value={this.state.content}
                                        />
                                        {/* Executions */}
                                        {content === 0 && <TabContainer>
                                            {executions.length > 0 ?
                                                executions.map(exec => (
                                                    <div className={classes.root} key={execCount}>
                                                        <div className={classes.marginLeft2u}>
                                                            <div className="display-flex align-items-baseline">
                                                                <div>
                                                                    <Typography variant="subtitle1" color="primary">
                                                                        <strong>{execCount++}-</strong>
                                                                    </Typography>
                                                                </div>
                                                                <div className={classes.marginLeft}>
                                                                    <Typography variant="subtitle2">
                                                                        <strong>Status: </strong>
                                                                    </Typography>
                                                                </div>
                                                                <div className={classes.marginLeft}>
                                                                    <Typography variant="caption" className={get(exec, "status", "") === "failed" ? classes.error : exec.status === "completed" ? classes.green : classes.gray}>
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
                                                                        {get(exec, "started_at", "--")}
                                                                    </Typography>
                                                                </div>
                                                                <div className={classes.marginLeft2u}>
                                                                    <Typography variant="subtitle2">
                                                                        <strong>Complete Date: </strong>
                                                                    </Typography>
                                                                </div>
                                                                <div className={classes.marginLeft}>
                                                                    <Typography variant="caption">
                                                                        {get(exec, "completed_at", "--")}
                                                                    </Typography>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Divider />
                                                    </div>
                                                ))
                                                : "There is no retrieved information."
                                            }
                                        </TabContainer>}
                                        {/* Scheduler */}
                                        {content === 1 && <TabContainer>
                                            {scheduler ?
                                                <div className={classes.root}>
                                                    <div className={classes.marginLeft2u}>
                                                        <div className="display-flex align-items-baseline">
                                                            <div>
                                                                <Typography variant="subtitle2" color="primary">
                                                                    <strong>{scheduler.active && scheduler.active === true ? "Active" : "Inactive"}</strong>
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
                                                                    {get(scheduler, "start_date", null)}
                                                                </Typography>
                                                            </div>
                                                            <div className={classes.marginLeft2u}>
                                                                <Typography variant="subtitle2">
                                                                    <strong>End Date: </strong>
                                                                </Typography>
                                                            </div>
                                                            <div className={classes.marginLeft}>
                                                                <Typography variant="caption">
                                                                    {get(scheduler, "end_date", null)}
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                        <div className="display-flex align-items-baseline">
                                                            <div>
                                                                <Typography variant="subtitle2">
                                                                    <strong>Time: </strong>
                                                                </Typography>
                                                            </div>
                                                            <div className={classes.marginLeft}>
                                                                <Typography variant="caption">
                                                                    {get(scheduler, "time", null)}
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                        <div className="display-flex flex-direction-column">
                                                            <div>
                                                                <Typography variant="subtitle2">
                                                                    <strong>Days of Week: </strong>
                                                                </Typography>
                                                                
                                                                <Typography variant="caption">
                                                                    <div className="display-flex flex-wrap-wrap align-items-baseline">
                                                                        {map(days_of_week, (value, key) =>(
                                                                                <Button key={key} variant="outlined" size="small" disabled={!value} color="primary" className={classes.button}>
                                                                                    {key}
                                                                                </Button>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                </Typography>
                                                            </div>
                                                            <div>
                                                                <Typography variant="subtitle2">
                                                                    <strong>Weeks of Month: </strong>
                                                                </Typography>
                                                                
                                                                <Typography variant="caption">
                                                                    <div className="display-flex flex-wrap-wrap align-items-baseline">
                                                                        {map(weeks_of_month, (value, key) =>(
                                                                                <Button variant="outlined" size="small" disabled={!value} color="primary" className={classes.button}>
                                                                                    {key}
                                                                                </Button>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                </Typography>
                                                            </div>
                                                            <div>
                                                                <Typography variant="subtitle2">
                                                                    <strong>Months of Year: </strong>
                                                                </Typography>
                                                                <Typography variant="caption">
                                                                    <div className="display-flex flex-wrap-wrap align-items-baseline">
                                                                        {map(months_of_year, (value, key) =>(
                                                                                <Button variant="outlined" size="small" disabled={!value} color="primary" className={classes.button}>
                                                                                    {key}
                                                                                </Button>
                                                                            ))
                                                                        }
                                                                    </div>
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                : "There is no retrieved information."
                                            }
                                        </TabContainer>}
                                        {/* Notifications */}
                                        {content === 2 && <TabContainer>
                                            {notifications.length > 0 ?
                                                notifications.map(not => (
                                                    <div className={classes.root} key={notCount++}>
                                                        <div className={classes.marginLeft2u}>
                                                            <div className="display-flex align-items-baseline">
                                                                <div className={classes.marginLeft2u}>
                                                                    <Typography variant="subtitle2" className={get(not, "type", "") === "error" ? classes.error : not.type === "warning" ? classes.warning : classes.gray}>
                                                                        <strong>{not.type === "error" ? "Error" : not.type === "warning" ? "Warning" : not.type === "info" ? "Info" : "Unknown"}: </strong>
                                                                    </Typography>
                                                                </div>
                                                                <div className={classes.marginLeft}>
                                                                    <Typography variant="subtitle2" className={not.type === "error" ? classes.error : not.type === "warning" ? classes.warning : classes.gray}>
                                                                        {get(not, "message", null)}
                                                                    </Typography>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Divider />
                                                    </div>
                                                ))
                                                : "There is no retrieved information."
                                            }
                                        </TabContainer>}
                                    </div>
                                </Paper>
                    }
                </div>
                <AlertDialog
                    open={alertDialog.open}
                    message={alertDialog.message}
                    handleCancel={this.handleDialogCancel}
                    handleConfirm={this.handleDialogConfirm}
                />
            </PapperBlock>
        </div>
    );
  }
}

TaskDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withSnackbar(withStyles(styles, { withTheme: true })(TaskDetails));