import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  withStyles,
  createMuiTheme,
  MuiThemeProvider,
  Tooltip
} from '@material-ui/core';
import { withSnackbar } from 'notistack';
import moment from 'moment';
import get from 'lodash/get';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';
import CloseIcon from '@material-ui/icons/Close';
import MUIDataTable from 'mui-datatables';
import Loading from 'dan-components/Loading';
import { delay } from 'dan-containers/Common/Utils';
import {
  getAvailableIntegrationList,
  installAvailableIntegration,
  uninstallAvailableIntegration
} from 'dan-actions/AvailableIntegrationsActions';
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

const getMuiTheme = () =>
  createMuiTheme({
    overrides: {
      MUIDataTableToolbar: {
        filterPaper: {
          width: '50%'
        }
      }
    }
  });

function AvailableIntegrationList(props) {
  const {
    classes,
    history,
    task,
    availableIntegrations,
    fetchAvailableIntegrations,
    loading,
    onInstall,
    onUninstall,
    enqueueSnackbar
  } = props;
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState('');

  const previousTask = useRef(task);

  const { data, pagination } =  availableIntegrations;

  useEffect(() => {
    task && task !== previousTask.current ? history.push(`tasks/${task.id}`) : null;
  }, [task])

  const makeQuery = () => {
    const params = {
      limit,
      offset: page * limit,
      term: searchText,
      with_details: true
    };
    fetchAvailableIntegrations(params, enqueueSnackbar);
  };

  useEffect(() => {
    makeQuery();
  }, [limit, page, searchText]);

  const handleInstall = id => onInstall(id, enqueueSnackbar);

  const handleUninstall = id => onUninstall(id, enqueueSnackbar);

  const handleChangePage = (page_) => setPage(page_);

  const handleChangeRowsPerPage = rowsPerPage => setLimit(rowsPerPage);

  function handleSearch(searchTerm) {
    if (searchTerm) {
      delay(searchTerm, () => setSearchText(searchTerm));
    } else if (searchText) {
      setSearchText('');
    }
  };

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
      name: 'name',
      label: 'name',
      options: {
        filter: false,
        sort: false
      }
    },
    {
      name: 'version',
      label: 'Version',
      options: {
        filter: false
      }
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: false
      }
    },
    {
      name: 'installed_at',
      label: 'Installed at',
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
            <Tooltip title="install">
              <VerticalAlignBottomIcon
                color="action"
                onClick={() =>
                  handleInstall(tableMeta ? tableMeta.rowData[0] : null)
                }
              />
            </Tooltip>
            <Tooltip title="uninstall">
              <CloseIcon
                color="action"
                onClick={() =>
                  handleUninstall(tableMeta ? tableMeta.rowData[0] : null)
                }
              />
            </Tooltip>
          </div>
        )
      }
    }
  ];

  const options = {
    search: true,
    filter: false,
    sort: false,
    selectableRows: 'none',
    searchText,
    responsive: 'stacked',
    download: false,
    print: false,
    serverSide: true,
    rowsPerPage: limit,
    count: get(pagination, 'total', 0),
    page,
    onTableChange: (action, tableState) => {
      switch (action) {
        case 'changePage':
          handleChangePage(tableState.page);
          break;
        case 'changeRowsPerPage':
          handleChangeRowsPerPage(tableState.rowsPerPage);
          break;
        case 'search':
          handleSearch(tableState.searchText);
          break;
        default:
          break;
      }
    }
  };

  return (
    <div>
      <PageHeader title="Available Integrations" history={history} />
      <div className={classes.table}>
        {loading ? <Loading /> : null}
        <MuiThemeProvider theme={getMuiTheme()}>
          <MUIDataTable
            columns={columns}
            data={data}
            options={options}
          />
        </MuiThemeProvider>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  availableIntegrations: state.getIn(['availableIntegration', 'availableIntegrations']),
  task: state.getIn(['availableIntegration', 'task']),
  loading: state.getIn(['availableIntegration', 'loading']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  fetchAvailableIntegrations: bindActionCreators(getAvailableIntegrationList, dispatch),
  onInstall: bindActionCreators(installAvailableIntegration, dispatch),
  onUninstall: bindActionCreators(uninstallAvailableIntegration, dispatch)
});

const CollectionListMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AvailableIntegrationList);

AvailableIntegrationList.defaultProps = {
  task: null
};

AvailableIntegrationList.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  task: PropTypes.object,
  loading: PropTypes.bool.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  availableIntegrations: PropTypes.object.isRequired,
  fetchAvailableIntegrations: PropTypes.func.isRequired,
  onInstall: PropTypes.func.isRequired,
  onUninstall: PropTypes.func.isRequired
};

export default withSnackbar(withStyles(styles)(CollectionListMapped));
