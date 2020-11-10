import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import get from 'lodash/get';
import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Paper,
  Table,
  TableRow,
  TableFooter,
  TablePagination,
  Tooltip,
  IconButton
} from '@material-ui/core';
import Ionicon from 'react-ionicons';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IntegrationCard from 'dan-components/CardPaper/IntegrationCard';
import AlertDialog from 'dan-containers/Common/AlertDialog';
import GenericTablePagination from 'dan-containers/Common/GenericTablePagination';
import PageHeader from 'dan-containers/Common/PageHeader';
import {
  deleteIntegration,
  getIntegrations,
  importResource,
  setLoading,
  unauthorizeIntegration
} from 'dan-actions';
import { Loading } from 'dan-components';
import {
  handleAuthorization,
  delay,
  getImage,
  getIntegrationCardOptions,
  getChannelGroup
} from 'dan-containers/Common/Utils';
import AutoSuggestion from 'dan-components/AutoSuggestion/index';
import IntegrationForm from './IntegrationForm';

const styles = theme => ({
  cardList: {
    display: 'flex',
    flexFlow: 'wrap',
    minWidth: 275
  },
  card: {
    margin: 5
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 2
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  background: {
    backgroundColor: theme.palette.background.paper
  }
});

class IntegrationList extends Component {
  state = {
    openForm: false,
    alertDialog: {
      open: false,
      integrationId: '',
      message: ''
    },
    limit: 10,
    page: 0,
    searchTerm: '',
    editableIntegration: null
  };

  componentDidMount() {
    this.makeRequest();
  }

  componentDidUpdate(prevProps) {
    const { task, history } = this.props;
    task !== prevProps.task ? history.push(`tasks/${task.id}`) : null;
  }

  handleAddIntegrationClick = () => {
    const { history } = this.props;
    history.push('/integrations/add-integration');
  };

  handleAuthorization = id => handleAuthorization(`integrations/${id}/authorize`);

  handleUnAuthorization = id => {
    const { enqueueSnackbar, onUnauthorizeIntegration } = this.props;
    try {
      onUnauthorizeIntegration(id);
      enqueueSnackbar('Integration unauthorized successfully', {
        variant: 'success'
      });
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
  };

  handleDialogCancel = () => {
    this.setState({ alertDialog: false });
  };

  handleDeleteIntegration = () => {
    const { onDeleteIntegration, enqueueSnackbar } = this.props;
    const { alertDialog } = this.state;
    try {
      onDeleteIntegration(alertDialog.integrationId, enqueueSnackbar);
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }
  };

  handleImportResource = (id, resource) => {
    const { fromShopifyApp, store, onImportResource, enqueueSnackbar } = this.props;
    onImportResource({
      id, resource, fromShopify: fromShopifyApp, shop: store, enqueueSnackbar
    });
  };

  handleViewResource = (id, resource) => {
    const { history } = this.props;
    history.push(`${history.location.pathname}/${id}/${resource}`);
  };

  handleDialogConfirm = () => {
    this.handleDeleteIntegration();
    this.setState({ alertDialog: false });
  };

  handleEditClick = editableIntegration => {
    this.setState({ editableIntegration, openForm: true });
  };

  handleDeleteClick = ({ id, name }) => {
    this.setState({
      alertDialog: {
        open: true,
        integrationId: id,
        message: `Are you sure you want to remove "${name}" integration?`
      }
    });
  };

  handleChangePage = (e, page) => {
    this.setState({ page }, this.makeRequest);
  };

  makeRequest = () => {
    const { onGetIntegrations } = this.props;
    const { limit, page, searchTerm } = this.state;
    const params = {
      offset: page * limit,
      limit,
      term: searchTerm,
      with_details: true
    };

    onGetIntegrations(params);
  };

  handleChangeRowsPerPage = event => {
    this.setState(
      { limit: parseInt(event.target.value, 10) },
      this.makeRequest
    );
  };

  handleAddIntegrationClick = () => {
    this.setState({ openForm: true });
  };

  handleCloseForm = () => {
    this.setState({ openForm: false, editableIntegration: null });
  };

  handleSearch = e => {
    const searchTerm = e.target.value;
    if (searchTerm) {
      this.setState({ searchTerm }, delay(() => this.makeRequest()));
    } else {
      const { searchTerm: _searchTerm } = this.state;
      if (_searchTerm) {
        this.setState({ searchTerm: '' }, this.makeQuery);
      }
    }
  };

  handleClearSearch = (e) => {
    const { searchTerm } = this.state;
    if (!e.target.value && searchTerm) {
      this.setState({ searchTerm: '' }, this.makeRequest);
    }
  };

  renderCardActions = (item) => {
    const group = getChannelGroup(item.channelTitle);
    const { fromShopifyApp } = this.props;
    const node = (
      <Fragment>
        <Tooltip title="Edit">
          <IconButton aria-label="edit" onClick={() => this.handleEditClick(item)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton aria-label="delete" onClick={() => this.handleDeleteClick(item)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Fragment>
    );
    if (!fromShopifyApp || (fromShopifyApp && group !== 'Shopify')) {
      return node;
    }
    return undefined;
  };

  renderCardOptions = (channelTitle) => {
    const group = getChannelGroup(channelTitle);
    const options = getIntegrationCardOptions(group);
    const { fromShopifyApp } = this.props;
    if (fromShopifyApp && group === 'Shopify') {
      return options.filter(({ value }) => value === 'import products');
    }
    return options;
  };

  handleCardClickOption = (opt, id) => {
    switch (opt) {
      case 'import products':
        this.handleImportResource(id, 'products');
        break;
      case 'import orders':
        this.handleImportResource(id, 'orders');
        break;
      case 'import logistics':
        this.handleImportResource(id, 'logistics');
        break;
      case 'import brands':
        this.handleImportResource(id, 'brands');
        break;
      case 'import categories':
        this.handleImportResource(id, 'categories');
        break;
      case 'view categories':
        this.handleViewResource(id, 'categories');
        break;
      case 'view brands':
        this.handleViewResource(id, 'brands');
        break;
      case 'authorize':
        this.handleAuthorization(id);
        break;
      case 'unauthorize':
        this.handleUnAuthorization(id);
        break;
      default:
        break;
    }
  };

  render() {
    const {
      classes, history, integrations, loading, fromShopifyApp
    } = this.props;
    const {
      alertDialog,
      editableIntegration,
      limit,
      openForm,
      page,
      searchTerm
    } = this.state;
    const { pagination, data } = integrations.toJS();
    const count = get(pagination, 'total', 0);
    return (
      <div>
        <PageHeader title="Connected integrations" history={history} />
        {loading && <Loading />}
        <div>
          <Paper style={{ margin: '0 4px 8px', padding: 10 }}>
            <div className={classes.actions}>
              <AutoSuggestion
                label="Search by name"
                inputValue={searchTerm}
                freeSolo
                onChange={this.handleClearSearch}
                onInputChange={this.handleSearch}
                style={{ width: '300px' }}
              />
              <Tooltip title="Add integration">
                <IconButton
                  aria-label="add"
                  onClick={this.handleAddIntegrationClick}
                >
                  <Ionicon icon="md-add-circle" />
                </IconButton>
              </Tooltip>
            </div>
          </Paper>
          <Grid container spacing={2}>
            {data
              && data.slice(0, limit).map(({ id, name, channel, channel_title: channelTitle, authorized }) => (
                <Grid item md={3} sm={6} xs={12}>
                  <IntegrationCard
                    key={id}
                    name={name}
                    subheader={channelTitle}
                    image={getImage(channelTitle)}
                    status={authorized ? 'Authorized' : 'Unauthorized'}
                    actions={this.renderCardActions({ id, name, channel, channelTitle })}
                    options={this.renderCardOptions(channelTitle)}
                    onClickOption={(opt) => this.handleCardClickOption(opt, id)}
                  />
                </Grid>
              ))}
          </Grid>
          <Table>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  count={count}
                  rowsPerPage={limit}
                  page={page}
                  SelectProps={{
                    native: true
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  ActionsComponent={GenericTablePagination}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>

        <AlertDialog
          open={alertDialog.open}
          message={alertDialog.message}
          handleCancel={this.handleDialogCancel}
          handleConfirm={this.handleDialogConfirm}
        />

        <IntegrationForm
          fromShopify={fromShopifyApp}
          editableIntegration={editableIntegration}
          classes={classes}
          handleClose={this.handleCloseForm}
          open={openForm}
        />
      </div>
    );
  }
}

IntegrationList.defaultProps = {
  task: null
};

IntegrationList.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  task: PropTypes.object,
  fromShopifyApp: PropTypes.bool.isRequired,
  store: PropTypes.string.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  integrations: PropTypes.array.isRequired,
  onDeleteIntegration: PropTypes.func.isRequired,
  onGetIntegrations: PropTypes.func.isRequired,
  onImportResource: PropTypes.func.isRequired,
  onUnauthorizeIntegration: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  loading: state.getIn(['integration', 'loading']),
  integrations: state.getIn(['integration', 'integrations']),
  task: state.getIn(['integration', 'task']),
  fromShopifyApp: state.getIn(['user', 'fromShopifyApp']),
  store: state.getIn(['user', 'tenantName'])
});

const mapDispatchToProps = dispatch => ({
  onDeleteIntegration: (id, enqueueSnackbar) => dispatch(deleteIntegration(id, enqueueSnackbar)),
  onGetIntegrations: query => dispatch(getIntegrations(query)),
  onImportResource: query => dispatch(importResource(query)),
  onSetLoading: query => dispatch(setLoading(query)),
  onUnauthorizeIntegration: id => dispatch(unauthorizeIntegration(id))
});

const MyIntegrationsMapped = withSnackbar(withStyles(styles)(IntegrationList));

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyIntegrationsMapped);
