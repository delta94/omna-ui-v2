import React from 'react';
import PropTypes from 'prop-types';
import Ionicon from 'react-ionicons';
import { variantIcon } from '../Common/Utils';

const myClass = {
  info: 'isa_info',
  success: 'isa_success',
  warning: 'isa_warning',
  error: 'isa_error'
};

const NotificationBottom = ({ type, message }) => {
  const Icon =
    type !== 'success' && type !== 'error' && type !== 'warning'
      ? variantIcon.info
      : variantIcon[type];
  return (
    <div className={myClass[type]}>
      <div className="display-flex justify-content-flex-start">
        <div>
          <Ionicon icon={Icon} />
        </div>
        <div className="display-flex flex-direction-column flex-wrap-wrap item-margin-left">
          {message}
        </div>
      </div>
    </div>
  );
};

NotificationBottom.propTypes = {
  type: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};

export default NotificationBottom;
