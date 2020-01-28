import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createMuiTheme, withStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import ThemePallete from 'dan-api/palette/themePalette';
import blue from '@material-ui/core/colors/blue';
import {
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  CartesianAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import moment from 'moment';
import LoadingState from '../../Common/LoadingState';
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
  
  render() {
    const { classes, orders, loading } = this.props;
    const { data } = orders;

    const collection = data.map(item => ({
      ...item,
      day: item.updated_date
        .split('-')
        .reverse()
        .join('-'),
      month: moment(item.updated_date).format('MMM')
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

    for (let i = 0; i < 12; i += 1) {
      const month = moment(i + 1, 'M').format('MMM');
      if (sumPerMonth[i] == null) {
        sumPerMonth[i] = { month, total_price: 0 };
      }
    }

    return (
      <Fragment>
        {loading ? (
          <div className="item-padding">
            <LoadingState loading={loading} text="Loading" />
          </div>
        ) : data.length === 0 ? null : (
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
                  label="Total price"
                  fillOpacity="0.8"
                  fill={color.main}
                  stroke="none"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </Fragment>
    );
  }
}

CompossedLineBarArea.propTypes = {
  classes: PropTypes.object.isRequired,
  reloadLandingPage: PropTypes.bool.isRequired,
  changeReloadLandingPage: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  reloadLandingPage: state.getIn(['tenant', 'reloadLandingPage']),
  ...state
});

const mapDispatchToProps = dispatch => ({
  changeReloadLandingPage: bindActionCreators(setReloadLandingPage, dispatch)
});

const CompossedLineBarAreaMaped = connect(
  mapStateToProps,
  mapDispatchToProps
)(CompossedLineBarArea);

export default withStyles(styles)(CompossedLineBarAreaMaped);
