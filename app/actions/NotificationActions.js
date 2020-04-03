import * as types from './actionConstants';

export const setNotificationList = (notifications) => ({
  type: types.SET_NOTIFICATIONS,
  notifications
});

export const deleteNotification = (index) => ({
  type: types.DELETE_NOTIFICATION,
  index
});

export const pushNotification = (notification) => ({
  type: types.PUSH_NOTIFICATION,
  data: notification
});