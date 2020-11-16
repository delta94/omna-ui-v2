import * as types from './actionConstants';

export const getOrders = query => ({
  type: types.GET_ORDERS,
  query
});

export const getOrder = id => ({
  type: types.GET_ORDER,
  id
});

export const updateFilters = (filters) => ({
  type: types.UPDATE_ORDER_FILTERS,
  filters
});

export const changePage = (page) => ({
  type: types.CHANGE_ORDERS_PAGE,
  page
});

export const changeRowsPerPage = (limit) => ({
  type: types.CHANGE_ORDERS_ROWS_PER_PAGE,
  limit
});

export const changeSearchTerm = (term) => ({
  type: types.CHANGE_ORDERS_SEARCH_TERM,
  term
});
