import React, { Component } from 'react';

// material-ui
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import BlockIcon from '@material-ui/icons/Block';

import { withSnackbar } from 'notistack';

import PropTypes from 'prop-types';
import API from '../../Utils/api';
import { Utils } from '../../Common/Utils';
import LoadingState from '../../Common/LoadingState';
import AlertDialog from '../../Common/AlertDialog';


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
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 2,
  },
  background: {
    backgroundColor: theme.palette.background.paper
  }

});

class Stores extends Component {
  state = {
    loading: true,
    stores: [],
    alertDialog: {
      open: false,
      storeId: '',
      storeName: '',
      message: ''
    }
  }

  componentDidMount() {
    this.getStores();
  }

  getStores = () => {
    this.setState({ loading: true });
    API.get('/stores').then(response => {
      this.setState({ stores: response.data.data });
    }).catch((error) => {
      // handle error
      console.log(error);
    }).then(() => {
      this.setState({ loading: false });
    });
  }

  deleteStore = (id) => {
    const { enqueueSnackbar } = this.props;
    this.setState({ loading: true });
    API.get(`/stores/${id}/destroy`).then(() => {
      enqueueSnackbar('Store deleted successfully', {
        variant: 'success'
      });
    }).catch((error) => {
      enqueueSnackbar(error, {
        variant: 'error'
      });
    }).then(() => {
      this.setState({ loading: false });
    });
  }

  handleAddStoreClick = () => {
    const { history } = this.props;
    history.push('/app/settings/stores/add-store');
  }

  handleAuthorization = (id) => {
    window.location.replace(`${Utils.baseAPIURL()}/stores/${id}/authorize?redirect_id=${Utils.uri4Back2SPA()}`);
  }

  handleUnAuthorization = (id) => {
    const { enqueueSnackbar } = this.props;
    this.setState({ loading: true });
    API.get(`/stores/${id}/unauthorize`).then(() => {
      enqueueSnackbar('Store unauthorized successfully', {
        variant: 'success'
      });
    }).catch((error) => {
      // handle error
      console.log(error);
    }).then(() => {
      this.setState({ loading: false });
      this.getStores();
    });
  }

  handleDialogCancel = () => {
    this.setState({ alertDialog: false });
  }

  handleDialogConfirm = async () => {
    const { enqueueSnackbar } = this.props;
    try {
      const { alertDialog } = this.state;
      const response = await API.delete(`/stores/${alertDialog.storeId}`);
      if (response && response.data.success) {
        enqueueSnackbar('Store deleted successfully', {
          variant: 'success'
        });
      }
      this.getStores();
    } catch (error) {
      const errorMessage = error ? error.response.data.message : 'unknown Error';
      enqueueSnackbar(errorMessage, {
        variant: 'error'
      });
    }
    this.setState({ alertDialog: false });
  }

  handleDeleteClick = (id, name) => {
    this.setState({
      alertDialog: {
        open: true,
        storeId: id,
        storeName: name,
        message: `Are you sure you want to remove "${name}" Store?`
      }
    });
  }

  render() {
    const { classes } = this.props;
    const { stores, loading, alertDialog } = this.state;

    return (
      <div>
        {loading ? <LoadingState loading={loading} /> : null}
        <Paper>
          <div className="display-flex flex-direction-row-inverse">
            <Button
              variant="outlined"
              color="primary"
              style={{ margin: '10px' }}
              onClick={this.handleAddStoreClick}
            >
              Add Store
            </Button>
          </div>
          <Divider variant="middle" />
          <div className={classes.cardList}>
            {stores && stores.map(({
              id, name, channel, authorized, logo = Utils.urlLogo(channel)
            }) => (
              <Card className={classes.card} key={name}>
                <CardHeader
                  avatar={logo
                    ? <Avatar src={logo} alt="logo" aria-label="Recipe" className={classes.avatar} /> : null
                  }
                  title={name}
                  subheader={Utils.fullChannelName(channel)}
                />
                <CardActions className={classes.actions}>
                  {authorized ? (
                    <Tooltip title="unauthorize">
                      <IconButton aria-label="unauthorize" onClick={() => this.handleUnAuthorization(id)}>
                        <BlockIcon />
                      </IconButton>
                    </Tooltip>
                  )
                    : (
                      <Tooltip title="authorize">
                        <IconButton aria-label="authorize" onClick={() => this.handleAuthorization(id)}>
                          <VerifiedUserIcon />
                        </IconButton>
                      </Tooltip>
                    )
                  }
                  <Tooltip title="delete">
                    <IconButton aria-label="delete" onClick={() => this.handleDeleteClick(id, name)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            ))}
          </div>
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

Stores.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(withStyles(styles)(Stores));
