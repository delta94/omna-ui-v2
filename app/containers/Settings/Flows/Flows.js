import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import Ionicon from 'react-ionicons';
import Button from '@material-ui/core/Button';
import { delay } from 'dan-containers/Common/Utils';
import DataTable from 'dan-components/Tables/DataTable';
import {
  getFlows,
  updateFilters,
  changePage,
  changeRowsPerPage,
  changeSearchTerm
} from 'dan-actions/flowActions';
import { addTaskNotification } from 'dan-actions/NotificationActions';
import {
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip
} from '@material-ui/core';
import FiltersDlg from 'dan-components/Products/FiltersDlg';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import get from 'lodash/get';
import moment from 'moment';
import { Loading } from 'dan-components';
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
    integrationFilter: undefined,
    columnSortDirection: ['none'],
    limit: 10,
    page: 0,
    serverSideFilterList: [],
    searchTerm: '',
    anchorEl: null,
    selectedItem: { id: 0, task: '', title: '' }
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
      onGetFlows,
      params
    } = this.props;

    onGetFlows(params.toJS());

    if (error) {
      enqueueSnackbar(error, {
        variant: 'error'
      });
    }
  };

  handleDeleteFlow = async () => {
    const { enqueueSnackbar } = this.props;
    const { alertDialog } = this.state;
    this.handleClose();

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
    history.push('/workflows/add-workflow');
  };

  handleStartFlow = async id => {
    const { enqueueSnackbar, onAddTaskNotification } = this.props;
    this.handleClose();

    try {
      const response = await API.get(`flows/${id}/start`);
      enqueueSnackbar('Workflow started successfully', {
        variant: 'info',
      });
      onAddTaskNotification(response.data.data.id);
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
  };

  handleEditFlow = id => {
    const { history } = this.props;
    history.push(`/workflows/${id}`);
  };

  handleToggleScheduler = async id => {
    const { enqueueSnackbar } = this.props;
    this.handleClose();

    try {
      this.setState({ isLoading: true });
      await API.post(`flows/${id}/toggle/scheduler/status`);
      // onGetFlows();
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

  handleChangePage = (page) => {
    const { onChangePage } = this.props;
    onChangePage(page);
  };

  handleChangeRowsPerPage = rowsPerPage => {
    const { onChangeRowsPerPage } = this.props;
    onChangeRowsPerPage(rowsPerPage);
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

  // handleResetFilters = () => {
  //   const { serverSideFilterList } = this.state;
  //   if (serverSideFilterList.length > 0) {
  //     this.setState({ serverSideFilterList: [] }, this.callAPI);
  //   }
  // };

  handleMenu = (event, id, task, title) => {
    this.setState({
      anchorEl: event.currentTarget,
      selectedItem: { id, task, title }
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

  handleIntegrationFilterChange = (integation) => {
    this.setState({ integrationFilter: integation });
  };

  handleResetFilters = () => {
    this.setState({ integrationFilter: null });
  };

  handleFilterSubmit = () => {
    const { integrationFilter } = this.state;
    const { onUpdateFilters } = this.props;
    const objectFilters = {};
    integrationFilter ? objectFilters.integrationFilter = [integrationFilter] : null;
    onUpdateFilters(objectFilters);
  };

  handleClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  renderActionsMenu = () => {
    const { fromShopifyApp } = this.props;
    const { anchorEl, selectedItem } = this.state;
    const { id, task, title } = selectedItem;

    return (
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={this.handleClose}
      >
        <MenuItem onClick={() => this.handleStartFlow(id)}>
          <ListItemIcon>
            <Ionicon icon="md-play" />
          </ListItemIcon>
          Start
        </MenuItem>
        {!fromShopifyApp && (
          <MenuItem onClick={() => this.handleOnClickDeleteFlow(id, title)}>
            <ListItemIcon>
              <Ionicon icon="md-trash" />
            </ListItemIcon>
            Delete
          </MenuItem>
        )}
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
    );
  };

  render() {
    const { classes, flows, history, loading, filters, params, onUpdateFilters, fromShopifyApp } = this.props;
    const {
      alertDialog,
      isLoading,
      columnSortDirection,
    } = this.state;
    const { data, pagination } = flows.toJS();
    const { total: count } = pagination;
    const page = params.get('offset') / params.get('limit');

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
          filter: true,
          sortDirection: columnSortDirection[0],
          sort: true,
          filterType: 'custom',
          filterList: filters.getIn(['integrationFilter']),
          // filterOptions: {
          //   names: integrationFilterOptions
          // },
          customFilterListOptions: {
            render: v => v[0].name
          },
          filterOptions: {
            display: () => {
              const { integrationFilter } = this.state;
              return (
                <FiltersDlg
                  integration={integrationFilter}
                  onIntegrationChange={this.handleIntegrationFilterChange}
                />
              );
            }
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
          customBodyRender: (value, tableMeta) => {
            const id = tableMeta.rowData[0];
            const title = tableMeta.rowData[1];
            const task = tableMeta.rowData[3];

            return (
              <div>
                <IconButton onClick={e => this.handleMenu(e, id, task, title)}>
                  <MoreVertIcon />
                </IconButton>
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
      searchText: params.get('term'),
      searchPlaceholder: 'Search by type',
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
          // case 'filterChange':
          //   this.handleFilterChange(tableState.filterList);
          //   break;
          case 'resetFilters':
            this.handleResetFilters();
            break;
          default:
            break;
        }
      },
      customSort: (customSortData, colIndex, order) => customSortData.sort((a, b) => {
        switch (colIndex) {
          case 3:
            return (
              (parseFloat(a.customSortData[colIndex])
                  < parseFloat(b.customSortData[colIndex])
                ? -1
                : 1) * (order === 'desc' ? 1 : -1)
            );
          case 4:
            return (
              (a.customSortData[colIndex].name.toLowerCase()
                  < b.customSortData[colIndex].name.toLowerCase()
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
      customToolbar: () => !fromShopifyApp && (
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
      },
      customFilterDialogFooter: () => (
        <div style={{ padding: '16px' }}>
          <Button variant="contained" onClick={this.handleFilterSubmit}>Apply Filters</Button>
        </div>
      ),
      onFilterChipClose: (index) => {
        const fltrs = filters.toJS();
        switch (index) {
          case 2:
            fltrs.integrationFilter = null;
            break;
          default:
            break;
        }
        onUpdateFilters(fltrs);
      }
    };

    return (
      <div>
        <PageHeader title="Workflows" history={history} />
        {isLoading || loading && <Loading />}
        <div className={classes.table}>
          <DataTable columns={columns} data={data} options={options} />
          {this.renderActionsMenu()}
          <AlertDialog
            open={alertDialog.open}
            message={alertDialog.message}
            handleCancel={this.handleDialogCancel}
            handleConfirm={this.handleDialogConfirm}
          />
        </div>
      </div>
    );
  }
}

Flows.propTypes = {
  flows: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  onGetFlows: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  // integrations: PropTypes.object.isRequired,
  // onGetIntegrations: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  fromShopifyApp: PropTypes.bool.isRequired,
  onAddTaskNotification: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  onUpdateFilters: PropTypes.func.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  onChangeSearchTerm: PropTypes.func.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  loading: state.getIn(['flow', 'loading']),
  flows: state.getIn(['flow', 'flows']),
  params: state.getIn(['flow', 'params']),
  filters: state.getIn(['flow', 'filters']),
  integrations: state.getIn(['integration', 'integrations']),
  fromShopifyApp: state.getIn(['user', 'fromShopifyApp']),
  error: state.getIn(['flow', 'error'])
});

const mapDispatchToProps = dispatch => ({
  onGetFlows: params => dispatch(getFlows(params)),
  onAddTaskNotification: bindActionCreators(addTaskNotification, dispatch),
  onGetIntegrations: params => dispatch(getIntegrations(params)),
  onUpdateFilters: bindActionCreators(updateFilters, dispatch),
  onChangePage: bindActionCreators(changePage, dispatch),
  onChangeRowsPerPage: bindActionCreators(changeRowsPerPage, dispatch),
  onChangeSearchTerm: bindActionCreators(changeSearchTerm, dispatch)
});

const FlowsMapped = withSnackbar(withStyles(styles)(Flows));

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlowsMapped);
