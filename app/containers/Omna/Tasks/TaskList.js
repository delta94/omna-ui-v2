import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import styles1 from 'dan-components/Widget/widget-jss';
import classNames from 'classnames';
import messageStyles from 'dan-styles/Messages.scss';
import progressStyles from 'dan-styles/Progress.scss';
import Ionicon from 'react-ionicons';

/* material-ui */
// core
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Popover from '@material-ui/core/Popover';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
// our
import API from '../Utils/api';
import LoadingState from '../Common/LoadingState';
import GenericTableToolBar from '../Common/GenericTableToolBar';
import GenericTablePagination from '../Common/GenericTablePagination';
import GenericTableHead from '../Common/GenericTableHead';
import AlertDialog from '../Common/AlertDialog';
import GenericErrorMessage from '../Common/GenericErrorMessage';

const actionList = ['Delete'];
const selectOption = 'checkbox';
const headColumns = [
  {
    id: 'task', first: true, last: false, label: 'Showing Tasks'
  },
];

const variantIcon = {
  success: 'md-checkmark-circle',
  warning: 'md-warning',
  error: 'md-alert',
  info: 'ios-information-circle',
  delete: 'md-trash',
  add: 'md-add-circle',
  schedule: 'md-time',
  refresh: 'md-refresh',
  arrowBack: 'md-arrow-back',
  play: 'md-play',
  filter: 'md-funnel',
  print: 'md-print',
  view: 'md-eye',
};

function NotificationBottom(type) {
  const not = get(type, 'type', null);
  const Icon = (not !== null && not !== 'success' && not !== 'error' && not !== 'warning')
    ? (variantIcon.info)
    : (variantIcon[not]);
  return (
    <Tooltip title={`This task has ${not} notifications`}>
      <IconButton aria-label="Notifications">
        <Ionicon icon={Icon} className={not} />
      </IconButton>
    </Tooltip>
  );
}
NotificationBottom.prototypes = {
  type: PropTypes.string.isRequired
};

const styles = theme => ({
  error: {
    color: 'red'
  },
  green: {
    color: 'green'
  },
  gray: {
    color: 'gray'
  },
  marginLeft: {
    marginLeft: theme.spacing.unit
  },
  marginLeft2u: {
    marginLeft: theme.spacing.unit * 2
  },
  tableWrapper: {
    overflowX: 'auto'
  }
});

/* ======= Principal Class ======= */
class TaskList extends React.Component {
  state = {
    loading: true,
    tasks: { data: [], pagination: {} },
    limit: 5,
    page: 0,
    selected: [],
    success: true,
    messageError: '',
    alertDialog: {
      open: false,
      message: '',
      id: -1
    },
    anchorEl: null,
  };

  componentDidMount() {
    this.callAPI();
  }

