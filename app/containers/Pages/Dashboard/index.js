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
    limit: 100,
    page: 0,
    loading: false
  };

  componentDidMount() {
    this.callAPI();
  }

  // componentDidUpdate(prevProps) {
  //   const { reloadLandingPage, changeReloadLandingPage } = this.props;
  //   if (
  //     reloadLandingPage &&
  //     reloadLandingPage === prevProps.reloadLandingPage
  //   ) {
  //     changeReloadLandingPage(false);
  //     this.callAPI();
  //   }
  // }

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

  callAPI = () => {
    const { limit, page } = this.state;
    const params = {
      offset: page * limit,
      limit
    };

    this.setState({ loading: true });
    this.getProducts(params);
    this.getOrders(params);
  };

  render() {
    const { orders, products, loading } = this.state;

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
        <PerformanceChartWidget orders={orders} products={products} />
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
  enqueueSnackbar: PropTypes.func
};

export default withSnackbar(Dashboard);
