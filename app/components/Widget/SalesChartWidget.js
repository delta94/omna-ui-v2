import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import classNames from 'classnames';
import CardGiftcard from '@material-ui/icons/CardGiftcard';
import LocalLibrary from '@material-ui/icons/LocalLibrary';
import Computer from '@material-ui/icons/Computer';
import Toys from '@material-ui/icons/Toys';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Style from '@material-ui/icons/Style';
import Typography from '@material-ui/core/Typography';
import purple from '@material-ui/core/colors/purple';
import blue from '@material-ui/core/colors/blue';
import cyan from '@material-ui/core/colors/cyan';
import pink from '@material-ui/core/colors/pink';
import colorfull from 'dan-api/palette/colorfull';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  CartesianAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import get from 'lodash/get';
// import { dataSales } from 'dan-api/chart/chartData';
import { data2 } from 'dan-api/chart/chartMiniData';
import styles from './widget-jss';
import PapperBlock from '../PapperBlock/PapperBlock';
import API from '../../containers/Omna/Utils/api';
import LoadingState from '../../containers/Omna/Common/LoadingState';
import GenericErrorMessage from '../../containers/Omna/Common/GenericErrorMessage';

const color = {
  primary: colorfull[6],
  secondary: colorfull[3],
  third: colorfull[2],
  fourth: colorfull[4]
};

const colorsPie = [purple[500], blue[500], cyan[500], pink[500]];

class SalesChartWidget extends PureComponent {
  state = {
    loading: true,
    orders: { data: [] },
    success: true,
    messageError: ''
  };

  componentDidMount() {
    this.getData();
  }

  getData() {
    API.get('/orders')
      .then(response => {
        console.log(response);
        this.setState({ orders: get(response, 'data') });
      })
      .catch(error => {
        // handle error
        console.log(error);
        this.setState({ success: false, messageError: error.message });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  render() {
    const { classes } = this.props;
    const { orders } = this.state;
    const { loading, success, messageError } = this.state;
    const { data } = orders;

    return (
      <PapperBlock
        whiteBg
        noMargin
        title="Product Sales Stats"
        icon="ios-stats-outline"
        desc=""
      >
        <Grid container spacing={16}>
          <Grid item md={8} xs={12}>
            <ul className={classes.bigResume}>
              <li>
                <Avatar
                  className={classNames(classes.avatar, classes.indigoAvatar)}
                >
                  <LocalLibrary />
                </Avatar>
                <Typography variant="h6">
                  <span className={classes.indigoText}>4321</span>
                  <Typography>Fashions</Typography>
                </Typography>
              </li>
              <li>
                <Avatar
                  className={classNames(classes.avatar, classes.tealAvatar)}
                >
                  <Computer />
                </Avatar>
                <Typography variant="h6">
                  <span className={classes.tealText}>9876</span>
                  <Typography>Electronics</Typography>
                </Typography>
              </li>
              <li>
                <Avatar
                  className={classNames(classes.avatar, classes.blueAvatar)}
                >
                  <Toys />
                </Avatar>
                <Typography variant="h6">
                  <span className={classes.blueText}>345</span>
                  <Typography>Toys</Typography>
                </Typography>
              </li>
              <li>
                <Avatar
                  className={classNames(classes.avatar, classes.orangeAvatar)}
                >
                  <Style />
                </Avatar>
                <Typography variant="h6">
                  <span className={classes.orangeText}>1021</span>
                  <Typography>Vouchers</Typography>
                </Typography>
              </li>
            </ul>
            {loading ? <LoadingState loading={loading} /> : null}
            {loading ? null : !success ? (
              <GenericErrorMessage messageError={messageError} />
            ) : (
              <div className={classes.chartWrap}>
                <div className={classes.chartFluid}>
                  <ResponsiveContainer>
                    <BarChart data={data}>
                      <XAxis dataKey="number" tickLine={false} />
                      <YAxis
                        axisLine={false}
                        tickSize={3}
                        tickLine={false}
                        tick={{ stroke: 'none' }}
                      />
                      <CartesianGrid vertical={false} strokeDasharray="3 3" />
                      <CartesianAxis />
                      <Tooltip />
                      <Bar dataKey="total_price" fill={color.primary} />
                      <Bar dataKey="Electronics" fill={color.secondary} />
                      <Bar dataKey="Toys" fill={color.third} />
                      <Bar dataKey="Vouchers" fill={color.fourth} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </Grid>
          <Grid item md={4} xs={12}>
            <Typography className={classes.smallTitle} variant="button">
              <CardGiftcard className={classes.leftIcon} />
              Today Sales
            </Typography>
            <Divider className={classes.divider} />
            <Grid container className={classes.secondaryWrap}>
              <PieChart width={300} height={300}>
                <Pie
                  data={data2}
                  cx={150}
                  cy={100}
                  dataKey="value"
                  innerRadius={40}
                  outerRadius={80}
                  fill="#FFFFFF"
                  paddingAngle={5}
                  label
                >
                  {data2.map((entry, index) => (
                    <Cell
                      key={index.toString()}
                      fill={colorsPie[index % colorsPie.length]}
                    />
                  ))}
                </Pie>
                <Legend
                  iconType="circle"
                  verticalALign="bottom"
                  iconSize={10}
                />
              </PieChart>
            </Grid>
          </Grid>
        </Grid>
      </PapperBlock>
    );
  }
}

SalesChartWidget.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SalesChartWidget);
