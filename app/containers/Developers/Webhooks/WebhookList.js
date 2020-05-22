import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import MUIDataTable from 'mui-datatables';
import { withSnackbar } from 'notistack';
import Tooltip from '@material-ui/core/Tooltip';
import { Button } from '@material-ui/core';
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider
} from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
//
import Loading from 'dan-components/Loading';
import moment from 'moment';
import get from 'lodash/get';
//
import AlertDialog from '../../Common/AlertDialog';
import API from '../../Utils/api';
import PageHeader from '../../Common/PageHeader';

const styles = theme => ({
  table: {
    '& > div': {
      overflow: 'auto'
    },
    '& table': {
      minWidth: 500,
      [theme.breakpoints.down('md')]: {
        '& td': {
          height: 40
        }
      }
    }
  }
});

class WebhookList extends React.Component {
  state = {
    loading: true,
    data: [],
    topicFilterOptions: [],
    integrationFilterOptions: [],
    pagination: {},
    limit: 10,
    page: 0,
    searchTerm: '',
    serverSideFilterList: [],
    alertDialog: {
      open: false,
      objectId: '',
      objectName: '',
      message: ''
    }
  };

  componentDidMount() {
    this.getTopics();
    this.getIntegrations();
    this.callAPI();
  }

  getMuiTheme = () => createMuiTheme({
      overrides: {
        MUIDataTableToolbar: {
          filterPaper: {
            width: '50%'
          }
        }
      }
    });

  getTopics() {
    API.get('/webhooks/topics', { params: { limit: 100, offset: 0 } })
      .then(response => {
        const { data } = response.data;
        const topics = data.map(item => item.topic);
        this.setState({ topicFilterOptions: topics });
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

  getAPIwebhooks(params) {
    const { enqueueSnackbar } = this.props;
    this.setState({ loading: true });
    API.get('/webhooks', { params })
      .then(response => {
        const { data, pagination } = response.data;
        this.setState({
          data,
          pagination,
          limit: pagination ? pagination.limit : 0
        });
      })
      .catch(error => {
        enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
          variant: 'error'
        });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  callAPI = () => {
    const {
 limit, page, searchTerm, serverSideFilterList 
} = this.state;
    const params = {
      offset: page * limit,
      limit,
      term: searchTerm || '',
      topic: serverSideFilterList[2] ? serverSideFilterList[2][0] : '',
      integration_id: serverSideFilterList[3] ? serverSideFilterList[3][0] : ''
    };

    this.getAPIwebhooks(params);
  };

  deleteAPIwebhook = id => {
    const { enqueueSnackbar } = this.props;
    API.get(`/webhooks/${id}/destroy`)
      .then(() => {
        enqueueSnackbar('Webhook deleted successfully', { variant: 'success' });
        this.callAPI();
      })
      .catch(error => {
        enqueueSnackbar(error, { variant: 'error' });
      });
  };

  handleChangePage = page => {
    this.setState({ page }, this.callAPI);
  };

  handleChangeRowsPerPage = event => {
    this.setState({ limit: parseInt(event, 10) }, this.callAPI);
  };

  handleSearch = searchTerm => {
    if (searchTerm) {
      const timer = setTimeout(() => {
        this.setState({ searchTerm }, this.callAPI);
        clearTimeout(timer);
      }, 1000);
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

  handleEdit = id => {
    const { history } = this.props;
    history.push(`/webhooks/${id}`);
  };

  handleOnClickDelete = tableMeta => {
    const id = tableMeta ? tableMeta.rowData[0] : null;
    const address = tableMeta ? tableMeta.rowData[1] : null;
    const topic = tableMeta ? tableMeta.rowData[2] : null;
    this.setState({
      alertDialog: {
        open: true,
        objectId: id,
        message: `Are you sure you want to remove the webhook with topic: "${topic}" on address: "${address}"?`
      }
    });
  };

  handleDialogConfirm = () => {
    this.handleDelete();
    this.setState({ alertDialog: { open: false } });
  };

  handleDialogCancel = () => {
    this.setState({ alertDialog: { open: false } });
  };

  handleDelete = async () => {
    const { enqueueSnackbar } = this.props;
    const { alertDialog } = this.state;
    this.setState({ loading: true });
    API.delete(`webhooks/${alertDialog.objectId}`)
      .then(() => {
        enqueueSnackbar('webhook deleted successfully', {
          variant: 'success'
        });
        this.callAPI();
      })
      .catch(error => {
        enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
          variant: 'error'
        });
      })
      .then(() => {
        this.setState({ loading: false });
      });
  };

  handleAddWebhookClick = () => {
    const { history } = this.props;
    history.push('/webhooks/add-webhook');
  };

  render() {
    const { classes, history } = this.props;
    const {
      data,
      pagination,
      loading,
      page,
      limit,
      searchTerm,
      serverSideFilterList,
      topicFilterOptions,
      integrationFilterOptions,
      alertDialog
    } = this.state;

    const count = pagination.total;

    const columns = [
      {
        name: 'id',
        label: 'ID',
        options: {
          display: 'excluded',
          filter: false
        }
      },
      {
        name: 'address',
        label: 'Address',
        options: {
          filter: false,
          sort: false
        }
      },
      {
        name: 'topic',
        label: 'Topic',
        options: {
          filter: true,
          filterType: 'dropdown',
          filterList: serverSideFilterList[2],
          filterOptions: {
            names: topicFilterOptions
          }
        }
      },
      {
        name: 'integration',
        label: 'Integration',
        options: {
          filter: true,
          sort: false,
          filterType: 'dropdown',
          filterList: serverSideFilterList[3],
          filterOptions: {
            names: integrationFilterOptions
          },
          customBodyRender: value => <div>{value ? value.name : null}</div>
        }
      },
      {
        name: 'updated_at',
        label: 'Updated at',
        options: {
          filter: false,
          customBodyRender: value => (
            <div>{moment(value).format('Y-MM-DD H:mm:ss')}</div>
          )
        }
      },
      {
        name: 'Actions',
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta) => (
            <div>
              <Tooltip title="edit">
                <EditIcon
                  color="action"
                  onClick={() => this.handleEdit(tableMeta ? tableMeta.rowData[0] : null)
                  }
                />
              </Tooltip>
              <Tooltip title="delete">
                <DeleteIcon
                  color="action"
                  onClick={() => this.handleOnClickDelete(tableMeta)}
                />
              </Tooltip>
            </div>
          )
        }
      }
    ];

    const options = {
      filter: true,
      sort: false,
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
      }
    };

    return (
      <Fragment>
        <PageHeader title="Webhooks" history={history} />
        <div className={classes.table}>
          {loading ? <Loading /> : null}
          <MuiThemeProvider theme={this.getMuiTheme()}>
            <MUIDataTable
              title={
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ margin: '10px' }}
                  onClick={this.handleAddWebhookClick}
                >
                  Add Webhook
                </Button>
              }
              data={data}
              columns={columns}
              options={options}
            />
          </MuiThemeProvider>
          <AlertDialog
            open={alertDialog.open}
            message={alertDialog.message}
            handleCancel={this.handleDialogCancel}
            handleConfirm={this.handleDialogConfirm}
          />
        </div>
      </Fragment>
    );
  }
}
WebhookList.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(withStyles(styles)(WebhookList));
