import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import { PapperBlock, SalesChartWidget } from 'dan-components';
import { withSnackbar } from 'notistack';
import { getFlows } from 'dan-actions/flowActions';
import { getOrders } from 'dan-actions/orderActions';
import { getTasks } from 'dan-actions/taskActions';
import { getWebhooks } from 'dan-actions/webhookActions';
import { Grid } from '@material-ui/core';
import PerformanceChartWidget from './PerformanceChartWidget';
import CompossedLineBarArea from './CompossedLineBarArea';

class Dashboard extends Component {
  state = {
    limit: 100,
    loadingState: false
  };

  componentDidMount() {
    this.callAPI();
  }

  callAPI = () => {
    const { onGetOrders, onGetFlows, onGetTasks, onGetWebhooks } = this.props;
    this.setState({ loadingState: true });
    onGetOrders(this.buildParams());
    onGetFlows(this.buildParams());
    onGetTasks(this.buildParams());
    onGetWebhooks(this.buildParams());
  };

  buildParams = () => {
    const { limit } = this.state;
    return {
      offset: 0,
      limit
    };
  };

  render() {
    const { loadingState } = this.state;
    const {
      flows,
      loadingOrders,
      // loadingFlows,
      // loadingTasks,
      // loadingWebhooks,
      orders,
      tasks,
      webhooks
    } = this.props;

    const title = brand.name + ' - Dashboard';
    const description = brand.desc;

    const counts = orders
      .get('data')
      .toJS()
      .reduce((p, c) => {
        const name = c.integration.channel;
        const result = p;
        if (!{}.hasOwnProperty.call(result, name)) {
          result[name] = 0;
        }
        result[name] += 1;
        return result;
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
        {/* {loadingOrders || loadingFlows || loadingTasks || loadingWebhooks ? (
          <Loading />
        ) :  */}
        <PerformanceChartWidget
          flows={flows}
          orders={orders}
          webhooks={webhooks}
          tasks={tasks}
        />
        {/* } */}
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
  flows: PropTypes.object.isRequired,
  // loadingFlows: PropTypes.bool.isRequired,
  loadingOrders: PropTypes.bool.isRequired,
  // loadingTasks: PropTypes.bool.isRequired,
  // loadingWebhooks: PropTypes.bool.isRequired,
  onGetOrders: PropTypes.func.isRequired,
  onGetFlows: PropTypes.func.isRequired,
  onGetTasks: PropTypes.func.isRequired,
  onGetWebhooks: PropTypes.func.isRequired,
  orders: PropTypes.object.isRequired,
  tasks: PropTypes.object.isRequired,
  webhooks: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  flows: state.getIn(['flow', 'flows']),
  loadingFlows: state.getIn(['flow', 'loading']),
  loadingOrders: state.getIn(['order', 'loading']),
  loadingTasks: state.getIn(['task', 'loading']),
  loadingWebhooks: state.getIn(['webhook', 'loading']),
  orders: state.getIn(['order', 'orders']),
  tasks: state.getIn(['task', 'tasks']),
  webhooks: state.getIn(['webhook', 'webhooks'])
});

const mapDispatchToProps = dispatch => ({
  onGetOrders: params => dispatch(getOrders(params)),
  onGetFlows: params => dispatch(getFlows(params)),
  onGetTasks: params => dispatch(getTasks(params)),
  onGetWebhooks: params => dispatch(getWebhooks(params))
});

const DashboardMapped = withSnackbar(Dashboard);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardMapped);
