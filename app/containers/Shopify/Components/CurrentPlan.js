import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
  Paper,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography,
  List,
  ListItem,
  ListItemText
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  heading: {
    // fontSize: theme.typography.pxToRem(15),
    fontSize: 16,
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: 16,
    // fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  bodyPanel: {
    fontSize: 10,
    color: '#3e3e3e'
  }
}));

function CurrentPlan({ planCurrent }) {
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
            <Typography className={classes.heading}>
              Current Plan: {planCurrent.name} - {planCurrent.status} -
            </Typography>
            {/* <Typography className={classes.secondaryHeading}>
              - {planCurrent.status} -
            </Typography> */}
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {/* <Typography > */}
              {/* <Grid> */}
                {/* <div> */}
                  <List className={classes.bodyPanel}>
                      <ListItem>
                        <ListItemText
                          primary={`Price: ${planCurrent.price}`}
                        />
                      </ListItem>
{/*
                      <ListItem>
                        <ListItemText
                          primary={`Create at: ${planCurrent.created_at}`}
                        />
                      </ListItem> */}

                      <ListItem>
                        <ListItemText
                          primary={`Activate on: ${planCurrent.activated_on}`}
                        />
                      </ListItem>

                      <ListItem>
                        <ListItemText
                          primary={`Trial days: ${planCurrent.trial_days}`}
                        />
                      </ListItem>

                      {planCurrent.trial_ends_on
                      && <ListItem>
                        <ListItemText
                          primary={`Trial days ends on: ${planCurrent.trial_ends_on}`}
                        />
                         </ListItem>
                      }

                  </List>
                {/* </div> */}
              {/* </Grid> */}
            {/* </Typography> */}
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
