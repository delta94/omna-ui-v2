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
    products: { data: [], pagination: {} },
    integrations: { data: [], pagination: {} },
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

  getProducts = params => {
    const { enqueueSnackbar } = this.props;
    api
      .get('/products', { params })
      .then(response => {
        this.setState({
          products: get(response, 'data', { data: [], pagination: {} })
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

  getIntegrations = params => {
    const { enqueueSnackbar } = this.props;
    api.get('/integrations', { params })
      .then(response => {
        this.setState({
          integrations: get(response, 'data', { data: [], pagination: {} })
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
  }

  getTasks = params => {
    const { enqueueSnackbar } = this.props;
    api.get('/tasks', { params })
      .then(response => {
        this.setState({
          tasks: get(response, 'data', { data: [], pagination: {} }),
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
    this.getProducts(this.buildParams());
    this.getOrders(this.buildParams());
    this.getIntegrations(this.buildParams());
    this.getTasks(this.buildParams());
  };

  render() {
    const { integrations, orders, products, tasks, loading } = this.state;

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
        <PerformanceChartWidget integrations={integrations} orders={orders} products={products} tasks={tasks} />
        
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
