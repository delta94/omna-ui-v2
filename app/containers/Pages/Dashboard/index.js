import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import get from 'lodash/get';
import { PapperBlock, Loading, SalesChartWidget } from 'dan-components';
import { withSnackbar } from 'notistack';
import { getFlows } from 'dan-actions/flowActions';
import { getOrders } from 'dan-actions/orderActions';
import { getTasks } from 'dan-actions/taskActions';
import { Grid } from '@material-ui/core';
import api from '../../Utils/api';
import PerformanceChartWidget from './PerformanceChartWidget';
import CompossedLineBarArea from './CompossedLineBarArea';

class Dashboard extends Component {
  state = {
    webhooks: { data: [], pagination: {} },
    limit: 100,
    page: 0,
    loadingState: false
  };

  componentDidMount() {
    this.callAPI();
  }

  getWebhooks = params => {
    const { enqueueSnackbar } = this.props;

    api
      .get('/webhooks', { params })
      .then(response => {
        this.setState({
          webhooks: get(response, 'data', { data: [], pagination: {} })
        });
      })
      .catch(error => {
        enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
          variant: 'error'
        });
      })
      .finally(() => {
        this.setState({ loadingState: false });
      });
  };

  buildParams = params => {
    const { limit, page } = this.state;
    return {
      offset: page * limit,
      limit,
      params
    };
  };

  callAPI = () => {
    const { onGetOrders, onGetWorkflows, onGetTasks } = this.props;
    this.setState({ loadingState: true });
    onGetOrders(this.buildParams());
    onGetWorkflows(this.buildParams());
    onGetTasks(this.buildParams());
  };

  render() {
    const { webhooks, loadingState } = this.state;
    const {
      orders,
      flows,
      loadingOrders,
      loadingFlows,
      loadingTasks,
      tasks
    } = this.props;

    const title = brand.name + ' - Dashboard';
    const description = brand.desc;

    const counts = orders
      .get('data')
      .toJS()
      .reduce((p, c) => {
        const name = c.integration.channel;
        if (!p.hasOwnProperty(name)) {
          p[name] = 0;
        }
        p[name]++;
        return p;
      }, {});

    const countsExtended = Object.keys(counts).map(k => {
      return { name: k, value: counts[k] };
    });

    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="twitter:title" content={title} />
          <meta property="twitter:description" content={description} />
        </Helmet>
        
        {loadingOrders || loadingFlows || loadingTasks ? (
          <Loading />
        ) : (
          <PerformanceChartWidget
            workflows={flows}
            orders={orders}
            webhooks={webhooks}
            tasks={tasks}
          />
        )}

        <Grid container spacing={2}>
          <Grid item md={8} xs={12}>
            <PapperBlock
              title="Orders / Month"
              icon="ios-stats-outline"
              desc=""
              overflowX
            >
              <CompossedLineBarArea
                orders={orders}
                loading={loadingState && loadingOrders}
              />
            </PapperBlock>
          </Grid>

          <Grid item md={4} xs={12}>
            <SalesChartWidget title="Orders / Channel" data={countsExtended} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

Dashboard.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  flows: PropTypes.object.isRequired,
  loadingFlows: PropTypes.bool.isRequired,
  loadingOrders: PropTypes.bool.isRequired,
  loadingTasks: PropTypes.bool.isRequired,
  onGetOrders: PropTypes.func.isRequired,
  onGetTasks: PropTypes.func.isRequired,
  onGetWorkflows: PropTypes.func.isRequired,
  orders: PropTypes.object.isRequired,
  tasks: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  flows: state.getIn(['flow', 'flows']),
  loadingFlows: state.getIn(['flow', 'loading']),
  loadingOrders: state.getIn(['order', 'loading']),
  loadingTasks: state.getIn(['task', 'loading']),
  orders: state.getIn(['order', 'orders']),
  tasks: state.getIn(['task', 'tasks'])
});

const mapDispatchToProps = dispatch => ({
  onGetOrders: params => dispatch(getOrders(params)),
  onGetWorkflows: params => dispatch(getFlows(params)),
  onGetTasks: params => dispatch(getTasks(params))
});

const DashboardMapped = withSnackbar(Dashboard);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardMapped);
