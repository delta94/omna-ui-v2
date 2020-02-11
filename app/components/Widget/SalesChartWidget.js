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
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import styles from './widget-jss';
import PapperBlock from '../PapperBlock/PapperBlock';

const color = {
  primary: colorfull[6],
  secondary: colorfull[3],
  third: colorfull[2],
  fourth: colorfull[4]
};

const colorsPie = [purple[500], blue[500], cyan[500], pink[500]];

class SalesChartWidget extends PureComponent {
  render() {
    const { classes, data, title } = this.props;
    return (
      <PapperBlock
        whiteBg
        noMargin
        title={title}
        icon="ios-stats-outline"
        desc=""
      >
        <Divider className={classes.divider} />
        <PieChart width={300} height={300}>
          <Pie
            data={data}
            cx={150}
            cy={100}
            dataKey="value"
            innerRadius={40}
            outerRadius={80}
            fill="#FFFFFF"
            paddingAngle={5}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index.toString()}
                fill={colorsPie[index % colorsPie.length]}
              />
            ))}
          </Pie>
          <Legend iconType="circle" verticalALign="bottom" iconSize={10} />
        </PieChart>
      </PapperBlock>
    );
  }
}

SalesChartWidget.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SalesChartWidget);
