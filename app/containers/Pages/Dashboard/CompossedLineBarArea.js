import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import get from 'lodash/get';
import { createMuiTheme, withStyles } from '@material-ui/core/styles';
import ThemePallete from 'dan-api/palette/themePalette';
import blue from '@material-ui/core/colors/blue';
import Loading from 'dan-components/Loading';
import {
  ComposedChart,
  // Line,
  Area,
  // Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  CartesianAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import moment from 'moment';
import api from '../../Utils/api';
import { setReloadLandingPage } from '../../../actions/TenantActions';

const styles = {
  chartFluid: {
    width: '100%',
    minWidth: 500,
    height: 450
  }
};

const theme = createMuiTheme(ThemePallete.yellowCyanTheme);
const color = {
  main: theme.palette.primary.main,
  maindark: theme.palette.primary.dark,
  secondary: theme.palette.secondary.main,
  third: blue[500]
};

class CompossedLineBarArea extends Component {
  state = {
    orders: { data: [], pagination: {} },
    limit: 100,
    page: 0,
    loading: false
  };

  componentDidMount() {
    this.callAPI();
  }

  componentDidUpdate(prevProps) {
    const { reloadLandingPage, changeReloadLandingPage } = this.props;
    if (reloadLandingPage && reloadLandingPage === prevProps.reloadLandingPage) {
      changeReloadLandingPage(false);
      this.callAPI();
    }
  }

  getOrders(params) {
    this.setState({ loading: true });
    api.get('/orders', { params })
      .then(response => {
        this.setState({
          orders: get(response, 'data', { data: [], pagination: {} }),
          limit: get(response, 'data.pagination.limit', 0)
        });
      })
      .catch(error => {
        console.log(error);
      }).then(() => {
        this.setState({ loading: false });
      });
  }

  callAPI = () => {
    const { limit, page } = this.state;
    const params = {
      offset: page * limit,
      limit
    };

    this.getOrders(params);
  };

  render() {
    const { classes } = this.props;
    const { orders, loading } = this.state;
    const { data } = orders;

    const collection = data.map(x => ({
      ...x,
      day: x.updated_date
        .split('-')
        .reverse()
        .join('-'),
      month: moment(x.updated_date).format('MMM')
    }));

    const mapDayToMonth = collection.map(x => ({
      ...x,
      day: new Date(x.updated_date).getMonth()
    }));

    const sumPerMonth = mapDayToMonth.reduce((acc, cur) => {
      const obj = {};
      obj.month = cur.month;
      const previousPrice = acc[cur.day];
      let currentPrice = Number(cur.total_price);
      if (previousPrice) currentPrice += Number(previousPrice.total_price);

      obj.total_price = currentPrice;

      return Object.assign(acc, {
        [cur.day]: obj // new values will overwrite same old values
      });
    }, []);

    return (
      <Fragment>
        {loading && <Loading />}
        <div className={classes.chartFluid}>
          <ResponsiveContainer>
            <ComposedChart
              width={800}
              height={450}
              data={sumPerMonth}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
              }}
            >
              <XAxis dataKey="month" tickLine={false} />
              <YAxis
                axisLine={false}
                tickSize={3}
                tickLine={false}
                tick={{ stroke: 'none' }}
              />
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <CartesianAxis vertical={false} />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="total_price"
                fillOpacity="0.8"
                fill={color.main}
                stroke="none"
              />
              {/* <Bar dataKey="pv" barSize={60} fillOpacity="0.8" fill={color.secondary} />
          <Line type="monotone" dataKey="uv" strokeWidth={4} stroke={color.third} /> */}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Fragment>
    );
  }
}

CompossedLineBarArea.propTypes = {
  classes: PropTypes.object.isRequired,
  reloadLandingPage: PropTypes.bool.isRequired,
  changeReloadLandingPage: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  reloadLandingPage: state.getIn(['tenant', 'reloadLandingPage']),
  ...state,
});

const mapDispatchToProps = (dispatch) => ({
  changeReloadLandingPage: bindActionCreators(setReloadLandingPage, dispatch)
});

const CompossedLineBarAreaMaped = connect(
  mapStateToProps,
  mapDispatchToProps
)(CompossedLineBarArea);

export default withStyles(styles)(CompossedLineBarAreaMaped);