  getAPItasks = params => {
    API.get('/tasks', { params })
      .then(response => {
        this.setState({
          tasks: get(response, 'data', { data: [], pagination: {} }),
          limit: get(response, 'data.pagination.limit', 0)
        });
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

  callAPI = () => {
    const { limit, page } = this.state;
    const params = {
      offset: page * limit,
      limit
    };

    this.getAPItasks(params);
  };

  reRunTaskAPI = id => {
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
  };

  deleteAPItask = (id) => {
    const { enqueueSnackbar } = this.props;
    API.get(`/tasks/${id}/destroy`).then(() => {
      enqueueSnackbar('Task deleted successfully', { variant: 'success' });
      this.callAPI();
    }).catch((error) => {
      enqueueSnackbar(error, { variant: 'error' });
    }).finally(() => {
      this.setState({ alertDialog: false });
    });
  }

  handleDeleteBlock = (taskIds) => () => {
    taskIds.map(id => (
      this.deleteAPItask(id)
    ));
    this.setState({ selected: [] });
  }

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({
        selected: get(state, 'tasks.data', []).map(row => row.id)
      }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page }, this.callAPI);
  };

  handleChangeRowsPerPage = event => {
    this.setState({ limit: parseInt(event.target.value, 10) }, this.callAPI);
  };

  verifyNotifications = notifications => notifications.reduce((acc, item) => {
    if (acc !== 'error') {
      if (item.type === 'error') return 'error';
      if (item.type === 'warning') return 'warning';
      if (item.type === 'info' && acc !== 'warning') return 'info';
    }
    return acc;
  }, '');

  isSelected = id => get(this.state, 'selected', []).includes(id);

  handleAlertClick = id => () => {
    this.setState({
      alertDialog: {
        open: true,
        id,
        message: `Are you sure you want to "re-run" the ${id} task?`
      }
    });
  };

  handleDialogCancel = () => {
    this.setState({ alertDialog: false });
  };

  handleDialogConfirm = async () => {
    const { alertDialog } = this.state;
    const { id } = alertDialog;
    if (id !== '') {
      this.reRunTaskAPI(id);
    }

    this.handleDialogCancel();
    this.callAPI();
  };

  handleDetailsViewClick = (task) => () => {
    const { history } = this.props;
    history.push(`/app/tasks-list/${task.id}/task-details`, {
      task: { data: task }
    });
  };

  getStatus = (status) => {
    switch (status) {
      case 'failed': return messageStyles.bgError;
      case 'broken': return messageStyles.bgError;
      case 'pending': return messageStyles.bgWarning;
      case 'completed': return messageStyles.bgSuccess;
      default: return messageStyles.bgInfo;
      // running, pending, completed, failed, broken, unscheduled
    }
  };

  getProgress = (progress) => {
    if (progress >= 0 && progress < 20) {
      return progressStyles.bgError;
    }
    if (progress <= 45) {
      return progressStyles.bgWarning;
    }
    if (progress <= 90) {
      return progressStyles.bgInfo;
    }
    if (progress === 100) {
      return progressStyles.bgSuccess;
    }

    return progressStyles.bgDefault;
  };

  handleMoreClick = id => (event) => {
    this.setState({
      anchorEl: event.currentTarget, popover: id,
    });
  };

  handleMoreClose = () => {
    this.setState({
      anchorEl: null, popover: null,
    });
  };

  render() {
    const { classes } = this.props;
    const {
      loading,
      limit,
      page,
      selected,
      tasks,
      alertDialog,
      success,
      messageError,
      anchorEl,
    } = this.state;
    const { pagination, data } = tasks;

    const count = get(pagination, 'total', 0);

    return (
      <div>
        <Paper>
          <div className="item-padding">
            {loading ? <LoadingState loading={loading} /> : null}
            {loading ? null : !success ? (
              <GenericErrorMessage messageError={messageError} />
            ) : (
              <div>
                {
                  // ********* BODY *********
                }
                <GenericTableToolBar
                  numSelected={selected.length}
                  rowCount={count > limit ? limit : count}
                  actionList={actionList}
                  initialText="There are no selected tasks"
                  onDelete={this.handleDeleteBlock(selected)}
                />
                <Table aria-labelledby="tableTitle">
                  <GenericTableHead
                    numSelected={selected.length}
                    handleClick={this.handleSelectAllClick}
                    rowCount={count > limit ? limit : count}
                    selectOption={selectOption}
                    headColumns={headColumns}
                  />
                  <TableBody>
                    {data && data.map(row => {
                      const isSelected = this.isSelected(get(row, 'id', null));
                      const notifications = this.verifyNotifications(get(row, 'notifications', []));
                      const status = get(row, 'status', '');
                      const progress = get(row, 'progress', 0);
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isSelected}
                              onClick={event => this.handleClick(event, get(row, 'id', null))}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="display-flex justify-content-space-between align-items-center">
                              <Typography variant="subtitle2" color="primary">
                                <strong>
                                  {get(row, 'description', '')}
                                </strong>
                              </Typography>
                              <div className="display-flex justify-content-flex-end align-items-center">
                                <div className="item-margin-left">
                                  {
                                    notifications === 'error'
                                      || notifications === 'warning'
                                      || notifications === 'info'
                                      ? (<NotificationBottom type={notifications} />
                                      ) : (
                                        null
                                      )
                                  }
                                </div>
                                <div className="item-margin-left">
                                  {
                                    row.scheduler
                                      ? (
                                        <Tooltip title="This Task has a Schedule">
                                          <IconButton aria-label="Schedule">
                                            <Ionicon icon={variantIcon.schedule} />
                                          </IconButton>
                                        </Tooltip>
                                      ) : (
                                        null
                                      )
                                  }
                                </div>
                                <div className={classes.marginLeft2u}>
                                  <Tooltip title="Status" className="item-margin-left">
                                    <Chip label={`${status} ${progress}%`} className={classNames(classes.chip, this.getStatus(status))} />
                                  </Tooltip>
                                </div>
                                <div className={classes.marginLeft2u}>
                                  <Tooltip title="More...">
                                    <IconButton aria-label="More" className="item-margin-left" onClick={this.handleMoreClick(row.id)}>
                                      <Ionicon icon="ios-more" />
                                    </IconButton>
                                  </Tooltip>
                                  <Popover
                                    open={Boolean(get(this.state, 'popover') === row.id)}
                                    anchorEl={anchorEl}
                                    onClose={this.handleMoreClose}
                                    anchorOrigin={{
                                      vertical: 'bottom',
                                      horizontal: 'center'
                                    }}
                                    transformOrigin={{
                                      vertical: 'top',
                                      horizontal: 'center'
                                    }}
                                  >
                                    {
                                      status === 'failed'
                                        ? (
                                          <List component="nav">
                                            <ListItem button onClick={this.handleDetailsViewClick(row)}>
                                              <ListItemText primary="View Details" />
                                              <Ionicon icon={variantIcon.view} className={classes.rightIcon} />
                                            </ListItem>
                                            <Divider />
                                            <ListItem button onClick={this.handleAlertClick(get(row, 'id', null))}>
                                              <ListItemText primary="Run Task" />
                                              <Ionicon icon="md-play" className={classes.rightIcon} />
                                            </ListItem>
                                          </List>
                                        ) : (
                                          <List component="nav">
                                            <ListItem button onClick={this.handleDetailsViewClick(row)}>
                                              <ListItemText primary="View Details" />
                                              <Ionicon icon={variantIcon.view} className={classes.rightIcon} />
                                            </ListItem>
                                          </List>
                                        )
                                    }
                                  </Popover>
                                </div>
                              </div>
                            </div>
                            <div className="display-flex justify-content-space-between align-items-center">
                              <div className="display-flex justify-content-flex-start">
                                <div className={classes.marginLeft}>
                                  <Typography variant="caption" color="inherit">
                                    {get(row, 'id', null)}
                                  </Typography>
                                </div>
                                <div className={classes.marginLeft2u}>
                                  <Typography variant="caption">
                                    <strong>Updated at:</strong>
                                    {' '}
                                    {
                                      get(row, 'updated_at', null) != null
                                        ? (moment(row.updated_at).format('Y-MM-DD H:mm:ss')
                                        ) : (
                                          '--'
                                        )
                                    }
                                  </Typography>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        colSpan={5}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        count={count}
                        rowsPerPage={limit}
                        page={page}
                        SelectProps={{
                          native: true
                        }}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        ActionsComponent={GenericTablePagination}
                      />
                    </TableRow>
                  </TableFooter>
                </Table>
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

TaskList.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default withSnackbar(withStyles(styles, styles1, { withTheme: true })(TaskList));
