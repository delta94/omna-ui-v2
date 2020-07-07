// Global UI Action
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';
export const OPEN_SUBMENU = 'OPEN_SUBMENU';
export const CLOSE_ALL_SUBMENU = 'CLOSE_ALL_SUBMENU';
export const CHANGE_THEME = 'CHANGE_THEME';
export const CHANGE_MODE = 'CHANGE_MODE';
export const CHANGE_GRADIENT = 'CHANGE_GRADIENT';
export const CHANGE_DECO = 'CHANGE_DECO';
export const CHANGE_BG_POSITION = 'CHANGE_BG_POSITION';
export const CHANGE_LAYOUT = 'CHANGE_LAYOUT';
export const LOAD_PAGE = 'LOAD_PAGE';
// Redux Form
export const INIT = 'INIT';
export const CLEAR = 'CLEAR';

// Flows
export const GET_FLOWS = 'GET_FLOWS';
export const GET_FLOWS_START = 'GET_FLOWS_START';
export const GET_FLOWS_SUCCESS = 'GET_FLOWS_SUCCESS';
export const GET_FLOWS_FAILED = 'GET_FLOWS_FAILED';

// Orders
export const GET_ORDERS = 'GET_ORDERS';
export const GET_ORDERS_START = 'GET_ORDERS_START';
export const GET_ORDERS_SUCCESS = 'GET_ORDERS_SUCCESS';
export const GET_ORDERS_FAILED = 'GET_ORDERS_FAILED';
export const GET_ORDER = 'GET_ORDER';
export const GET_ORDER_START = 'GET_ORDER_START';
export const GET_ORDER_SUCCESS = 'GET_ORDER_SUCCESS';
export const GET_ORDER_FAILED = 'GET_ORDER_FAILED';

// Integrations
export const GET_INTEGRATIONS = 'GET_INTEGRATIONS';
export const GET_INTEGRATIONS_START = 'GET_INTEGRATIONS_START';
export const GET_INTEGRATIONS_SUCCESS = 'GET_INTEGRATIONS_SUCCESS';
export const GET_INTEGRATIONS_FAILED = 'GET_INTEGRATIONS_FAILED';
export const UPDATE_INTEGRATION = 'UPDATE_INTEGRATION';
export const UPDATE_INTEGRATION_START = 'UPDATE_INTEGRATION_START';
export const UPDATE_INTEGRATION_SUCCESS = 'UPDATE_INTEGRATION_SUCCESS';
export const UPDATE_INTEGRATION_FAILED = 'UPDATE_INTEGRATION_FAILED';
export const DELETE_INTEGRATION = 'DELETE_INTEGRATION';
export const DELETE_INTEGRATION_START = 'DELETE_INTEGRATION_START';
export const DELETE_INTEGRATION_SUCCESS = 'DELETE_INTEGRATION_SUCCESS';
export const DELETE_INTEGRATION_FAILED = 'DELETE_INTEGRATION_FAILED';

export const GET_CHANNELS = 'GET_CHANNELS';
export const GET_CHANNELS_START = 'GET_CHANNELS_START';
export const GET_CHANNELS_SUCCESS = 'GET_CHANNELS_SUCCESS';
export const GET_CHANNELS_FAILED = 'GET_CHANNELS_FAILED';

export const IMPORT_RESOURCE = 'IMPORT_RESOURCE';
export const IMPORT_RESOURCE_ASYNC = 'IMPORT_RESOURCE_ASYNC';

// Available Integrations
export const GET_AVAILABLE_INTEGRATIONS = 'GET_AVAILABLE_INTEGRATIONS';
export const GET_AVAILABLE_INTEGRATIONS_ASYNC = 'GET_AVAILABLE_INTEGRATIONS_ASYNC';
export const INSTALL_AVAILABLE_INTEGRATION = 'INSTALL_AVAILABLE_INTEGRATION';
export const INSTALL_AVAILABLE_INTEGRATION_ASYNC = 'INSTALL_AVAILABLE_INTEGRATION_ASYNC';
export const UNINSTALL_AVAILABLE_INTEGRATION = 'UNINSTALL_AVAILABLE_INTEGRATION';
export const UNINSTALL_AVAILABLE_INTEGRATION_ASYNC = 'UNINSTALL_AVAILABLE_INTEGRATION_ASYNC';

// Notifications
export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';
export const DELETE_NOTIFICATION = 'DELETE_NOTIFICATION';
export const PUSH_NOTIFICATION = 'PUSH_NOTIFICATION';

