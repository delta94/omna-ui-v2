import { fromJS, List } from 'immutable';
import * as types from 'dan-actions/actionConstants';
import { GENERATED_TASK_ACTION_TITLE, GENERATED_TASK_MSG } from 'dan-components/Notification/AlertConstants';
import { goToTaskAction } from 'dan-components/Notification/AlertActions';

const initialState = fromJS({
  notifications: []
});

export default function notificationsReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_NOTIFICATIONS:
      return state.withMutations((mutableState) => {
        mutableState.set('notifications', List(action.data));
      });
    case types.DELETE_NOTIFICATION:
      return state.withMutations((mutableState) => {
        mutableState.set('notifications', List(state.get('notifications').delete(action.index)));
      });
    case types.PUSH_NOTIFICATION:
      return state.withMutations((mutableState) => {
        const index = state.get('notifications').findIndex(item => item.message === action.data.message);
        index === -1 ? mutableState.set('notifications', List(state.get('notifications').insert(0, action.data))) : null;
      });
    case types.CLEAR_NOTIFICATIONS:
      return state.withMutations((mutableState) => {
        mutableState.set('notifications', List([]));
      });
    case types.ADD_TASK_NOTIFICATION:
      return state.withMutations((mutableState) => {
        const notif = {
          message: GENERATED_TASK_MSG`${action.taskId}`,
          variant: 'info',
          action: {
            title: GENERATED_TASK_ACTION_TITLE,
            callback: () => goToTaskAction(action.taskId)
          }
        };
        mutableState.set('notifications', List(state.get('notifications').insert(0, notif)));
      });
    default:
      return state;
  }
}
