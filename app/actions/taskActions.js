import * as types from './actionConstants';

export const getTasks = query => ({
  type: types.GET_TASKS,
  query
});

export const updateFilters = (filters) => ({
  type: types.UPDATE_TASKS_FILTERS,
  filters
});

export const changePage = (page) => ({
  type: types.CHANGE_TASKS_PAGE,
  page
});

export const changeRowsPerPage = (limit) => ({
  type: types.CHANGE_TASKS_ROWS_PER_PAGE,
  limit
});

export const changeSearchTerm = (term) => ({
  type: types.CHANGE_TASKS_SEARCH_TERM,
  term
});

export const createTask = () => {};
