import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  withStyles, createMuiTheme, MuiThemeProvider, Tooltip
} from '@material-ui/core';
import { withSnackbar } from 'notistack';
import moment from 'moment';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';
import CloseIcon from '@material-ui/icons/Close';
import MUIDataTable from 'mui-datatables';
import Loading from 'dan-components/Loading';
import PageHeader from '../../Common/PageHeader';
import { setAvailableIntegrationList, installAvailableIntegration, uninstallAvailableIntegration } from '../../../actions/AvailableIntegrationsActions';
import Utils from '../../Common/Utils';

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

const getMuiTheme = () => createMuiTheme({
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
    classes, history, availableIntegrations, fetchAvailableIntegrations, total, loading, enqueueSnackbar
  } = props;
  const [page, setPage] = useState(0);
  const [_params, _setParams] = useState({
    limit: 10,
    offset: 0,
    searchTerm: ''
  });

  useEffect(() => {
    fetchAvailableIntegrations({ ..._params }, enqueueSnackbar);
  }, [_params]);

  const handleInstall = async (id) => {
    const { onInstall } = props;
    onInstall(id, enqueueSnackbar);
  };

  const handleUninstall = (id) => {
    const { onUninstall } = props;
    onUninstall(id, enqueueSnackbar);
  };

  const handleChangePage = (_page) => {
    setPage(_page);
    _setParams({ ..._params, offset: _page * _params.limit });
  };

  const handleChangeRowsPerPage = rowsPerPage => {
    _setParams({ ..._params, limit: rowsPerPage, offset: page * _params.limit });
  };

  const setSearchTerm = (value) => {
    _setParams({ ..._params, searchTerm: value });
  };

  function handleSearch(_searchTerm) {
    if (_searchTerm) {
      Utils.delay(_searchTerm, () => setSearchTerm(_searchTerm));
    } else if (_params.searchTerm) {
      setSearchTerm('');
    }
  }

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
        filter: false,
      }
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: false,
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
                onClick={() => handleInstall(tableMeta ? tableMeta.rowData[0] : null)}
              />
            </Tooltip>
            <Tooltip title="uninstall">
              <CloseIcon
                color="action"
                onClick={() => handleUninstall(tableMeta ? tableMeta.rowData[0] : null)}
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
    searchText: _params.searchTerm,
    responsive: 'stacked',
    download: false,
    print: false,
    serverSide: true,
    rowsPerPage: _params.limit,
    total,
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
          <MUIDataTable columns={columns} data={availableIntegrations} options={options} />
        </MuiThemeProvider>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  availableIntegrations: state.getIn(['availableIntegration', 'availableIntegrations']).toJS(),
  task: state.getIn(['availableIntegration', 'task']),
  total: state.getIn(['availableIntegration', 'total']),
  loading: state.getIn(['availableIntegration', 'loading']),
  ...state
});

const mapDispatchToProps = (dispatch) => ({
  fetchAvailableIntegrations: bindActionCreators(setAvailableIntegrationList, dispatch),
  onInstall: bindActionCreators(installAvailableIntegration, dispatch),
  onUninstall: bindActionCreators(uninstallAvailableIntegration, dispatch),
});

const CollectionListMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(AvailableIntegrationList);

AvailableIntegrationList.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  availableIntegrations: PropTypes.array.isRequired,
  fetchAvailableIntegrations: PropTypes.func.isRequired,
  onInstall: PropTypes.func.isRequired,
  onUninstall: PropTypes.func.isRequired
};

export default withSnackbar(withStyles(styles)(CollectionListMapped));
