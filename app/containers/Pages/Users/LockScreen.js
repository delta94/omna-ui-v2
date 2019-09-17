import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Loading from 'dan-components/Loading';
import styles from '../../../components/Forms/user-jss';

class LockScreen extends React.Component {
  componentWillMount() {
    const { location } = this.props;
    const { redirect } = location.state;
    window.location.replace(redirect);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Loading />
      </div>
    );
  }
}

LockScreen.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export default withStyles(styles)(LockScreen);
