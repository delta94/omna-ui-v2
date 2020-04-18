import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withSnackbar } from 'notistack';
import get from 'lodash/get';
// material-ui
import { withStyles } from '@material-ui/core/styles';
import {
  Grid,
  Table,
  TableRow,
  TableFooter,
  TablePagination
} from '@material-ui/core';
import { Loading } from 'dan-components';
import AlertDialog from 'dan-containers/Common/AlertDialog';
import GenericTablePagination from 'dan-containers/Common/GenericTablePagination';
import PageHeader from 'dan-containers/Common/PageHeader';
import { getChannels } from 'dan-actions/integrationActions';
import Integration from '../Integration';
import IntegrationForm from '../IntegrationForm';

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
  background: {
    backgroundColor: theme.palette.background.paper
  }
});

class ChannelList extends Component {
  state = {
    openForm: false,
    channel: {},
    alertDialog: {
      open: false,
      integrationId: '',
      integrationName: '',
      message: ''
    },
    limit: 5,
    page: 0,
    searchTerm: ''
  };

  async componentDidMount() {
    this.initializeDataTable();
  }

  handleDialogCancel = () => {
    this.setState({ alertDialog: false });
  };

  handleDialogConfirm = async () => {
    this.setState({ alertDialog: false });
  };

  handleChangePage = (e, page) => {
    this.setState({ page });
    this.makeRequest();
  };

  makeRequest = () => {
    const { onGetChannels } = this.props;
    const { limit, page, searchTerm } = this.state;
    const params = {
      offset: page * limit,
      limit,
      term: searchTerm
    };
    onGetChannels(params);
  };

  handleChangeRowsPerPage = event => {
    this.setState(
      { limit: parseInt(event.target.value, 10) },
      this.makeRequest
    );
  };

  handleCloseForm = () => {
    this.setState({ openForm: false });
  };

  handleAddIntegrationClick = (event, channel) => {
    this.setState({ channel });
    this.setState({ openForm: true });
  };

  initializeDataTable() {
    this.makeRequest();
  }

  render() {
    const { classes, history, channels, loading } = this.props;
    const { alertDialog, channel, limit, openForm, page } = this.state;

    const { pagination, data } = channels;
    const count = get(pagination, 'total', 0);

    return (
      <div>
        <PageHeader title="Channels" history={history} />
        {loading ? <Loading /> : null}
        <div>
          <Grid container spacing={2}>
            {data &&
              data.map(chan => (
                <Grid item md={3} xs={12}>
                  <Integration
                    key={chan.id}
                    name={chan.name}
                    group={chan.group}
                    classes={classes}
                    noActions
                    handleAddIntegration={event =>
                      this.handleAddIntegrationClick(event, chan)
                    }
                  />
                </Grid>
              ))}
          </Grid>
          <Table>
            <TableFooter>
              <TableRow>
                <TablePagination
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
        </div>

        <AlertDialog
          open={alertDialog.open}
          message={alertDialog.message}
          handleCancel={this.handleDialogCancel}
          handleConfirm={this.handleDialogConfirm}
        />

        <IntegrationForm
          channel={channel.name}
          classes={classes}
          handleClose={this.handleCloseForm}
          open={openForm}
        />
      </div>
    );
  }
}

ChannelList.propTypes = {
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  channels: PropTypes.array.isRequired,
  onGetChannels: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  loading: state.getIn(['integration', 'loading']),
  channels: state.getIn(['integration', 'channels'])
});

const mapDispatchToProps = dispatch => ({
  onGetChannels: query => dispatch(getChannels(query))
});

const ChannelsMapped = withSnackbar(
  withStyles(styles)(ChannelList)
);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChannelsMapped);
