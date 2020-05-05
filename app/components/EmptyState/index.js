import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Button, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

const EmptyState = ({
  backgroundImage,
  buttonText,
  link,
  showAction,
  text
}) => {
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
        {<FormattedMessage id={text} />}
      </Typography>
      {showAction && (
        <Button
          component={Link}
          to={link}
          variant="contained"
          color="secondary"
          style={{ margin: 16 }}
        >
          {/* <FormattedMessage id={buttonText} /> */}
          {buttonText}
        </Button>
      )}
    </div>
  );
};

EmptyState.defaultProps = {
  backgroundImage: '/images/empty-set.png',
  showAction: false,
  text: 'No data to show'
};

EmptyState.propTypes = {
  backgroundImage: PropTypes.string,
  buttonText: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  showAction: PropTypes.bool,
  text: PropTypes.string
};

export default EmptyState;
