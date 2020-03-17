import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import Ionicon from 'react-ionicons';
import MUIDataTable from 'mui-datatables';

import { withStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import Loading from 'dan-components/Loading';
import API from '../Utils/api';
import AlertDialog from '../Common/AlertDialog';
import Utils from '../Common/Utils';
import Status from './Status';
import PageHeader from '../Common/PageHeader';

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
    marginLeft: theme.spacing(2)
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
    anchorEl: null,
    serverSideFilterList: [],
    searchTerm: ''
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
        this.setState({ success: false, messageError: error.message });
      })
      .finally(() => {
        this.setState({ isLoading: false });
      });
  };

  callAPI = () => {
    const { searchTerm, limit, page, serverSideFilterList } = this.state;

    const params = {
      offset: page * limit,
      limit,
      term: searchTerm || '',
      with_details: true,
      status: serverSideFilterList[3] ? serverSideFilterList[3][0] : ''
    };

    this.setState({ isLoading: true });
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
    history.push(`/app/tasks/${task.id}`, {
      task: { data: task }
    });
  };

  handleSearch = searchTerm => {
    if (searchTerm) {
      const timer = setTimeout(() => {
        this.setState({ searchTerm }, this.callAPI);
        clearTimeout(timer);
      }, 800);
      window.addEventListener('keydown', () => {
        clearTimeout(timer);
      });
    } else {
      const { searchTerm: _searchTerm } = this.state;
      if (_searchTerm) {
        this.setState({ searchTerm: '' }, this.callAPI);
      }
    }
  };

  onHandleCloseSearch = () => {
    this.setState({ searchTerm: '' }, this.callAPI);
  };

  handleFilterChange = filterList => {
    if (filterList) {
      this.setState({ serverSideFilterList: filterList }, this.callAPI);
    } else {
      this.setState({ serverSideFilterList: [] }, this.callAPI);
    }
  };

  handleResetFilters = () => {
    const { serverSideFilterList } = this.state;
    if (serverSideFilterList.length > 0) {
      this.setState({ serverSideFilterList: [] }, this.callAPI);
    }
  };

  render() {
    const { classes, history } = this.props;
    const {
      isLoading,
      page,
      tasks,
      alertDialog,
      serverSideFilterList
    } = this.state;
    const { pagination, data } = tasks;
    const count = get(pagination, 'total', 0);

    const columns = [
      {
        name: 'id',
        options: {
          filter: false,
          display: 'exclude'
        }
      },
      {
        name: 'description',
        label: 'Description',
        options: {
          filter: false
        }
      },
      {
        name: 'updated_at',
        label: 'Date',
        options: {
          filter: false,
          customBodyRender: value => (
            <Typography variant="caption">
              {value != null ? moment(value).format('Y-MM-DD H:mm:ss') : '--'}
            </Typography>
          )
        }
      },
      {
        name: 'status',
        label: ' ',
        options: {
          // display: false,
          // filterType: 'dropdown',
          filterList: serverSideFilterList[3],
          // filterOptions: {
          //   names: integrationFilterOptions
          // },
          customBodyRender: (value, tableMeta) => {
            const status = tableMeta.rowData[3];
            const progress = tableMeta.rowData[4];
            const notificationsArray = tableMeta.rowData[5];
            const scheduler = tableMeta.rowData[6];

            const notifications =
              Array.isArray(notificationsArray) && notificationsArray.length > 0
                ? this.verifyNotifications(notificationsArray)
                : null;

            return (
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
            );
          }
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
          case 'search':
            this.handleSearch(tableState.searchText);
            break;
          case 'filterChange':
            this.handleFilterChange(tableState.filterList);
            break;
          case 'resetFilters':
            this.handleResetFilters();
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
        <PageHeader title="Tasks" history={history} />
        <div className={classes.table}>
          {isLoading ? <Loading /> : null}
          <MUIDataTable data={data} columns={columns} options={options} />
        </div>

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
