import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import Ionicon from 'react-ionicons';
import MUIDataTable from 'mui-datatables';
import {
  getTasks,
  updateFilters,
  changePage,
  changeRowsPerPage,
  changeSearchTerm
} from 'dan-actions/taskActions';
import { withStyles } from '@material-ui/styles';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AutoSuggestion from 'dan-components/AutoSuggestion';
import Loading from 'dan-components/Loading';
import { getTaskStatusOptions, delay }from 'dan-containers/Common/Utils';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Button from '@material-ui/core/Button';
import filterDlgSizeHelper from 'utils/mediaQueries';
import API from '../Utils/api';
import AlertDialog from '../Common/AlertDialog';
import { variantIcon } from '../Common/Utils';
import PageHeader from '../Common/PageHeader';

const NotificationBottom = type => {
  const not = get(type, 'type', null);
  const Icon = not !== null && not !== 'success' && not !== 'error' && not !== 'warning'
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
    statusFilter: undefined,
    tasks: { data: [], pagination: {} },
    limit: 10,
    page: 0,
    selected: [],
    success: true,
    columnSortDirection: ['none', 'none'],
    messageError: '',
    alertDialog: {
      open: false,
      message: '',
      id: -1
    },
    anchorEl: null,
    searchTerm: ''
  };

  componentDidMount() {
    this.makeQuery();
  }

  componentDidUpdate(prevProps) {
    const { params } = this.props;
    if (params && params !== prevProps.params) {
      this.makeQuery();
    }
  }

  makeQuery = () => {
    const {
      enqueueSnackbar,
      error,
      params
    } = this.props;
    this.getTasks(params.toJS());
    if (error) {
      enqueueSnackbar(error, {
        variant: 'error'
      });
    }
  };

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

  getMuiTheme = () => createMuiTheme({
    overrides: {
      MUIDataTableBodyCell: {
        root: {
          cursor: 'pointer',
        }
      },
      MUIDataTableToolbar: {
        filterPaper: {
          width: filterDlgSizeHelper,
          minWidth: '300px'
        }
      }
    }
  });

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
    const { onChangePage } = this.props;
    onChangePage(page);
  };

  handleChangeRowsPerPage = rowsPerPage => {
    const { onChangeRowsPerPage } = this.props;
    onChangeRowsPerPage(rowsPerPage);
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

  handleDialogConfirm = () => {
    const { alertDialog } = this.state;
    const { id } = alertDialog;
    if (id !== '') {
      this.reRunTaskAPI(id);
    }

    this.handleDialogCancel();
    this.makeQuery();
  };

  handleDetailsViewClick = task => {
    const { history } = this.props;
    history.push(`/tasks/${task.id}`, {
      task: { data: task }
    });
  };

  handleSearch = searchTerm => {
    const { params, onChangeSearchTerm } = this.props;
    if (searchTerm) {
      delay(() => onChangeSearchTerm(searchTerm));
    } else if (params.get('term')) {
      onChangeSearchTerm('');
    }
  };

  onHandleCloseSearch = () => {
    const { onChangeSearchTerm } = this.props;
    onChangeSearchTerm('');
  };

  handleFilterSubmit = () => {
    const { statusFilter } = this.state;
    const { onUpdateFilters } = this.props;
    const objectFilters = {};
    statusFilter ? objectFilters.statusFilter = [statusFilter] : null;
    onUpdateFilters(objectFilters);
  };

  handleResetFilters = () => {
    this.setState({ statusFilter: null });
  };

  handleStatusChange = (e, value) => {
    this.setState({ statusFilter: value });
  }

  render() {
    const { classes, history, filters, params, onUpdateFilters } = this.props;
    const {
      isLoading,
      columnSortDirection,
      tasks,
      alertDialog,
    } = this.state;
    const { pagination, data } = tasks;
    const { total: count } = pagination;
    const page = params.get('offset') / params.get('limit');

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
          sortDirection: columnSortDirection[0],
          filter: false
        }
      },
      {
        name: 'status',
        label: 'Status',
        options: {
          sortDirection: columnSortDirection[1],
          filter: true,
          filterType: 'custom',
          filterList: filters.getIn(['statusFilter']),
          customFilterListOptions: {
            render: v => v[0].name
          },
          filterOptions: {
            display: () => {
              const { statusFilter } = this.state;
              return (
                <AutoSuggestion
                  id="status"
                  label="Status"
                  className={classes.select}
                  options={getTaskStatusOptions()}
                  onChange={(e, value) => this.handleStatusChange(e, value)}
                  value={statusFilter}
                />
              );
            }
          },
          customBodyRender: value => <div>{value.toUpperCase()}</div>
        }
      },
      {
        name: 'created_at',
        label: 'Created',
        options: {
          filter: false,
          customBodyRender: value => (
            <Typography variant="caption">
              {value != null ? moment(value).format('Y-MM-DD H:mm:ss') : '--'}
            </Typography>
          )
        }
      }
    ];

    const options = {
      filterType: 'checkbox',
      filter: true,
      responsive: 'stacked',
      download: false,
      print: false,
      serverSide: true,
      selectableRows: 'none',
      searchText: params.get('term'),
      searchPlaceholder: 'Search by description or status',
      rowsPerPage: params.get('limit'),
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
      },
      customFilterDialogFooter: () => (
        <div style={{ padding: '16px' }}>
          <Button variant="contained" onClick={this.handleFilterSubmit}>Apply Filters</Button>
        </div>
      ),
      onFilterChipClose: (index) => {
        const fltrs = filters.toJS();
        switch (index) {
          case 5:
            fltrs.integrationFilter = null;
            break;
          case 2:
            fltrs.statusFilter = null;
            break;
          default:
            break;
        }
        onUpdateFilters(fltrs);
      }
    };

    return (
      <div>
        <PageHeader title="Tasks" history={history} />
        <div className={classes.table}>
          {isLoading ? <Loading /> : null}
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable data={data} columns={columns} options={options} />
          </MuiThemeProvider>
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
  filters: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  onChangeSearchTerm: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired,
  onUpdateFilters: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

const mapStateToProps = state => ({
  params: state.getIn(['task', 'params']),
  filters: state.getIn(['task', 'filters']),
});

const mapDispatchToProps = dispatch => ({
  onGetTasks: params => dispatch(getTasks(params)),
  onUpdateFilters: bindActionCreators(updateFilters, dispatch),
  onChangePage: bindActionCreators(changePage, dispatch),
  onChangeRowsPerPage: bindActionCreators(changeRowsPerPage, dispatch),
  onChangeSearchTerm: bindActionCreators(changeSearchTerm, dispatch),
});

const TaskListMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskList);


export default withSnackbar(withStyles(styles, { withTheme: true })(TaskListMapped));
