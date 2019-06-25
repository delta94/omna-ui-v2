import React, { Component } from 'react';
import { Utils } from '../../common/Utils';
import API from '../../../utils/api';
import { withSnackbar } from 'notistack';
import LoadingState from '../../common/LoadingState';

//material-ui
import { withStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';


const styles = theme => ({
    inputWidth: {
        width: '300px',
    }
})

class AddStoreForm extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        store: '',
        channel: '',
        authorized: true,
        active: true,
        errors: {},
        message: {
            open: false,
            text: ''
        },
        loadingState: false,
        channels: []
    }

    componentDidMount(){
        this.getChannels();
    }

    getChannels() {
        API.get(`/channels/options`).then(response => {
            this.setState({ channels: response.data, loadingState: false });
        }).catch((error) => {
            // handle error
            console.log(error);
        }).then(() => {
            this.setState({ loadingState: false });
        });
    }

    onInputChange = (e) => { this.setState({ [e.target.name]: e.target.value }) }

    onCheckBoxChange = (e) => { this.setState({ [e.target.name]: e.target.checked }) };

    onSubmit = (e) => {
        e.preventDefault();
        const { store: name, channel, authorized } = this.state;

        // validate form
        if (!name) {
            this.setState({ errors: { store: 'store is required' } });
        }
        else {
            if (!channel) {
                this.setState({ errors: { channel: 'channel is required' } });
            }
            else {
                this.setState({ loadingState: true });
                API.post(`/stores`, { data: { "name": name, "channel": channel } }).then(response => {
                    this.props.enqueueSnackbar('Store created successfully', {
                        variant: 'success'
                    });
                    this.props.history.goBack();
                    if (authorized) {
                        this.handleAuthorization(name);
                    }
                }).catch((error) => {
                    if (error && error.response.data.message) {
                        this.props.enqueueSnackbar(error.response.data.message, {
                            variant: 'error'
                        });;
                    }
                }).then(() => {
                    this.setState({ loadingState: false });
                });

            }
        }

    }

    handleAuthorization = (id) => {
        window.location.replace(`${Utils.baseAPIURL}/stores/${id}/authorize?redirect_id=${Utils.uri4Back2SPA}`);
    }

    handleOnCloseNotificationMessages = () => {
        this.setState({ message: { open: false, text: '' } });
    }

    render() {

        const { classes } = this.props;

        const { store, channel, channels, authorized, errors, loadingState } = this.state;

        return (

            <div>
                <Typography variant="h4" gutterBottom>
                    Add Store
                </Typography>

                <form onSubmit={this.onSubmit} className="display-flex flex-direction-column" noValidate autoComplete="off">
                    <TextField
                        required
                        id="name"
                        label="Store"
                        value={store}
                        name="store"
                        placeholder="mystore.lazada.sg"
                        onChange={this.onInputChange}
                        margin="normal"
                        variant="outlined"
                        className={classes.inputWidth}
                        error={errors.store ? true : false}
                        helperText={errors.store}
                    />


                    <TextField
                        required
                        id="channel"
                        select
                        label="Channel"
                        value={channel}
                        name="channel"
                        onChange={this.onInputChange}
                        SelectProps={{
                            MenuProps: {
                                className: classes.inputWidth
                            },
                        }}
                        margin="normal"
                        variant="outlined"
                        className={classes.inputWidth}
                        error={errors.channel ? true : false}
                        helperText={errors.channel}
                    >
                        {channels && channels.data && channels.data.map(option => (
                            <MenuItem key={option.name} value={option.name}>
                                {option.title}
                            </MenuItem>
                        ))}
                    </TextField>

                    <FormControlLabel
                        control={
                            <Checkbox name="authorized" checked={authorized} onChange={this.onCheckBoxChange} value="authorized" color="default" />
                        }
                        label="Authorized"
                    />

                    <div className={classes.inputWidth}>
                        {loadingState ? <LoadingState loading={true} /> :
                            <Button variant="contained" type="submit" color="primary" className={classes.inputWidth}>
                                Add
                                </Button>}
                    </div>
                </form>
            </div>
        );
    }

}

export default withSnackbar(withStyles(styles)(AddStoreForm))
