import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import NotificationBottom from './NotificationBottom';

const TaskNotifications = ({ notifications }) => {
  return (
    <div>
      {notifications.length > 0 ? (
        notifications.map((not, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className="item-margin-top item-margin-bottom" key={index}>
            <NotificationBottom
              type={get(not, 'type', 'info')}
              message={get(not, 'message', '')}
            />
          </div>
        ))
      ) : (
        <div className="item-margin-top item-margin-bottom">
          <NotificationBottom
            type="info"
            message="There is no retrieved information."
          />
        </div>
      )}
    </div>
  );
};

TaskNotifications.propTypes = {
  notifications: PropTypes.array.isRequired
};

export default TaskNotifications;
