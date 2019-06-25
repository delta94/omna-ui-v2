import React, { Component } from 'react';
import PropTypes from 'prop-types';
import API from './../Utils/api';
import LoadingState from './../Common/LoadingState';
import classNames from 'classnames';
import get from 'lodash/get';
import {PapperBlock} from 'dan-components';

/* material-ui */
// core
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import IconButton from '@material-ui/core/IconButton';
// icons
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import VisibilityIcon from '@material-ui/icons/Visibility';


const headColumns = [
  { id: 'number', numeric: true, header: true, disablePadding: true, label: 'Number' },
  { id: 'store', numeric: false, header: false, disablePadding: false, label: 'Store' },
  { id: 'channel', numeric: false, header: false, disablePadding: false, label: 'Channel' },
  { id: 'date', numeric: false, header: false, disablePadding: false, label: 'Date' },
  { id: 'status', numeric: false, header: false, disablePadding: false, label: 'Status' },
  { id: 'total', numeric: true, header: false, disablePadding: false, label: 'Total' },
  { id: 'action', numeric: false, header: true, disablePadding: false, label: 'Action' },
];

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing.unit * 2,
  },
  table: {
    minWidth: 700,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
});

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
    );
  };

  render() {
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
);

function OrdersTableHead(props) {
  return (
    <TableHead>
      <TableRow>
        {headColumns.map(row => (
          <TableCell
            key={row.id}
            align={row.header ? 'center' : 'left'}
            padding={row.disablePadding ? 'none' : 'default'}
          >
            {row.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

class OrderList extends Component {

  state = {
    loading: true,
    orders: { data: [], pagination: {} },
    limit: 5,
    page: 0
  }

  componentDidMount() {
    this.callAPI();
  }

  getAPIorders(params) {
    API.get(`/orders`, { params: params }).then(response => {
      this.setState({ orders: response.data, loading: false });
    }).catch((error) => {
      // handle error
      console.log(error);
    }).then(() => {
      this.setState({ loading: false });
    });
  }

  callAPI = () => {
    const { limit, page } = this.state;
    const params = {
      offset: page * limit,
      limit: limit
    };

    this.getAPIorders(params);
  }

  handleChangePage = (event, page) => {
    this.setState({ page: page }, this.callAPI);
  }

  handleChangeRowsPerPage = (event) => {
    this.setState({ limit: parseInt(event.target.value) }, this.callAPI);
  };

  onRowClick = (store_id, number) => () => {
    this.setState({ selectedRow: number });
    this.props.history.push(`/orders/${store_id}/${number}`);
  };

  render() {
    const { classes } = this.props;
    const { pagination, data } = this.state.orders;
    const { loading, limit, page } = this.state;

    var count = get(pagination, "total", 0);

    return (
      <div>
        <PapperBlock icon={false}>
          <div>

            {loading ? <LoadingState loading={loading} /> : null}
            {loading ? null :
              <Paper className={classes.root}>
                <div className={classes.tableWrapper}>
                  <Table className={classes.table} aria-labelledby="tableTitle">
                    <OrdersTableHead
                      rowCount={limit}
                    />
                    <TableBody>
                      {data && data.map(row => (
                        <TableRow hover key={get(row, "number", 0)} selected={this.state.selectedRow === get(row, "number", 0)}>
                          <TableCell onClick={this.onRowClick(get(row, "store.id", 0), get(row, "number", 0))} component="th" scope="row">
                            {get(row, "number", 0)}
                          </TableCell>
                          <TableCell onClick={this.onRowClick(get(row, "store.id", 0), get(row, "number", 0))}>{get(row, "store.name", null)}</TableCell>

                          <TableCell onClick={this.onRowClick(get(row, "store.id", 0), get(row, "number", 0))}>{get(row, "store.channel", null)}</TableCell>
                          <TableCell onClick={this.onRowClick(get(row, "store.id", 0), get(row, "number", 0))}>{get(row, "created_date", null)}</TableCell>
                          <TableCell onClick={this.onRowClick(get(row, "store.id", 0), get(row, "number", 0))}>{get(row, "status", null)}</TableCell>
                          <TableCell onClick={this.onRowClick(get(row, "store.id", 0), get(row, "number", 0))}>{get(row, "total_price", null)}</TableCell>
                          <TableCell align="center" onClick={this.onRowClick(get(row, "store.id", 0), get(row, "number", 0))}>
                            <VisibilityIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                          </TableCell>
                        </TableRow>
                      ))}
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
                          ActionsComponent={TablePaginationActionsWrapped}
                        />
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              </Paper>
            }
          </div>

        </PapperBlock>
      </div>
    );
  }

}
OrderList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OrderList);
