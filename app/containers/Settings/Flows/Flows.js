import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import Ionicon from 'react-ionicons';
import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip
} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import get from 'lodash/get';
import moment from 'moment';
import MUIDataTable from 'mui-datatables';
import Loading from 'dan-components/Loading';
import { getFlows } from 'dan-actions/flowActions';
import { getIntegrations } from 'dan-actions/integrationActions';
import API from '../../Utils/api';
import AlertDialog from '../../Common/AlertDialog';
import PageHeader from '../../Common/PageHeader';
import styles from './flows-jss';

class Flows extends Component {
  state = {
    alertDialog: {
      open: false,
      objectId: '',
      objectName: '',
      message: ''
    },
    isLoading: false,
    integrationFilterOptions: [],
    limit: 10,
    page: 0,
    serverSideFilterList: [],
    searchTerm: '',
    anchorEl: null
  };

  componentDidMount() {
    const { onGetIntegrations } = this.props;
    onGetIntegrations({ limit: 100, offset: 0 });
    this.callAPI();
  }

  handleDeleteFlow = async () => {
    const { enqueueSnackbar } = this.props;
    const { alertDialog } = this.state;

    try {
      this.setState({ isLoading: true });
      await API.delete(`flows/${alertDialog.objectId}`);
      enqueueSnackbar('Workflow deleted successfully', {
        variant: 'success'
      });
      // await this.getFlows();
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
    history.push('/app/workflows/add-workflow');
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
    history.push(`/app/workflows/${id}`);
  };

  handleToggleScheduler = async id => {
    const { enqueueSnackbar, onGetFlows } = this.props;
    try {
      this.setState({ isLoading: true });
      await API.get(`flows/${id}/toggle/scheduler/status`);
      onGetFlows();
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
    const { onGetFlows } = this.props;
    const { searchTerm, limit, page, serverSideFilterList } = this.state;
    const params = {
      offset: page * limit,
      limit,
      term: searchTerm || '',
      integration_id: serverSideFilterList[2] ? serverSideFilterList[2][0] : ''
    };

    onGetFlows(params);
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

  handleMenu = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  render() {
    const { classes, flows, history, loading } = this.props;
    const {
      integrationFilterOptions,
      alertDialog,
      limit,
      isLoading,
      page,
      searchTerm,
      serverSideFilterList,
      anchorEl
    } = this.state;
    const pagination = flows.get('pagination');
    const data = flows.get('data').toJS();
    const count = get(pagination, 'total', 0);
    
    const columns = [
      {
        name: 'id',
        options: {
          filter: false,
          display: 'excluded'
        }
      },
      {
        name: 'title',
        label: 'Title',
        options: {
          filter: false
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
            const [id, title, task = { scheduler: '' }] = tableMeta.rowData
              ? tableMeta.rowData
              : [];

            return (
              <div>
                <IconButton onClick={this.handleMenu}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={() => this.handleStartFlow(id)}>
                    <ListItemIcon>
                      <Ionicon icon="md-play" />
                    </ListItemIcon>
                    Start
                  </MenuItem>
                  <MenuItem
                    onClick={() => this.handleOnClickDeleteFlow(id, title)}
                  >
                    <ListItemIcon>
                      <Ionicon icon="md-trash" />
                    </ListItemIcon>
                    Delete
                  </MenuItem>
                  <MenuItem onClick={() => this.handleToggleScheduler(id)}>
                    <ListItemIcon>
                      {task.scheduler && task.scheduler.active ? (
                        <Ionicon icon="ios-close-circle" />
                      ) : (
                        <Ionicon icon="ios-timer" />
                      )}
                    </ListItemIcon>
                    {task.scheduler && task.scheduler.active
                      ? 'Disable scheduler'
                      : 'Enable scheduler'}
                  </MenuItem>
                </Menu>
                {/* <Tooltip title="edit">
                  <IconButton
                    aria-label="edit"
                    onClick={() => this.handleEditFlow(id)}
                  >
                    <Ionicon icon="md-create" />
                  </IconButton>
                </Tooltip> */}
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
      searchPlaceholder: 'Search by type',
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
      customSort: (customSortData, colIndex, order) =>
        customSortData.sort((a, b) => {
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
        }),
      customToolbar: () => (
        <Tooltip title="add">
          <IconButton aria-label="add" onClick={this.handleAddAction}>
            <Ionicon icon="md-add-circle" />
          </IconButton>
        </Tooltip>
      ),
      onCellClick: (rowData, { colIndex, dataIndex }) => {
        if (colIndex !== 6) {
          const flow = data[dataIndex];
          this.handleEditFlow(flow.id);
        }
      }
    };

    return (
      <div>
        <PageHeader title="Workflows" history={history} />
        <div className={classes.table}>
          {loading || isLoading ? (
            <Loading />
          ) : (
            <MUIDataTable columns={columns} data={data} options={options} />
          )}
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
  flows: PropTypes.object.isRequired,
  onGetFlows: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  // integrations: PropTypes.object.isRequired,
  onGetIntegrations: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  loading: state.getIn(['flow', 'loading']),
  flows: state.getIn(['flow', 'flows']),
  integrations: state.getIn(['integration', 'integrations'])
});

const mapDispatchToProps = dispatch => ({
  onGetFlows: params => dispatch(getFlows(params)),
  onGetIntegrations: params => dispatch(getIntegrations(params))
});

const FlowsMapped = withSnackbar(withStyles(styles)(Flows));

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlowsMapped);
