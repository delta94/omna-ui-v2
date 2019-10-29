import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import Ionicon from 'react-ionicons';
import MUIDataTable from 'mui-datatables';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import LoadingState from '../Common/LoadingState';
import API from '../Utils/api';
import AlertDialog from '../Common/AlertDialog';
import Utils from '../Common/Utils';
import Status from './Status';

const variantIcon = Utils.iconVariants();

const NotificationBottom = type => {
  const not = get(type, 'type', null);
  const Icon =
    not !== null && not !== 'success' && not !== 'error' && not !== 'warning'
      ? variantIcon.info
      : variantIcon[not];
  return (
    <Tooltip title={`This task has ${not} notifications`}>
      <IconButton aria-label="Notifications">
        <Ionicon icon={Icon} className={not} />
      </IconButton>
    </Tooltip>
  );
};
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
  }
});

class TaskList extends React.Component {
  state = {
    isLoading: true,
    tasks: { data: [], pagination: {} },
    limit: 10,
    page: 0,
    selected: [],
    success: true,
    messageError: '',
    alertDialog: {
      open: false,
      message: '',
      id: -1
    },
    anchorEl: null
  };

  componentDidMount() {
    this.callAPI();
  }

  getTasks = params => {
    this.setState({ isLoading: true });
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
        this.setState({ isLoading: false });
      });
  };

  callAPI = () => {
    const { limit, page } = this.state;
    const params = {
      offset: page * limit,
      limit,
      with_details: true
    };

    this.getTasks(params);
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

  deleteTask = id => {
    const { enqueueSnackbar } = this.props;
    API.get(`/tasks/${id}/destroy`)
      .then(() => {
        enqueueSnackbar('Task deleted successfully', { variant: 'success' });
        this.callAPI();
      })
      .catch(error => {
        enqueueSnackbar(error, { variant: 'error' });
      })
      .finally(() => {
        this.setState({ alertDialog: false });
      });
  };

  handleDeleteBlock = taskIds => () => {
    taskIds.map(id => this.deleteTask(id));
    this.setState({ selected: [] });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({
        selected: get(state, 'tasks.data', []).map(row => row.id)
      }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleChangePage = page => {
    this.setState({ page }, this.callAPI);
  };

  handleChangeRowsPerPage = rowsPerPage => {
    this.setState({ limit: rowsPerPage }, this.callAPI);
  };

  verifyNotifications = notifications =>
    notifications.reduce((acc, item) => {
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

  handleDialogConfirm = () => {
    const { alertDialog } = this.state;
    const { id } = alertDialog;
    if (id !== '') {
      this.reRunTaskAPI(id);
    }

    this.handleDialogCancel();
    this.callAPI();
  };

  handleDetailsViewClick = task => {
    const { history } = this.props;
    history.push(`/app/tasks-list/${task.id}/task-details`, {
      task: { data: task }
    });
  };

  handleSearchClick = (currentTerm, filters) => {
    const { limit, page } = this.state;
    const params = {
      offset: page * limit,
      limit,
      term: currentTerm,
      status: filters.Status
    };

    this.setState({ isLoading: true });
    this.getTasks(params);
  };

  render() {
    const { classes } = this.props;
    const { isLoading, page, tasks, alertDialog } = this.state;
    const { pagination, data } = tasks;

    const count = get(pagination, 'total', 0);

    const columns = [
      {
        name: 'id',
        options: {
          filter: false,
          display: false
        }
      },
      {
        name: 'description',
        label: 'Description',
        options: {
          filter: false,
          customBodyRender: (value, tableMeta) => {
            const [
              id,
              description,
              updatedAt,
              status,
              progress,
              notificationsArray,
              scheduler
            ] = tableMeta.rowData;

            const notifications =
              Array.isArray(notificationsArray) && notificationsArray.length > 0
                ? this.verifyNotifications(notificationsArray)
                : null;

            return (
              <div className="display-flex justify-content-space-between align-items-center">
                <div
                  className="display-flex justify-content-flex-start"
                  style={{ flexDirection: 'column' }}
                >
                  <Typography variant="subtitle2" color="primary">
                    <strong>{description}</strong>
                  </Typography>
                  <div className="display-flex justify-content-flex-start">
                    <Typography variant="caption" color="inherit">
                      {id}
                    </Typography>
                    <Typography variant="caption">
                      <strong>Updated at:</strong>{' '}
                      {updatedAt != null
                        ? moment(updatedAt).format('Y-MM-DD H:mm:ss')
                        : '--'}
                    </Typography>
                  </div>
                </div>
                <div
                  className="display-flex justify-content-flex-end align-items-end"
                  style={{ flexDirection: 'column' }}
                >
                  <div className="item-margin-left">
                    {notifications === 'error' ||
                    notifications === 'warning' ||
                    notifications === 'info' ? (
                      <NotificationBottom type={notifications} />
                    ) : null}
                    {scheduler ? (
                      <Tooltip title="This task has a schedule">
                        <IconButton aria-label="Schedule">
                          <Ionicon icon={variantIcon.schedule} />
                        </IconButton>
                      </Tooltip>
                    ) : null}
                  </div>
                  <div className={classes.marginLeft2u}>
                    <Status
                      status={status}
                      progress={progress}
                      classes={classes}
                    />
                  </div>
                </div>
              </div>
            );
          }
        }
      },
      {
        name: 'updated_at',
        label: 'Updated at',
        options: {
          filter: false,
          display: false
        }
      },
      {
        name: 'status',
        label: 'Status',
        options: {
          display: false
        }
      },
      {
        name: 'progress',
        options: {
          filter: false,
          display: false
        }
      },
      {
        name: 'notifications',
        options: {
          filter: false,
          display: false
        }
      },
      {
        name: 'scheduler',
        options: {
          filter: false,
          display: false
        }
      }
    ];

    const options = {
      filterType: 'checkbox',
      responsive: 'stacked',
      viewColumns: false,
      download: false,
      print: false,
      serverSide: true,
      selectableRows: 'none',
      count,
      page,
      onTableChange: (action, tableState) => {
        switch (action) {
          case 'changePage':
            this.handleChangePage(tableState.page);
            break;
          case 'changeRowsPerPage':
            this.handleChangeRowsPerPage(tableState.rowsPerPage);
            break;
          default:
            break;
        }
      },
      onRowClick: (rowData, { dataIndex }) => {
        const task = data[dataIndex];
        this.handleDetailsViewClick(task);
      }
    };

    return (
      <div>
        {isLoading ? (
          <Paper>
            <div className="item-padding">
              <LoadingState loading={isLoading} text="Loading" />
            </div>
          </Paper>
        ) : (
          <MUIDataTable data={data} columns={columns} options={options} />
        )}
        <AlertDialog
          open={alertDialog.open}
          message={alertDialog.message}
          handleCancel={this.handleDialogCancel}
          handleConfirm={this.handleDialogConfirm}
        />
      </div>
    );
  }
}

TaskList.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

export default withSnackbar(withStyles(styles, { withTheme: true })(TaskList));
