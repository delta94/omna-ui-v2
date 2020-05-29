import { GET_INVENTORY_ENTRY, GET_INVENTORY_ENTRIES } from './actionConstants';

export const getInventoryEntries = query => ({
  type: GET_INVENTORY_ENTRIES,
  query
});

export const getInventoryEntry = id => ({
  type: GET_INVENTORY_ENTRY,
  id
});
