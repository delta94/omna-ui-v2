import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import get from 'lodash/get';
import { PapperBlock } from 'dan-components';
import { withSnackbar } from 'notistack';
import api from '../../Utils/api';
import PerformanceChartWidget from './PerformanceChartWidget';
import CompossedLineBarArea from './CompossedLineBarArea';

class Dashboard extends Component {
  state = {
    orders: { data: [], pagination: {} },
    webhooks: { data: [], pagination: {} },
    workflows: { data: [], pagination: {} },
    tasks: { data: [], pagination: {} },
    limit: 5,
    page: 0,
    loading: false
  };

  componentDidMount() {
    this.callAPI();
  }

  getOrders = params => {
    const { enqueueSnackbar } = this.props;
    api
      .get('/orders', { params })
      .then(response => {
        this.setState({
          orders: get(response, 'data', { data: [], pagination: {} })
        });
      })
      .catch(error => {
        enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
          variant: 'error'
        });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  getWebhooks = params => {
    const { enqueueSnackbar } = this.props;

    api.get('/webhooks', { params })
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
        this.setState({ loading: false });
      });
  };

  getWorkflows = async params => {
    const { enqueueSnackbar } = this.props;

    try {
      const response = await api.get('/flows', { params });
      this.setState({
        workflows: get(response, 'data', { data: [], pagination: {} }),
      });
    } catch (error) {
      enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
        variant: 'error'
      });
    }

    this.setState({ isLoading: false });
  };

  getTasks = params => {
    const { enqueueSnackbar } = this.props;
    api
      .get('/tasks', { params })
      .then(response => {
        this.setState({
          tasks: get(response, 'data', { data: [], pagination: {} })
        });
      })
      .catch(error => {
        enqueueSnackbar(get(error, 'response.data.message', 'Unknown error'), {
          variant: 'error'
        });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  buildParams = () => {
    const { limit, page } = this.state;
    return {
      offset: page * limit,
      limit
    };
  };

  callAPI = () => {
    this.setState({ loading: true });
    this.getOrders(this.buildParams());
    this.getWebhooks(this.buildParams());
    this.getWorkflows(this.buildParams());
    this.getTasks(this.buildParams());
  };

  render() {
    const { workflows, orders, webhooks, tasks, loading } = this.state;

    const title = brand.name + ' - Dashboard';
    const description = brand.desc;

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
        <PerformanceChartWidget
          workflows={workflows}
          orders={orders}
          webhooks={webhooks}
          tasks={tasks}
        />

        <PapperBlock
          title="Orders Total Price / Month"
          icon="ios-stats-outline"
          desc=""
          overflowX
        >
          <CompossedLineBarArea orders={orders} loading={loading} />
        </PapperBlock>
      </div>
    );
  }
}

Dashboard.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(Dashboard);
