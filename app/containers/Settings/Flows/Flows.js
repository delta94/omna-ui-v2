import React, { Component } from 'react';
import PropTypes from 'prop-types';

// material-ui
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider
} from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import Tooltip from '@material-ui/core/Tooltip';
import Ionicon from 'react-ionicons';
import IconButton from '@material-ui/core/IconButton';

// import Table from '@material-ui/core/Table';
// import TableBody from '@material-ui/core/TableBody';
// import TableCell from '@material-ui/core/TableCell';
// import TableRow from '@material-ui/core/TableRow';
// import TableFooter from '@material-ui/core/TableFooter';
// import TablePagination from '@material-ui/core/TablePagination';
// import Paper from '@material-ui/core/Paper';
//
import get from 'lodash/get';
import moment from 'moment';
//
import MUIDataTable from 'mui-datatables';
import Loading from 'dan-components/Loading';
import API from '../../Utils/api';
import AlertDialog from '../../Common/AlertDialog';
// import GenericTableToolBar from '../../Common/GenericTableToolBar';
// import GenericTablePagination from '../../Common/GenericTablePagination';
// import LoadingState from '../../Common/LoadingState';
// import GenericTableHead from '../../Common/GenericTableHead';
// import GenericErrorMessage from '../../Common/GenericErrorMessage';
// import { getFlows } from '../../../actions/flowActions';

const styles = theme => ({
  inputWidth: {
    width: '300px'
  },
  marginTop: {
    marginTop: theme.spacing.unit
  },
  marginLeft: {
    marginLeft: theme.spacing.unit
  },
  padding: {
    padding: theme.spacing.unit
  },
  paper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    padding: '5px'
  },
  actions: {
    padding: theme.spacing.unit * 1
  },
  tableRoot: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  icon: {
    color: '#9e9e9e'
  }
});

class Flows extends Component {
  state = {
    flows: { data: [], pagination: {} },
    messageError: '',
    alertDialog: {
      open: false,
      objectId: '',
      objectName: '',
      message: ''
    },
    success: true,
    isLoading: true,
    integrationFilterOptions: [],
    limit: 10,
    page: 0,
    serverSideFilterList: [],
    searchTerm: ''
  };

  componentDidMount() {
    this.getIntegrations();
    this.callAPI();
  }

  getMuiTheme = () =>
    createMuiTheme({
      overrides: {
        MUIDataTableToolbar: {
          filterPaper: {
            width: '50%'
          }
        }
      }
    });

