import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Paper from '@material-ui/core/Paper';
import classNames from 'classnames';
import moment from 'moment';
import { withSnackbar } from 'notistack';

/* material-ui */
// core
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Checkbox from '@material-ui/core/Checkbox';
// our
import API from '../../Utils/api';
import LoadingState from '../../Common/LoadingState';
import GenericTablePagination from '../../Common/GenericTablePagination';
import GenericTableHead from '../../Common/GenericTableHead';
import GenericErrorMessage from '../../Common/GenericErrorMessage';
import GenericTableToolBar from '../../Common/GenericTableToolBar';

const actionList = ['Filter', 'Add', 'Delete'];
const filterList = ['Integration', 'Topic'];
const selectOption = 'checkbox';

const headColumns = [
  {
    id: 'id', first: true, last: false, label: 'ID'
  },
  {
    id: 'topic', first: false, last: false, label: 'Topic'
  },
  {
    id: 'date', first: false, last: false, label: 'Date'
  },
  {
    id: 'address', first: false, last: false, label: 'Address'
  },
  {
    id: 'store', first: false, last: false, label: 'Integration'
  },
];

const styles = () => ({
  table: {
    minWidth: 700,
  },
});

/* ======= Principal Class ======= */
class WebhookList extends React.Component {
  state = {
    loading: true,
    webhooks: { data: [], pagination: {} },
    limit: 5,
    page: 0,
    success: true,
    messageError: '',
    selected: [],
  };

  componentDidMount() {
    this.callAPI();
  }

  getAPIwebhooks(params) {
    API.get('/webhooks', { params }).then(response => {
      this.setState({ webhooks: get(response, 'data', { data: [], pagination: {} }), limit: get(response, 'data.pagination.limit', 0) });
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
      limit
    };

    this.getAPIwebhooks(params);
  };

  deleteAPIwebhook = (id) => {
    const { enqueueSnackbar } = this.props;
    API.get(`/webhooks/${id}/destroy`).then(() => {
      enqueueSnackbar('Webhook deleted successfully', { variant: 'success' });
      this.callAPI();
    }).catch((error) => {
      enqueueSnackbar(error, { variant: 'error' });
    });
  }

  handleDeleteBlock = (Ids) => () => {
    Ids.map(id => (
      this.deleteAPIwebhook(id)
    ));
    this.setState({ selected: [] });
  }

  handleChangePage = (event, page) => {
    this.setState({ page }, this.callAPI);
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ limit: parseInt(event.target.value, 10) }, this.callAPI);
  };

  handleAddWebhookClick = () => {
    const { history } = this.props;
    history.push('/app/settings/webhooks-list/create-webhook');
  }

  handleSearchClick = (currentTerm, filters) => {
    const { limit, page } = this.state;
    const params = {
      offset: page * limit,
      limit,
      term: currentTerm,
      integration_id: filters.Integration,
      topic: filters.Topic,
    };

    this.setState({ loading: true });
    this.getAPIwebhooks(params);
  };

  isSelected = id => get(this.state, 'selected', []).includes(id);

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
        selected.slice(selectedIndex + 1)
      );
    }

    this.setState({ selected: newSelected });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({
        selected: get(state, 'webhooks.data', []).map(row => row.id)
      }));
      return;
    }
    this.setState({ selected: [] });
  };

  render() {
    const { classes } = this.props;
    const { pagination, data } = get(this.state, 'webhooks', { data: [], pagination: {} });
    const {
      loading,
      limit,
      page,
      success,
      messageError,
      selected,
    } = this.state;

    const count = get(pagination, 'total', 0);

    return (
      <Paper>
        <div className="item-padding">
          {loading ? <LoadingState loading={loading} /> : null}
          {loading ? null : !success ? (
            <GenericErrorMessage messageError={messageError} />
          ) : (
            <Fragment>
              <div className={classes.rootTable}>
                <GenericTableToolBar
                  numSelected={selected.length}
                  rowCount={count > limit ? limit : count}
                  actionList={actionList}
                  onSearchFilterClick={this.handleSearchClick}
                  filterList={filterList}
                  onAdd={this.handleAddWebhookClick}
                  initialText="Showing the created webhooks."
                  onDelete={this.handleDeleteBlock(selected)}
                />
                <Table className={classNames(classes.table, classes.hover)}>
                  <GenericTableHead
                    rowCount={count > limit ? limit : count}
                    headColumns={headColumns}
                    numSelected={selected.length}
                    handleClick={this.handleSelectAllClick}
                    selectOption={selectOption}
                  />
                  <TableBody>
                    {data && data.map(row => {
                      const isSelected = this.isSelected(get(row, 'id', -1));
                      return (
                        <TableRow
                          hover
                          key={get(row, 'id', 0)}
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={-1}
                          selected={isSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isSelected}
                              onClick={event => this.handleClick(event, get(row, 'id', null))}
                            />
                          </TableCell>
                          <TableCell align="left" component="th" scope="row">
                            {get(row, 'id', 0)}
                          </TableCell>
                          <TableCell align="center">{get(row, 'topic', null)}</TableCell>
                          <TableCell align="center">
                            {
                              get(row, 'updated_at', null) != null
                                ? (moment(row.updated_at).format('Y-MM-DD H:mm:ss')
                                ) : (
                                  '--'
                                )
                            }
                          </TableCell>
                          <TableCell align="center">{get(row, 'address', null)}</TableCell>
                          <TableCell align="center">{get(row, 'integration.name', null)}</TableCell>
                        </TableRow>
                      );
                    })}
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
            </Fragment>
          )
          }
        </div>
      </Paper>
    );
  }
}
WebhookList.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default withSnackbar(withStyles(styles)(WebhookList));
