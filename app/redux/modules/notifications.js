import { fromJS, List } from 'immutable';
import * as types from '../../actions/actionConstants';

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
    default:
      return state;
  }
}
