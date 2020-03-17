import { fromJS, List } from 'immutable';
import * as types from '../../actions/actionConstants';

const initialState = fromJS({
  availableIntegrations: [],
  task: null,
  total: 0,
  loading: true
});

export default function availableIntegrationsReducer(state = initialState, action) {
  switch (action.type) {
    case types.SET_AVAILABLE_INTEGRATIONS:
      return state.withMutations((mutableState) => {
        mutableState.set('availableIntegrations', List(action.data));
      });
    case types.INSTALL_AVAILABLE_INTEGRATION:
      return state.withMutations((mutableState) => {
        mutableState.set('task', action.data);
      });
    case types.UNINSTALL_AVAILABLE_INTEGRATION:
      return state.withMutations((mutableState) => {
        mutableState.set('task', action.data);
      });
    case types.SET_TOTAL:
      return state.withMutations((mutableState) => {
        mutableState.set('total', action.data);
      });
    case types.SET_LOADING:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', action.data);
      });
    default:
      return state;
  }
}
