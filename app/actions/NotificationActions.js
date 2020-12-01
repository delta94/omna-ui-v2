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

export const clearNotifications = () => ({
  type: types.CLEAR_NOTIFICATIONS
});

export const addTaskNotification = (taskId) => ({
  type: types.ADD_TASK_NOTIFICATION,
  taskId
});
