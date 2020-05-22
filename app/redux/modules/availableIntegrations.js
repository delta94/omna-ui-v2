import { fromJS } from 'immutable';
import * as types from 'dan-actions/actionConstants';

const initialState = fromJS({
  availableIntegrations: { data: [], pagination: {} },
  task: null,
  loading: true
});

export default function availableIntegrationsReducer(state = initialState, action) {
  switch (action.type) {
    case types.GET_AVAILABLE_INTEGRATIONS:
      return state.withMutations((mutableState) => {
        mutableState.set('availableIntegrations', action.data);
      });
    case types.INSTALL_AVAILABLE_INTEGRATION:
      return state.withMutations((mutableState) => {
        mutableState.set('task', action.data);
      });
    case types.UNINSTALL_AVAILABLE_INTEGRATION:
      return state.withMutations((mutableState) => {
        mutableState.set('task', action.data);
      });
    case types.SET_LOADING:
      return state.withMutations((mutableState) => {
        mutableState.set('loading', action.data);
      });
    default:
      return state;
  }
}
