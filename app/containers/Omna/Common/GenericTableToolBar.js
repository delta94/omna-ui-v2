import React from 'react';
import PropTypes from 'prop-types';
import API from '../Utils/api';
import AlertDialog from './AlertDialog';
import classNames from 'classnames';
import { withSnackbar } from 'notistack';

/* material-ui */
// core
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import { lighten } from '@material-ui/core/styles/colorManipulator';
// icons
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    spacer: {
        flex: '1 1 100%',
    },
    actions: {
        color: theme.palette.text.secondary,
    },
    title: {
        flex: '0 0 auto',
    },
});

class GenericTableToolbar extends React.Component {

    state = {
        alertDialog: {
            open: false,
            itemIDs: [],
            owner: '',
            message: '',
            action: ''
        }
    };

    deleteAPIgeneric = (owner, id) => {
        API.get(`/${owner}/${id}/destroy`).then(response => {
            this.props.enqueueSnackbar('Item deleted successfully', {
                variant: 'success'
            });
        }).catch((error) => {
            this.props.enqueueSnackbar(error, {
                variant: 'error'
            });
        }).finally(() => {
            this.setState({ alertDialog: false });
        });
    }

    handleAlertClick = (ids, action, owner) => {
        this.setState({alertDialog: {
            open: true,
            itemIDs: ids,
            action: action,
            owner: owner,
            message: `Are you sure you want to "${action}" the selected items?`
        }});
    }

    handleDialogCancel = () => {
        this.setState({alertDialog: false, action: ''});
    }

    handleDialogConfirm = async () => {
        const { itemIDs, action, owner } = this.state.alertDialog;

        if(action === "remove"){
            //itemIDs.map(id => ( this.deleteAPIgeneric(owner, id) ));
            alert(`Remove action for ${owner}. Remember to make this code available`);
        }
        else if(action === "edit"){
            //itemIDs.map(p => ( this.editAPIgeneric(p) ));
            alert(`Edit action for ${owner}. Remember to make this code available`);
        }
        else if(action === "make unavailable"){
            //itemIDs.map(p => ( this.unavailableAPIgeneric(p) ));
            alert(`Make unavailable for ${owner}. Remember to make this code available`);
        }
        else if(action === "make available"){
            //itemIDs.map(p => ( this.availabletAPIgeneric(p) ));
            alert(`Make available for ${owner}. Remember to make this code available`);
        }

        this.handleDialogCancel();
    }

    render(){

        const { itemIDs, numSelected, classes, rowCount, owner, actionList } = this.props;
        const { alertDialog } = this.state;

        return (
            <Toolbar className={classNames(classes.root, { [classes.highlight]: numSelected > 0, })}>
                <div className={classes.title}>
                    {numSelected > 0 ? (
                        <Typography color="inherit" variant="subtitle1">
                            {numSelected} selected. {
                                numSelected === rowCount ?
                                    "All items on this page are selected."
                                    : null
                                }
                        </Typography>
                    ) : "There are no selected items"}
                </div>
                <div className={classes.spacer} />
                <div className={classes.actions}>
                    {numSelected > 0 ? (
                        <div className="display-flex justify-content-space-between">
                            {
                                // Actions: [ Delete, Edit, Available, Unavailable ]
                                actionList && actionList.map(act => (
                                    (act === "Delete") ?
                                        <Tooltip title="Delete"  key="delete">
                                            <IconButton aria-label="Delete" onClick={this.handleAlertClick.bind(this, itemIDs, "remove", owner)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip> :
                                            (act === "Edit") ?
                                                 <Tooltip title="Edit" key="edit">
                                                    <IconButton aria-label="Edit" onClick={this.handleAlertClick.bind(this, itemIDs, "edit", owner)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </Tooltip> :
                                                    (act === "Available") ?
                                                        <Tooltip title="Available" key="available">
                                                            <IconButton aria-label="Available" onClick={this.handleAlertClick.bind(this, itemIDs, "make available", owner)}>
                                                                <VisibilityIcon />
                                                            </IconButton>
                                                        </Tooltip> :
                                                            (act === "Unavailable") ?
                                                                <Tooltip title="Unavailable" key="unavailable">
                                                                    <IconButton aria-label="Unavailable" onClick={this.handleAlertClick.bind(this, itemIDs, "make unavailable", owner)}>
                                                                        <VisibilityOffIcon />
                                                                    </IconButton>
                                                                </Tooltip> :
                                                                    null
                                ))
                            }
                        </div>
                    ) : null}
                </div>
                <AlertDialog
                    open={alertDialog.open}
                    message={alertDialog.message}
                    handleCancel={this.handleDialogCancel}
                    handleConfirm={this.handleDialogConfirm}
                />
            </Toolbar>
        );
    }
};

GenericTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    rowCount: PropTypes.number.isRequired,
    owner: PropTypes.string.isRequired,
    actionList: PropTypes.array.isRequired,
    itemIDs: PropTypes.array.isRequired,
};

export default withSnackbar(withStyles(toolbarStyles)(GenericTableToolbar));
