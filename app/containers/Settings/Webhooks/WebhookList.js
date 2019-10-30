import React from 'react';
import PropTypes from 'prop-types';
import MUIDataTable from 'mui-datatables';
import Paper from '@material-ui/core/Paper';
import { withSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import moment from 'moment';
import get from 'lodash/get';

/* material-ui */
// core
import Tooltip from '@material-ui/core/Tooltip';
import Ionicon from 'react-ionicons';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
//
import API from '../../Utils/api';
import LoadingState from '../../Common/LoadingState';

const styles = () => ({
  table: {
    minWidth: 700
  }
});

class WebhookList extends React.Component {
  state = {
    loading: true,
    data: [],
    pagination: {},
    limit: 10,
    page: 0,
    searchTerm: '',
    serverSideFilterList: []
  };

  componentDidMount() {
    // this.getTopics();
    this.callAPI();
  }

  /*  getTopics() {
    API.get('/webhooks/topics')
      .then(response => {
        const { data } = response.data;
        const topicFilterList = data.map((item) => {
          return item.topic;
        });
        debugger;
        this.setState({ topics: topicFilterList });
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
  } */

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
      }, 1500);
      window.addEventListener('keydown', () => {
        clearTimeout(timer);
      });
    } else {
      const { searchTerm: _searchTerm } = this.state;
      if (_searchTerm) {
        this.setState({ searchTerm: '' }, this.callAPI);
      }
    }
  }

  handleFilterChange = (filterList) => {
    const { serverSideFilterList } = this.state;
    const oldFilterValue = serverSideFilterList[2] ? serverSideFilterList[2][0] : null;
    const newFilterValue = filterList[2] ? filterList[2][0] : null;
    if (newFilterValue) {
      if (newFilterValue !== oldFilterValue) {
        this.setState({ serverSideFilterList: filterList }, this.callAPI);
      }
    } else {
      this.setState({ serverSideFilterList: [] }, this.callAPI);
    }
  };

  handleAddWebhookClick = () => {
    const { history } = this.props;
    history.push('/app/settings/webhook-list/add-webhook');
  };

  handleEdit = (id) => {
    const { history } = this.props;
    history.push(`/app/settings/webhook-list/edit-webhook/${id}`);
  };

  render() {
    const {
      data,
      pagination,
      loading,
      page,
      limit,
      searchTerm,
      serverSideFilterList
    } = this.state;

    const count = pagination.total;

    const columns = [
      {
        name: 'id',
        label: 'ID',
        options: {
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
            names: ['order/registered', 'order/updated'
            ]
          }
        }
      },
      {
        name: 'integration',
        label: 'Integration',
        options: {
          filter: false,
          sort: true,
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
                <IconButton
                  aria-label="edit"
                  onClick={() => this.handleEdit(tableMeta ? tableMeta.rowData[0] : null)}
                >
                  <Ionicon icon="md-create" />
                </IconButton>
              </Tooltip>
            </div>
          )
        }
      },
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
      customToolbar: () => (
        <Tooltip title="add">
          <IconButton
            aria-label="add"
            component={Link}
            to="/app/settings/webhook-list/add-webhook"
          >
            <Ionicon icon="md-add-circle" />
          </IconButton>
        </Tooltip>
      )
    };

    return (
      <div>
        {loading ? <Paper><div className="item-padding"><LoadingState loading={loading} text="Loading" /></div></Paper> : (
          <MUIDataTable
            data={data}
            columns={columns}
            options={options}
          />
        )}
      </div>
    );
  }
}
WebhookList.propTypes = {
  history: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(withStyles(styles)(WebhookList));
