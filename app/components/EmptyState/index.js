import React from 'react';
import PropTypes from 'prop-types';
// import { FormattedMessage } from 'react-intl';
import { Button, Typography } from '@material-ui/core';

const EmptyState = ({ action, actionText, backgroundImage, text }) => {
  return (
    <div
      style={{
        display: 'flex',
        flex: '1 1 auto',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <img alt="No data to show" src={backgroundImage} style={{ width: 500 }} />
      <Typography
        componente="h6"
        variant="subtitle2"
        style={{ fontSize: 20, color: 'rgba(0, 0, 0, .47)' }}
      >
        {/* {<FormattedMessage id={text} />} */}
        {text}
      </Typography>
      {action && (
        <Button
          onClick={action}
          variant="outlined"
          color="secondary"
          style={{ margin: 16 }}
        >
          {/* <FormattedMessage id={buttonText} /> */}
          {actionText}
        </Button>
      )}
    </div>
  );
};

EmptyState.defaultProps = {
  action: null,
  actionText: 'Add item',
  backgroundImage: '/images/empty-set.png',
  text: 'No data to show'
};

EmptyState.propTypes = {
  action: PropTypes.func,
  actionText: PropTypes.string,
  backgroundImage: PropTypes.string,
  text: PropTypes.string
};

export default EmptyState;
