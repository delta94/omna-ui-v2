// import { GET_FLOWS } from './actionConstants';
import * as types from './actionConstants';

export const getFlows = query => ({
  type: types.GET_FLOWS,
  query
});

export const updateFilters = (filters) => ({
  type: types.UPDATE_FLOWS_FILTERS,
  filters
});

export const changePage = (page) => ({
  type: types.CHANGE_FLOWS_PAGE,
  page
});

export const changeRowsPerPage = (limit) => ({
  type: types.CHANGE_FLOWS_ROWS_PER_PAGE,
  limit
});

export const changeSearchTerm = (term) => ({
  type: types.CHANGE_FLOWS_SEARCH_TERM,
  term
});

export const addFlows = () => {};
