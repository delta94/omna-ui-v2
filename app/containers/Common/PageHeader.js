import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import { BreadCrumb } from 'dan-components';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
  pageTitle: {
    padding: theme.spacing.unit,
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('lg')]: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end'
    },
    '& h4': {
      fontWeight: 700,
      textTransform: 'capitalize',
      [theme.breakpoints.down('md')]: {
        marginBottom: theme.spacing(3)
      }
    }
  },
  darkTitle: {
    color:
      theme.palette.type === 'dark'
        ? theme.palette.primary.main
        : theme.palette.primary.dark
  },
  lightTitle: {
    color: theme.palette.common.white
  }
});

const PageHeader = props => {
  const { classes, history, title } = props;
  
  return (
    <div className={classes.pageTitle}>
      <Typography className={classes.darkTitle} component="h4" variant="h4">
        {title}
      </Typography>
      <BreadCrumb separator=" / " theme="dark" location={history.location} />
    </div>
  );
};

export default withStyles(styles)(PageHeader);

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};
