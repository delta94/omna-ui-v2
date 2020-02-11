import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import brand from 'dan-api/dummy/brand';
import get from 'lodash/get';
import { PapperBlock, SalesChartWidget } from 'dan-components';
import { withSnackbar } from 'notistack';
import api from '../../Utils/api';
import PerformanceChartWidget from './PerformanceChartWidget';
import CompossedLineBarArea from './CompossedLineBarArea';
import { Grid } from '@material-ui/core';

class Dashboard extends Component {
  state = {
    orders: { data: [], pagination: {} },
    webhooks: { data: [], pagination: {} },
    workflows: { data: [], pagination: {} },
    tasks: { data: [], pagination: {} },
    limit: 100,
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
        this.setState({ loading: false });
      });
  };

  getWorkflows = async params => {
    const { enqueueSnackbar } = this.props;

    try {
      const response = await api.get('/flows', { params });
      this.setState({
        workflows: get(response, 'data', { data: [], pagination: {} })
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
 
    const counts = orders.data.reduce((p, c) => {
      var name = c.integration.channel;
      if (!p.hasOwnProperty(name)) {
        p[name] = 0;
      }
      p[name]++;
      return p;
    }, {});
    
    var countsExtended = Object.keys(counts).map(k => {
      return {name: k, value: counts[k]}; });
    
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

        <Grid container spacing={2}>
          <Grid item md={8} xs={12}>
            <PapperBlock
              title="Orders Total Price / Month"
              icon="ios-stats-outline"
              desc=""
              overflowX
            >
              <CompossedLineBarArea orders={orders} loading={loading} />
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
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withSnackbar(Dashboard);
