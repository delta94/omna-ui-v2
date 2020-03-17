import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
  Paper,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  Grid
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  }
}));

function CurrentPlan({ planCurrent }) {
  console.log(planCurrent);
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div>
      <Paper elevation={1}>
        <ExpansionPanel
          expanded={expanded === 'panel1'}
          onChange={handleChange('panel1')}
        >
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography className={classes.heading} />
            <Typography className={classes.secondaryHeading}>
              Current Plan: {planCurrent.name}
            </Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography>
              <Grid>
                <Typography variant="h6" className={classes.title} />
                <div className={classes.demo}>
                  <ul>
                    <li>{`${planCurrent.cost_by_order} per Order`}</li>
                    <li>Manage until {planCurrent.order_limit} orders</li>
                    <li>Maximum price of ${planCurrent.capped_amount}</li>
                    <li>{planCurrent.trial_days} trial days</li>
                  </ul>
                </div>
              </Grid>
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </Paper>
    </div>
  );
}

CurrentPlan.propTypes = {
  planCurrent: PropTypes.object.isRequired
};

export default CurrentPlan;
