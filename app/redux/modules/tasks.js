import { fromJS, Map } from 'immutable';
import * as actionConstants from 'dan-actions/actionConstants';

const initialState = fromJS({
  tasks: { data: [], pagination: { total: 0 } },
  params: Map({
    offset: 0,
    limit: 10,
    term: '',
    sort: undefined,
    integration_id: '',
    status: undefined
  }),
  filters: Map({
    statusFilter: []
  }),
  task: {},
  loading: false,
  error: ''
});

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionConstants.GET_TASKS_START:
      return state.withMutations(mutableState => {
        mutableState.set('loading', true);
      });
    case actionConstants.GET_TASKS_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState.set('tasks', fromJS(action.data));
        mutableState.set('loading', false);
      });
    case actionConstants.UPDATE_TASKS_FILTERS:
      return state.withMutations(mutableState => {
        const { statusFilter } = action.filters;
        mutableState.setIn(['filters', 'statusFilter'], statusFilter || [])
          .setIn(['params', 'status'], statusFilter && statusFilter.length > 0 ? statusFilter[0].value : '');
      });
    case actionConstants.GET_TASKS_FAILED:
      return state.withMutations(mutableState => {
        mutableState.set('error', action.error);
        mutableState.set('loading', false);
      });
    case actionConstants.CHANGE_TASKS_PAGE:
      return state.withMutations(mutableState => {
        mutableState.setIn(['params', 'offset'], action.page * mutableState.getIn(['params', 'limit']));
      });
    case actionConstants.CHANGE_TASKS_ROWS_PER_PAGE:
      return state.withMutations(mutableState => {
        mutableState.setIn(['params', 'limit'], action.limit);
      });
    case actionConstants.CHANGE_TASKS_SEARCH_TERM:
      return state.withMutations(mutableState => {
        mutableState.setIn(['params', 'term'], action.term);
      });
    default:
      return state;
  }
};
