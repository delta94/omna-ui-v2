import React from 'react';
import PropTypes from 'prop-types';
import API from './../Utils/api';
import LoadingState from './../Common/LoadingState';
import GenericTableToolBar from './../Common/GenericTableToolBar';
import GenericTablePagination from './../Common/GenericTablePagination';
import GenericTableHead from './../Common/GenericTableHead';
import AlertDialog from './../Common/AlertDialog';
import get from 'lodash/get';
import { Link } from 'react-router-dom';
import {PapperBlock} from 'dan-components';

/* material-ui */
// core
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
// icons
import ScheduleIcon from '@material-ui/icons/Schedule';
import ReportProblemIcon from '@material-ui/icons/ReportProblem';
import PlayIcon from '@material-ui/icons/PlayCircleOutline';
import DetailsIcon from '@material-ui/icons/Visibility';

const actionList = [ 'Delete' ];
const selectOption = 'checkbox';
const headColumns = [
    { id: 'task', numeric: false, header: false, disablePadding: false, label: 'Showing Tasks' },
];

const styles = theme => ({
    root: {
      marginTop: theme.spacing.unit * 3,
      overflowX: 'auto',
    },
    error: {
        color: 'red',
    },
    warning: {
        color: 'yellow',
    },
    green: {
        color: 'green',
    },
    gray: {
        color: 'gray',
    },
    paper: {
      marginBottom: theme.spacing.unit * 2,
    },
    marginLeft: {
        marginLeft: theme.spacing.unit,
    },
    tableWrapper: {
      overflowX: 'auto',
    },
  });

/* ======= Principal Class ======= */
class TaskList extends React.Component {

    state = {
      loading: true,
      tasks: { data: [], pagination: {} },
      limit: 5,
      page: 0,
      selected: [],
      success: true,
      messageError: '',
      alertDialog: {
          open: false,
          message: '',
          id: -1,
      },
    }

    componentDidMount() {
      this.callAPI();
    }

    getAPItasks = (params) => {
      API.get(`/tasks`, { params: params }).then(response => {
        this.setState({ tasks: get(response, "data", { data: [], pagination: {} }), limit: get(response, "data.pagination.limit", 0) });
      }).catch((error) => {
        // handle error
        console.log(error);
        this.setState({ success: false, messageError: error.message });
      }).finally(() => {
        this.setState({ loading: false });
      });
    }

    callAPI = () => {
      const { limit, page } = this.state;
      const params = {
        offset: page * limit,
        limit: limit
      };

      this.getAPItasks(params);
    }

