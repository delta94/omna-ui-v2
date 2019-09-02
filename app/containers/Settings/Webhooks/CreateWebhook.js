import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Ionicon from 'react-ionicons';

/* material-ui */
// core
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
// our
import LoadingState from '../../Common/LoadingState';
import GenericErrorMessage from '../../Common/GenericErrorMessage';
import Utils from '../../Common/Utils';

const variantIcon = Utils.iconVariants();

const styles = () => ({
  table: {
    minWidth: 700,
  },
});

/* ======= Principal Class ======= */
class CreateWebhook extends React.Component {
  state = {
    loading: true,
    success: true,
    messageError: '',
  };

  componentDidMount() {
    this.setState({ loading: false });
  }

  render() {
    const { classes } = this.props;
    const {
      loading, success, messageError
    } = this.state;

    return (
      <Paper>
        <div className="item-padding">
          {loading ? <LoadingState loading={loading} /> : null}
          {loading ? null : !success ? (
            <GenericErrorMessage messageError={messageError} />
          ) : (
            <div>
              <div className="display-flex justify-content-space-between">
                <Button variant="text" size="small" color="primary" component={Link} to="/app/settings/webhooks-list">
                  <Ionicon icon={variantIcon.arrowBack} className={classNames(classes.leftIcon, classes.iconSmall)} />
                  Webhooks
                </Button>
              </div>
              CreateWebhook
            </div>
          )
          }
        </div>
      </Paper>
    );
  }
}
CreateWebhook.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default withStyles(styles)(CreateWebhook);
