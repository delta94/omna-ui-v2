import React, { Component } from 'react';
import { Utils } from '../../common/Utils';
import API from '../../../utils/api';

import ToolbarActions from './ToolbarActions';
import LoadingState from '../../common/LoadingState';
import AlertDialog from '../../common/AlertDialog';

//material-ui
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import BlockIcon from '@material-ui/icons/Block';
//
import { withSnackbar } from 'notistack';


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
        API.get(`/stores`).then(response => {
            this.setState({ stores: response.data.data });
        }).catch((error) => {
            // handle error
            console.log(error);
        }).then(() => {
            this.setState({ loading: false });
        });
    }

    deleteStore = (id) => {
        this.setState({ loading: true });
        API.get(`/stores/${id}/destroy`).then(response => {
            this.props.enqueueSnackbar('Store deleted successfully', {
                variant: 'success'
            });
        }).catch((error) => {
            this.props.enqueueSnackbar(error, {
                variant: 'error'
            });
        }).then(() => {
            this.setState({ loading: false });
        });
    }

    handleAuthorization = (id) => {
        window.location.replace(`${Utils.baseAPIURL}/stores/${id}/authorize?redirect_id=${Utils.uri4Back2SPA}`);
    }

    handleUnAuthorization = (id) => {
        this.setState({ loading: true });
        API.get(`/stores/${id}/unauthorize`).then(response => {
            this.props.enqueueSnackbar('Store unauthorized successfully', {
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
       this.setState({alertDialog: false});
    }

    handleDialogConfirm = async () => {
        try {
            const { alertDialog } = this.state;
            const response = await API.delete(`/stores/${alertDialog.storeId}`);
            if (response && response.data.success){
                this.props.enqueueSnackbar('Store deleted successfully', {
                    variant: 'success'
                });
            }
            this.getStores();
        } catch (error) {
            const errorMessage = error ? error.response.data.message :'unknown Error';
            this.props.enqueueSnackbar(errorMessage, {
                variant: 'error'
            });
        }
        this.setState({alertDialog: false});
    }

    handleDeleteClick = (id, name ) => {
        this.setState({alertDialog: {
            open: true,
            storeId: id,
            storeName: name,
            message: `Are you sure you want to remove "${name}" Store?`
        }});
    }


    render() {
        const { classes } = this.props;
        const { stores, loading, alertDialog } = this.state;

        return (
            <div>
                <div className="header-page">
                    <Typography variant="h4" gutterBottom>
                        Stores
                    </Typography>
                </div>

                <ToolbarActions />
                {loading ? <LoadingState loading={loading} /> : null}
                <div className={classes.cardList}>
                    {stores && stores.map(({ id, name, channel, authorized, logo = Utils.urlLogo(channel) }) => (
                        <Card className={classes.card} key={name}>
                            <CardHeader
                                avatar={logo ?
                                    <Avatar src={logo} alt="logo" aria-label="Recipe" className={classes.avatar} /> : null
                                }
                                title={name}
                                subheader={Utils.fullChannelName(channel)}
                            />
                            <CardActions className={classes.actions}>
                                {authorized ? <Tooltip title="unauthorize"><IconButton aria-label="unauthorize" onClick={this.handleUnAuthorization.bind(this, id)}>
                                    <BlockIcon />
                                </IconButton></Tooltip> :
                                    <Tooltip title="authorize"><IconButton aria-label="authorize" onClick={this.handleAuthorization.bind(this, id)}>
                                        <VerifiedUserIcon />
                                    </IconButton></Tooltip>}
                                    <Tooltip title="delete"><IconButton aria-label="delete" onClick={this.handleDeleteClick.bind(this, id, name)}>
                                        <DeleteIcon />
                                    </IconButton></Tooltip>
                            </CardActions>
                        </Card>
                    ))}
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

export default withSnackbar(withStyles(styles)(Stores));
