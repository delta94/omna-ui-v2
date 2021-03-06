import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import Ionicon from 'react-ionicons';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import LoadingState from 'dan-containers/Common/LoadingState';
import GenericErrorMessage from 'dan-containers/Common/GenericErrorMessage';
import { variantIcon } from 'dan-containers/Common/Utils';

const styles = () => ({
  table: {
    minWidth: 700
  }
});

class CreateWebhook extends React.Component {
  state = {
    loading: true,
    success: true,
    messageError: ''
  };

  componentDidMount() {
    this.setState({ loading: false });
  }

  render() {
    const { classes } = this.props;
    const { loading, success, messageError } = this.state;

    return (
      <Paper>
        <div className="item-padding">
          {loading ? <LoadingState loading={loading} /> : null}
          {loading ? null : !success ? (
            <GenericErrorMessage messageError={messageError} />
          ) : (
            <div>
              <div className="display-flex justify-content-space-between">
                <Button
                  variant="text"
                  size="small"
                  color="primary"
                  component={Link}
                  to="/settings/webhooks-list"
                >
                  <Ionicon
                    icon={variantIcon.arrowBack}
                    className={classNames(classes.leftIcon, classes.iconSmall)}
                  />
                  Webhooks
                </Button>
              </div>
              CreateWebhook
            </div>
          )}
        </div>
      </Paper>
    );
  }
}
CreateWebhook.propTypes = {
  classes: PropTypes.shape({}).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func
  }).isRequired
};

export default withStyles(styles)(CreateWebhook);
