import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { reduxForm } from 'redux-form/immutable';
import Fab from '@material-ui/core/Fab';
import ArrowForward from '@material-ui/icons/ArrowForward';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import avatarApi from 'dan-api/images/avatars';
import styles from './user-jss';

class LockForm extends React.Component {
  render() {
    const { classes, handleSubmit, submitting } = this.props;
    return (
      <div>
        <form onSubmit={handleSubmit}>
          <section className={classes.lockWrap}>
            <Avatar alt="user" src={avatarApi[6]} className={classes.avatar} />
            <div>
              <Typography className={classes.userName} variant="h5">
                Unauthorized
              </Typography>
              <div className={classes.lockForm}>
                <Fab
                  size="small"
                  color="secondary"
                  type="submit"
                  disabled={submitting}
                >
                  <ArrowForward />
                </Fab>
              </div>
            </div>
          </section>
        </form>
      </div>
    );
  }
}

LockForm.propTypes = {
  classes: PropTypes.object.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

const LockFormReduxed = reduxForm({
  form: 'immutableELockFrm',
  enableReinitialize: true
})(LockForm);

export default withStyles(styles)(LockFormReduxed);
