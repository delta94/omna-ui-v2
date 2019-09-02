import React from 'react';
import PropTypes from 'prop-types';

/* material-ui */
// core
import Typography from '@material-ui/core/Typography';

class GenericErrorMessage extends React.Component {
  render() {
    const { messageError } = this.props;
    return (
      <div className="item-margin">
        <Typography variant="h6" gutterBottom color="secondary">
          There is the following error: (
          {messageError}
          ), please reload the page or tray again later.
        </Typography>
      </div>
    );
  }
}

GenericErrorMessage.propTypes = {
  messageError: PropTypes.string.isRequired,
};

export default GenericErrorMessage;