    getIntegrations() {
    API.get('/integrations', { params: { limit: 100, offset: 0 } })
      .then(response => {
        const { data } = response.data;
        const integrations = data.map(item => item.id);
        this.setState({ integrationFilterOptions: integrations });
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
  }
  
  getIntegrations() {
    API.get('/integrations', { params: { limit: 100, offset: 0 } })
      .then(response => {
        const { data } = response.data;
        const integrations = data.map(item => item.id);
        this.setState({ integrationFilterOptions: integrations });
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
  }

  getFlows = async params => {
    // this.props.onGetFlows(params);
    const { enqueueSnackbar } = this.props;
    try {
      const response = await API.get('/flows', { params });
      this.setState({
        flows: get(response, 'data', { data: [], pagination: {} }),
        limit: get(response, 'data.pagination.limit', 0)
      });
    } catch (error) {
      this.setState({ success: false, messageError: error.message });
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }

    this.setState({ isLoading: false });
  };

  handleDeleteFlow = async () => {
    const { enqueueSnackbar } = this.props;
    const { alertDialog } = this.state;

    try {
      this.setState({ isLoading: true });
      await API.delete(`flows/${alertDialog.objectId}`);
      enqueueSnackbar('Workflow deleted successfully', {
        variant: 'success'
      });
      await this.getFlows();
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }

    this.setState({ isLoading: false });
  };

  handleOnClickDeleteFlow = (id, title, integration) => {
    this.setState({
      alertDialog: {
        open: true,
        objectId: id,
        message: `Are you sure you want to remove "${title}: ${integration}" workflow?`
      }
    });
  };

  handleDialogConfirm = () => {
    this.handleDeleteFlow();
    this.setState({ alertDialog: { open: false } });
  };

  handleDialogCancel = () => {
    this.setState({ alertDialog: { open: false } });
  };

  handleAddAction = () => {
    const { history } = this.props;
    history.push('/app/settings/workflows/add-workflow');
  };

  handleStartFlow = async id => {
    const { enqueueSnackbar } = this.props;
    try {
      await API.get(`flows/${id}/start`);
      enqueueSnackbar('Workflow started successfully', {
        variant: 'success'
      });
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
  };

  handleEditFlow = id => {
    const { history } = this.props;
    history.push(`/app/settings/workflows/edit-workflow/${id}`);
  };

  handleToggleScheduler = async id => {
    const { enqueueSnackbar } = this.props;
    try {
      this.setState({ isLoading: true });
      await API.get(`flows/${id}/toggle/scheduler/status`);
      this.getFlows();
      enqueueSnackbar('Scheduler toggled successfully', {
        variant: 'success'
      });
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }

    this.setState({ isLoading: false });
  };

  callAPI = () => {
    const {
      searchTerm,
      limit,
      page,
      serverSideFilterList
    } = this.state;
    
    const params = {
      offset: page * limit,
      limit,
      term: searchTerm || '',
      integration_id: serverSideFilterList[2] ? serverSideFilterList[2][0] : ''
    };

    this.setState({ isLoading: true });
    this.getFlows(params);
  };

  handleChangePage = (page, searchTerm) => {
    this.setState({ page, searchTerm }, this.callAPI);
  };

  handleChangeRowsPerPage = rowsPerPage => {
    this.setState({ limit: rowsPerPage }, this.callAPI);
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
      this.setState({ searchTerm: '' }, this.callAPI);
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
    const { classes } = this.props;
    const {
      flows,
      integrationFilterOptions,
      isLoading,
      messageError,
      alertDialog,
      limit,
      page,
      searchTerm,
      serverSideFilterList,
      success
    } = this.state;
    const { pagination, data } = flows;
    const count = get(pagination, 'total', 0);

    const columns = [
      {
        name: 'id',
        options: {
          filter: false,
          display: 'excluded',
        }
      },
      {
        name: 'title',
        label: 'Title',
        options: {
          filter: false,
        }
      },
      {
        name: 'integration',
        label: 'Integration',
        options: {
          sort: true,
          filterType: 'dropdown',
          filterList: serverSideFilterList[2],
          filterOptions: {
            names: integrationFilterOptions
          },
          customBodyRender: value => <div>{value.name}</div>
        }
      },
      {
        name: 'task',
        options: {
          display: 'excluded',
          filter: false
        }
      },
      {
        name: 'created_at',
        label: 'Created at',
        options: {
          filter: false,
          customBodyRender: value => (
            <div>{moment(value).format('Y-MM-DD')}</div>
          )
        }
      },
      {
        name: 'updated_at',
        label: 'Updated at',
        options: {
          filter: false,
          customBodyRender: value => (
            <div>{moment(value).format('Y-MM-DD')}</div>
          )
        }
      },
      {
        name: 'Actions',
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta) => {
            const [
              id,
              title,
              integration,
              task = { scheduler: '' },
              created_at,
              updated_at
            ] = tableMeta.rowData ? tableMeta.rowData : [];

            return (
              <div>
                <Tooltip title="edit">
                  <IconButton
                    aria-label="edit"
                    onClick={() => this.handleEditFlow(id)}
                  >
                    <Ionicon icon="md-create" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="start">
                  <IconButton
                    aria-label="start"
                    onClick={() => this.handleStartFlow(id)}
                  >
                    <Ionicon icon="md-play" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="delete">
                  <IconButton
                    aria-label="delete"
                    onClick={() => this.handleOnClickDeleteFlow(id, title)}
                  >
                    <Ionicon icon="md-trash" />
                  </IconButton>
                </Tooltip>
                <Tooltip
                  title={
                    task.scheduler && task.scheduler.active
                      ? 'disable scheduler'
                      : 'enable scheduler'
                  }
                >
                  <IconButton
                    aria-label="start"
                    onClick={() => this.handleToggleScheduler(id)}
                  >
                    {task.scheduler && task.scheduler.active ? (
                      <Ionicon icon="ios-close-circle" />
                    ) : (
                      <Ionicon icon="ios-timer" />
                    )}
                  </IconButton>
                </Tooltip>
              </div>
            );
          }
        }
      }
    ];

    const options = {
      filter: true,
      selectableRows: 'none',
      responsive: 'stacked',
      download: false,
      print: false,
      serverSide: true,
      searchText: searchTerm,
      serverSideFilterList,
      searchPlaceholder: 'Search by address & topic',
      rowsPerPage: limit,
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
        const order = data[dataIndex];
        this.handleDetailsViewClick(order);
      },
      customSort: (customSortData, colIndex, order) => {
        return customSortData.sort((a, b) => {
          switch (colIndex) {
            case 3:
              return (
                (parseFloat(a.customSortData[colIndex]) <
                parseFloat(b.customSortData[colIndex])
                  ? -1
                  : 1) * (order === 'desc' ? 1 : -1)
              );
            case 4:
              return (
                (a.customSortData[colIndex].name.toLowerCase() <
                b.customSortData[colIndex].name.toLowerCase()
                  ? -1
                  : 1) * (order === 'desc' ? 1 : -1)
              );
            default:
              return (
                (a.customSortData[colIndex] < b.customSortData[colIndex]
                  ? -1
                  : 1) * (order === 'desc' ? 1 : -1)
              );
          }
        });
      }
    };

    return (
      <div>
        <div className={classes.table}>
          {isLoading ? <Loading /> : null}
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable columns={columns} data={data} options={options} />
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

Flows.propTypes = {
  // flows: PropTypes.object.isRequired,
  // onGetFlows: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

// const mapStateToProps = state => ({ flows: state.flows.flows });

// const mapDispatchToProps = dispatch => ({
//   onGetFlows: params => dispatch(getFlows(params))
// });

// export default withSnackbar(
//   connect(
//     mapStateToProps,
//     mapDispatchToProps
//   )(Flows)
// );
export default withSnackbar(withStyles(styles)(Flows));