// Products
export const GET_PRODUCTS = 'GET_PRODUCTS';
export const GET_PRODUCTS_ASYNC = 'GET_PRODUCTS_ASYNC';
export const LINK_PRODUCT = 'LINK_PRODUCT';
export const LINK_PRODUCT_ASYNC = 'LINK_PRODUCT_ASYNC';
export const UNLINK_PRODUCT = 'UNLINK_PRODUCT';
export const UNLINK_PRODUCT_ASYNC = 'UNLINK_PRODUCT_ASYNC';
export const BULK_LINK_PRODUCTS = 'BULK_LINK_PRODUCTS';
export const BULK_LINK_PRODUCTS_ASYNC = 'BULK_LINK_PRODUCTS_ASYNC';
export const BULK_UNLINK_PRODUCTS = 'BULK_UNLINK_PRODUCTS';
export const BULK_UNLINK_PRODUCTS_ASYNC = 'BULK_UNLINK_PRODUCTS_ASYNC';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const DELETE_PRODUCT_ASYNC = 'DELETE_PRODUCT_ASYNC';
export const RESET_DELETE_PRODUCT_FLAG = 'RESET_DELETE_PRODUCT_FLAG';

// Variants
export const GET_VARIANTS = 'GET_VARIANTS';
export const GET_VARIANTS_ASYNC = 'GET_VARIANTS_ASYNC';
export const GET_VARIANT = 'GET_VARIANT';
export const GET_VARIANT_ASYNC = 'GET_VARIANT_ASYNC';
export const CREATE_VARIANT = 'CREATE_VARIANT';
export const CREATE_VARIANT_ASYNC = 'CREATE_VARIANT_ASYNC';
export const UPDATE_VARIANT = 'UPDATE_VARIANT';
export const UPDATE_VARIANT_ASYNC = 'UPDATE_VARIANT_ASYNC';
export const UPDATE_INTEGRATION_VARIANT = 'UPDATE_INTEGRATION_VARIANT';
export const UPDATE_INTEGRATION_VARIANT_ASYNC = 'UPDATE_INTEGRATION_VARIANT_ASYNC';
export const DELETE_VARIANT = 'DELETE_VARIANT';
export const DELETE_VARIANT_ASYNC = 'DELETE_VARIANT_ASYNC';
export const LINK_VARIANT = 'LINK_VARIANT';
export const LINK_VARIANT_ASYNC = 'LINK_VARIANT_ASYNC';
export const UNLINK_VARIANT = 'UNLINK_VARIANT';
export const UNLINK_VARIANT_ASYNC = 'UNLINK_VARIANT_ASYNC';

export const SET_LOADING = 'SET_LOADING';
export const SET_TOTAL = 'SET_TOTAL';

export const AUTH_LOGOUT = 'AUTH_LOGOUT';

export const GET_TENANT = 'GET_TENANT';
export const SET_TENANT_STATUS = 'SET_TENANT_STATUS';
export const GET_TENANT_LIST = 'GET_TENANT_LIST';
export const SET_TENANT_LIST = 'SET_TENANT_LIST';
export const GET_RELOAD_TENANTS = 'GET_RELOAD_TENANTS';
export const SET_RELOAD_TENANTS = 'SET_RELOAD_TENANTS';
export const GET_RELOAD_LANDING_PAGE = 'GET_RELOAD_LANDING_PAGE';
export const SET_RELOAD_LANDING_PAGE = 'SET_RELOAD_LANDING_PAGE';
export const SET_DEACTIVATION_DATE = 'SET_DEACTIVATION_DATE';
export const SET_ENABLED_TENANT = 'SET_ENABLED_TENANT';
export const SET_TENANT_NAME = 'SET_TENANT_NAME';
export const GET_TENANT_ID = 'GET_TENANT_ID';
export const SET_TENANT_ID = 'SET_TENANT_ID';

// Tasks
export const GET_TASKS = 'GET_TASKS';
export const GET_TASKS_START = 'GET_TASKS_START';
export const GET_TASKS_SUCCESS = 'GET_TASKS_SUCCESS';
export const GET_TASKS_FAILED = 'GET_TASKS_FAILED';

// Webhooks
export const GET_WEBHOOKS = 'GET_WEBHOOKS';
export const GET_WEBHOOKS_START = 'GET_WEBHOOKS_START';
export const GET_WEBHOOKS_SUCCESS = 'GET_WEBHOOKS_SUCCESS';
export const GET_WEBHOOKS_FAILED = 'GET_WEBHOOKS_FAILED';

// Inventory
export const ACTION_INVENTORY_START = 'ACTION_INVENTORY_START';
export const GET_INVENTORY_ENTRIES = 'GET_INVENTORY_ENTRIES';
export const GET_INVENTORY_ENTRIES_SUCCESS = 'GET_INVENTORY_ENTRIES_SUCCESS';
export const GET_INVENTORY_ENTRIES_FAILED = 'GET_INVENTORY_ENTRIES_FAILED';
export const GET_INVENTORY_ENTRY = 'GET_INVENTORY_ENTRY';
export const GET_INVENTORY_ENTRY_SUCCESS = 'GET_INVENTORY_ENTRY_SUCCESS';
export const GET_INVENTORY_ENTRY_FAILED = 'GET_INVENTORY_ENTRY_FAILED';

// Brands
export const GET_BRANDS = 'GET_BRANDS';
export const GET_BRANDS_ASYNC = 'GET_BRANDS_ASYNC';

// Categories
export const GET_CATEGORIES = 'GET_CATEGORIES';
export const GET_CATEGROIES_ASYNC = 'GET_CATEGORIES_ASYNC';
