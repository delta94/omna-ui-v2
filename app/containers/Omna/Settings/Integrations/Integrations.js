import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withSnackbar } from 'notistack';
import get from 'lodash/get';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';

import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import BlockIcon from '@material-ui/icons/Block';

import LoadingState from '../../Common/LoadingState';
import AlertDialog from '../../Common/AlertDialog';
import Utils from '../../Common/Utils';
import GenericTablePagination from '../../Common/GenericTablePagination';
import API from '../../Utils/api';

const styles = theme => ({
  cardList: {
    display: 'flex',
    flexWrap: 'wrap',
    minWidth: '275px'
  },
  card: {
    minWidth: 275,
    margin: 5
  },
  actions: {
    justifyContent: 'center'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 2
  },
  background: {
    backgroundColor: theme.palette.background.paper
  }
});

class Integrations extends Component {
  state = {
    loading: true,
    integrations: { data: [], pagination: {} },
    alertDialog: {
      open: false,
      integrationId: '',
      integrationName: '',
      message: ''
    },
    limit: 5,
    page: 0
  };

  componentDidMount() {
    this.getIntegrations();
  }

  getIntegrations = params => {
    this.setState({ loading: true });
    let reqParams = params;
    if (typeof reqParams !== 'undefined') {
      reqParams.with_details = true;
    } else {
      reqParams = { with_details: true };
    }

    API.get('/integrations', { params: reqParams })
      .then(response => {
        this.setState({
          integrations: get(response, 'data', { data: [], pagination: {} }),
          limit: get(response, 'data.pagination.limit', 0)
        });
      })
      .catch(error => {
        // handle error
        console.log(error);
      })
      .then(() => {
        this.setState({ loading: false });
      });
  };

  deleteIntegration = id => {
    const { enqueueSnackbar } = this.props;
    this.setState({ loading: true });
    API.get(`/integrations/${id}/destroy`)
      .then(() => {
        enqueueSnackbar('Integration deleted successfully', {
          variant: 'success'
        });
      })
      .catch(error => {
        enqueueSnackbar(error, {
          variant: 'error'
        });
      })
      .then(() => {
        this.setState({ loading: false });
      });
  };

  handleAddIntegrationClick = () => {
    const { history } = this.props;
    history.push('/app/settings/integrations/add-integration');
  };

  handleAuthorization = id => {
    window.location.replace(
      `${Utils.baseAPIURL()}/integrations/${id}/authorize?redirect_id=${Utils.returnAfterAuthorization()}`
    );
  };

  handleUnAuthorization = id => {
    const { enqueueSnackbar } = this.props;
    this.setState({ loading: true });
    API.get(`/integrations/${id}/unauthorize`)
      .then(() => {
        enqueueSnackbar('Integration unauthorized successfully', {
          variant: 'success'
        });
      })
      .catch(error => {
        // handle error
        console.log(error);
      })
      .then(() => {
        this.setState({ loading: false });
        this.getIntegrations();
      });
  };

  handleDialogCancel = () => {
    this.setState({ alertDialog: false });
  };

  handleDialogConfirm = async () => {
    const { enqueueSnackbar } = this.props;
    try {
      const { alertDialog } = this.state;
      const response = await API.delete(
        `/integrations/${alertDialog.integrationId}`
      );
      if (response && response.data.success) {
        enqueueSnackbar('Integration deleted successfully', {
          variant: 'success'
        });
      }
      this.getIntegrations();
    } catch (error) {
      const errorMessage = error
        ? error.response.data.message
        : 'unknown Error';
      enqueueSnackbar(errorMessage, {
        variant: 'error'
      });
    }
    this.setState({ alertDialog: false });
  };

  handleDeleteClick = (id, name) => {
    this.setState({
      alertDialog: {
        open: true,
        integrationId: id,
        integrationName: name,
        message: `Are you sure you want to remove "${name}" integration?`
      }
    });
  };

  handleChangePage = (e, page) => {
    const { limit } = this.state;
    this.setState({ page });

    const params = {
      offset: page * limit,
      limit
    };

    this.getIntegrations(params);
  };

  render() {
    const { classes } = this.props;
    const {
      integrations, loading, alertDialog, limit, page
    } = this.state;

    const { pagination, data } = integrations;
    const count = get(pagination, 'total', 0);

    return (
      <div>
        {loading ? <LoadingState loading={loading} /> : null}
        <Paper>
          <div className="display-flex flex-direction-row-inverse">
            <Button
              variant="outlined"
              color="primary"
              style={{ margin: '10px' }}
              onClick={this.handleAddIntegrationClick}
            >
              Add Integration
            </Button>
          </div>
          <Divider variant="middle" />
          <div className={classes.cardList}>
            {data
              && data.map(
                ({
                  id,
                  name,
                  channel,
                  logo = Utils.urlLogo(channel),
                  authorized
                }) => (
                  <Card className={classes.card} key={name}>
                    <CardHeader
                      avatar={
                        logo ? (
                          <Avatar
                            src={logo}
                            alt="logo"
                            aria-label="Recipe"
                            className={classes.avatar}
                          />
                        ) : null
                      }
                      title={name}
                      subheader={Utils.fullChannelName(channel)}
                    />
                    <CardActions className={classes.actions}>
                      {authorized ? (
                        <Tooltip title="unauthorize">
                          <IconButton
                            aria-label="unauthorize"
                            onClick={() => this.handleUnAuthorization(id)}
                          >
                            <BlockIcon />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Tooltip title="authorize">
                          <IconButton
                            aria-label="authorize"
                            onClick={() => this.handleAuthorization(id)}
                          >
                            <VerifiedUserIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="delete">
                        <IconButton
                          aria-label="delete"
                          onClick={() => this.handleDeleteClick(id, name)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                )
              )}
          </div>
          <Table>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={5}
                  rowsPerPageOptions={[5, 10, 25, 50]}
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
        </Paper>
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

Integrations.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(withStyles(styles)(Integrations));
