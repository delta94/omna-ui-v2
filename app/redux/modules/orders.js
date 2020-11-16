import { fromJS, Map } from 'immutable';
import * as actionConstants from 'dan-actions/actionConstants';

const initialState = fromJS({
  orders: { data: [], pagination: { total: 0 } },
  params: Map({
    offset: 0,
    limit: 10,
    term: '',
    sort: undefined,
    integration_id: '',
    status: undefined
  }),
  filters: Map({
    integrationFilter: [],
    statusFilter: []
  }),
  order: {},
  loading: false,
  error: ''
});

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case actionConstants.GET_ORDERS_START:
      return state.withMutations(mutableState => {
        mutableState.set('loading', true);
      });
    case actionConstants.GET_ORDERS_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState.set('orders', fromJS(action.data));
        mutableState.set('loading', false);
      });
    case actionConstants.GET_ORDERS_FAILED:
      return state.withMutations(mutableState => {
        mutableState.set('error', action.error);
        mutableState.set('loading', false);
      });
    case actionConstants.GET_ORDER_START:
      return state.withMutations(mutableState => {
        mutableState.set('loading', true);
      });
    case actionConstants.GET_ORDER_SUCCESS:
      return state.withMutations(mutableState => {
        mutableState.set('order', fromJS(action.data));
        mutableState.set('loading', false);
      });
    case actionConstants.GET_ORDER_FAILED:
      return state.withMutations(mutableState => {
        mutableState.set('error', action.error);
        mutableState.set('loading', false);
      });
    case actionConstants.UPDATE_ORDER_FILTERS:
      return state.withMutations(mutableState => {
        const { integrationFilter, statusFilter } = action.filters;
        mutableState.setIn(['filters', 'integrationFilter'], integrationFilter || [])
          .setIn(['filters', 'statusFilter'], statusFilter || [])
          .setIn(['params', 'integration_id'], integrationFilter && integrationFilter.length > 0 ? integrationFilter[0].value : '')
          .setIn(['params', 'status'], statusFilter && statusFilter.length > 0 ? statusFilter[0].value : '');
      });
    case actionConstants.CHANGE_ORDERS_PAGE:
      return state.withMutations(mutableState => {
        mutableState.setIn(['params', 'offset'], action.page * mutableState.getIn(['params', 'limit']));
      });
    case actionConstants.CHANGE_ORDERS_ROWS_PER_PAGE:
      return state.withMutations(mutableState => {
        mutableState.setIn(['params', 'limit'], action.limit);
      });
    case actionConstants.CHANGE_ORDERS_SEARCH_TERM:
      return state.withMutations(mutableState => {
        mutableState.setIn(['params', 'term'], action.term);
      });
    default:
      return state;
  }
};