    reRunTaskAPI = (id) => {
        API.get(`/tasks/${id}/retry`).then(response => {
            this.props.enqueueSnackbar('Item re-running successfully', {
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

    handleSelectAllClick = (event) => {
        if (event.target.checked) {
            this.setState(state => ({ selected: get(state, "tasks.data", []).map(row => row.id) }));
            return;
        }
        this.setState({ selected: [] });
    }

    handleClick = (event, id) => {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({ selected: newSelected });
    }

    handleChangePage = (event, page) => {
        this.setState({ page: page }, this.callAPI);
    }

    handleChangeRowsPerPage = (event) => {
        this.setState({ limit: parseInt(event.target.value) }, this.callAPI);
    };

    verifyNotifications = (notifications) => {
        var result = "";
        notifications.map(n => (
            result = (n.type === "error" ? "error" : (n.type === "warning" && result !== "error") ? "warning" : "info")
        ))
        return result;
    }

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    handleAlertClick = (id) => {
        this.setState({alertDialog: {
            open: true,
            id: id,
            message: `Are you sure you want to "re-run" the ${id} task?`
        }});
    }

    handleDialogCancel = () => {
        this.setState({alertDialog: false, action: '', id: ''});
    }

    handleDialogConfirm = async () => {
        const { id } = this.state.alertDialog;
        if(id !== ''){
            //this.reRunTaskAPI(id);
            alert("Re-run task action. Remember to make this code available");
        }

        this.handleDialogCancel();
    }

    render() {
        const { classes } = this.props;
        const { loading, limit, page, selected, tasks, alertDialog, success, messageError } = this.state;
        const { pagination, data } = tasks;

        var count = get(pagination, "total", 0);

        return(
            <div>
                <PapperBlock icon={false}>
                    <div>
                        {loading ? <LoadingState loading={loading} /> : null}
                        {loading ? null :
                            !success ?
                                <div className={classes.marginLeft2u}>
                                    <Typography variant="h6" gutterBottom color="secondary">
                                        There is the following error: "{messageError}", please reload the page or tray again later.
                                    </Typography>
                                </div>: 
                                <Paper className={classes.root}>
                                    {
                                        //********* BODY *********
                                    }
                                    {
                                    <GenericTableToolBar
                                        numSelected={selected.length}
                                        itemIDs={selected}
                                        owner="tasks"
                                        rowCount={count > limit ? limit : count}
                                        actionList={actionList}
                                    />
                                    }
                                    <div className={classes.tableWrapper}>
                                        <Table aria-labelledby="tableTitle">
                                            <GenericTableHead
                                                numSelected={selected.length}
                                                handleClick={this.handleSelectAllClick}
                                                rowCount={count > limit ? limit : count}
                                                selectOption={selectOption}
                                                headColumns={headColumns}
                                            />
                                            <TableBody>
                                                {
                                                    data && data.map(row => {
                                                        const isSelected = this.isSelected(get(row, "id", null));
                                                        const notifications = this.verifyNotifications(get(row, "notifications", []));
                                                        const status = get(row, "status", "");
                                                        return (
                                                            <TableRow
                                                                hover

                                                                role="checkbox"
                                                                aria-checked={isSelected}
                                                                tabIndex={-1}
                                                                key={row.id}
                                                                selected={isSelected}
                                                            >
                                                                <TableCell padding="checkbox"> <Checkbox checked={isSelected} onClick={event => this.handleClick(event, get(row, "id", null))} /> </TableCell>
                                                                <TableCell>
                                                                    <div className="display-flex justify-content-space-between">
                                                                        <div>
                                                                            <div>
                                                                                <Typography variant="subtitle2">
                                                                                    <strong>{get(row, "id", null)}</strong>
                                                                                </Typography>
                                                                            </div>
                                                                            <div className={classes.marginLeft}>
                                                                                <Typography variant="subtitle2" color="primary">
                                                                                    {get(row, "description", "")}
                                                                                </Typography>
                                                                            </div>
                                                                        </div>
                                                                        <div className="justify-content-flex-end">
                                                                            <Button variant="text" size="small" color="inherit">
                                                                                {get(row, "executions", []).length} Executions
                                                                            </Button>
                                                                            <Button variant="text" size="small" color="inherit">
                                                                                Progress {get(row, "progress", 0)}%
                                                                            </Button>
                                                                            <Tooltip title="Status">
                                                                                <Button variant="text" size="small" className={status === "failed" ? classes.error : status === "completed" ? classes.green : classes.gray}>
                                                                                    {status}
                                                                                </Button>
                                                                            </Tooltip>
                                                                            {
                                                                                notifications === "error" ?
                                                                                <Tooltip title="This Task has Error Notifications">
                                                                                    <IconButton aria-label="Notifications" className={classes.error}>
                                                                                        <ReportProblemIcon />
                                                                                    </IconButton>
                                                                                </Tooltip>
                                                                                : notifications === "warning" ?
                                                                                    <Tooltip title="This Task has Warning Notifications">
                                                                                        <IconButton aria-label="Notifications" className={classes.warning}>
                                                                                            <ReportProblemIcon />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                : null
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                    <div className="display-flex justify-content-space-between align-items-baseline">
                                                                        <div className="display-flex justify-content-space-between justify-content-flex-start align-items-baseline">
                                                                            <Button variant="text" color="inherit" className={classes.button} component={Link} to={`/app/settings/tasks/${get(row, "id", null)}`}>
                                                                                View Details
                                                                                <DetailsIcon className={classes.rightIcon} />
                                                                            </Button>
                                                                            {
                                                                                status === "failed" ?
                                                                                    <Tooltip title="You Can Re-run the Task">
                                                                                        <Button variant="text" color="secondary" className={classes.button} onClick={this.handleAlertClick.bind(this, get(row, "id", null))}>
                                                                                            Run Task
                                                                                            <PlayIcon className={classes.rightIcon} />
                                                                                        </Button>
                                                                                    </Tooltip> : null
                                                                            }
                                                                        </div>
                                                                        <div className="justify-content-flex-end">
                                                                            <div className="display-flex justify-content-space-between align-items-baseline">
                                                                                <Typography variant="caption">
                                                                                    <strong>Updated at: </strong>{get(row, "updated_at", null)}
                                                                                </Typography>
                                                                                {row.scheduler ?
                                                                                    <Tooltip title="This Task has a Schedule">
                                                                                        <IconButton aria-label="Schedule">
                                                                                            <ScheduleIcon />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                    : null}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    })
                                                }
                                            </TableBody>
                                            <TableFooter>
                                                <TableRow>
                                                    <TablePagination
                                                        colSpan={5}
                                                        rowsPerPageOptions={[5, 10, 25, 50]}
                                                        count={count}
                                                        rowsPerPage={limit}
                                                        page={page}
                                                        SelectProps={{
                                                            native: true,
                                                        }}
                                                        onChangePage={this.handleChangePage}
                                                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                                        ActionsComponent={GenericTablePagination}
                                                    />
                                                </TableRow>
                                            </TableFooter>
                                        </Table>
                                    </div>
                                </Paper>
                        }
                    </div>
                    <AlertDialog
                        open={alertDialog.open}
                        message={alertDialog.message}
                        handleCancel={this.handleDialogCancel}
                        handleConfirm={this.handleDialogConfirm}
                    />
                </PapperBlock>
            </div>
        );
      }
}

TaskList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TaskList);
