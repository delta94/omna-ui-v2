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
export const LOAD_TITLE = 'LOAD_TITLE';
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
export const GET_EXPORT_ORDER = 'GET_EXPORT_ORDER';
export const GET_EXPORT_ORDER_SUCCESS = 'GET_EXPORT_ORDER_SUCCESS';
export const CHANGE_ORDERS_PAGE = 'CHANGE_ORDERS_PAGE';
export const CHANGE_ORDERS_ROWS_PER_PAGE = 'CHANGE_ORDERS_ROWS_PER_PAGE';
export const CHANGE_ORDERS_SEARCH_TERM = 'CHANGE_ORDERS_SEARCH_TERM';
export const UPDATE_ORDER_FILTERS = 'UPDATE_ORDER_FILTERS';

// Integrations
export const ACTION_INTEGRATION_START = 'ACTION_INTEGRATION_START';
export const GET_INTEGRATIONS = 'GET_INTEGRATIONS';
export const GET_INTEGRATIONS_SUCCESS = 'GET_INTEGRATIONS_SUCCESS';
export const GET_INTEGRATIONS_FAILED = 'GET_INTEGRATIONS_FAILED';
export const CREATE_INTEGRATION = 'CREATE_INTEGRATION';
export const CREATE_INTEGRATION_SUCCESS = 'CREATE_INTEGRATION_SUCCESS';
export const CREATE_INTEGRATION_FAILED = 'CREATE_INTEGRATION_FAILED';
export const UPDATE_INTEGRATION = 'UPDATE_INTEGRATION';
export const UPDATE_INTEGRATION_SUCCESS = 'UPDATE_INTEGRATION_SUCCESS';
export const UPDATE_INTEGRATION_FAILED = 'UPDATE_INTEGRATION_FAILED';
export const DELETE_INTEGRATION = 'DELETE_INTEGRATION';
export const DELETE_INTEGRATION_SUCCESS = 'DELETE_INTEGRATION_SUCCESS';
export const DELETE_INTEGRATION_FAILED = 'DELETE_INTEGRATION_FAILED';
export const UNAUTHORIZE_INTEGRATION = 'UNAUTHORIZE_INTEGRATION';
export const UNAUTHORIZE_INTEGRATION_SUCCESS = 'UNAUTHORIZE_INTEGRATION_SUCCESS';
export const UNAUTHORIZE_INTEGRATION_FAILED = 'UNAUTHORIZE_INTEGRATION_FAILED';

export const GET_CHANNELS = 'GET_CHANNELS';
export const GET_CHANNELS_SUCCESS = 'GET_CHANNELS_SUCCESS';
export const GET_CHANNELS_FAILED = 'GET_CHANNELS_FAILED';

export const IMPORT_RESOURCE = 'IMPORT_RESOURCE';

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
export const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS';
export const ADD_TASK_NOTIFICATION = 'ADD_TASK_NOTIFICATION';

// Products
export const GET_PRODUCTS_START = 'GET_PRODUCTS_START';
export const GET_PRODUCTS = 'GET_PRODUCTS';
export const GET_PRODUCTS_SUCCESS = 'GET_PRODUCTS_SUCCESS';
export const GET_PRODUCTS_FAILED = 'GET_PRODUCTS_FAILED';
export const CHANGE_PRODUCTS_PAGE = 'CHANGE_PRODUCTS_PAGE';
export const CHANGE_PRODUCTS_ROWS_PER_PAGE = 'CHANGE_PRODUCTS_ROWS_PER_PAGE';
export const CHANGE_PRODUCTS_SEARCH_TERM = 'CHANGE_PRODUCTS_SEARCH_TERM';
export const RESET_PRODUCTS_TABLE = 'RESET_PRODUCTS_TABLE';
export const GET_PRODUCTS_BY_INTEGRATION_ASYNC = 'GET_PRODUCTS_BY_INTEGRATION_ASYNC';
export const LINK_PRODUCT = 'LINK_PRODUCT';
export const LINK_PRODUCT_ASYNC = 'LINK_PRODUCT_ASYNC';
export const UNLINK_PRODUCT = 'UNLINK_PRODUCT';
export const UNLINK_PRODUCT_ASYNC = 'UNLINK_PRODUCT_ASYNC';
export const BULK_LINK_PRODUCTS = 'BULK_LINK_PRODUCTS';
export const BULK_UNLINK_PRODUCTS = 'BULK_UNLINK_PRODUCTS';
export const DELETE_PRODUCT_START = 'DELETE_PRODUCT_START';
export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const DELETE_PRODUCT_SUCCESS = 'DELETE_PRODUCT_SUCCESS';
export const DELETE_PRODUCT_FAILED = 'DELETE_PRODUCT_FAILED';
export const UNSUBSCRIBE_PRODUCTS = 'UNSUBSCRIBE_PRODUCTS';
export const GET_BULK_EDIT_PROPERTIES = 'GET_BULK_EDIT_PROPERTIES';
export const GET_BULK_EDIT_PROPERTIES_SUCCESS = 'GET_BULK_EDIT_PROPERTIES_SUCCESS';
export const BULK_EDIT_PROPERTIES = 'BULK_EDIT_PROPERTIES';
export const BULK_EDIT_PROPERTIES_SUCCESS = 'BULK_EDIT_PROPERTIES_SUCCESS';
export const IMPORT_PRODUCT_FROM_INTEGRATION = 'IMPORT_PRODUCT_FROM_INTEGRATION';
export const INIT_BULK_EDIT_PRODUCTS_DATA = 'INIT_BULK_EDIT_PRODUCTS_DATA';
export const UPDATE_PRODUCT_FILTERS = 'UPDATE_PRODUCT_FILTERS';


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
export const LINK_VARIANT = 'LINK_VARIANT';
export const UNLINK_VARIANT = 'UNLINK_VARIANT';
export const GET_PRODUCT_CATEGORY = 'GET_PRODUCT_CATEGORY';
export const GET_PRODUCT_CATEGORY_SUCCESS = 'GET_PRODUCT_CATEGORY_SUCCESS';
export const UPDATE_VARIANT_REMOTE_IDS = 'UPDATE_VARIANT_REMOTE_IDS';
export const INIT_BULK_EDIT_VARIANTS_DATA = 'INIT_BULK_EDIT_VARIANTS_DATA';
export const UPDATE_VARIANT_FILTERS = 'UPDATE_VARIANT_FILTERS';
export const CHANGE_VARIANTS_PAGE = 'CHANGE_VARIANTS_PAGE';
export const CHANGE_VARIANTS_ROWS_PER_PAGE = 'CHANGE_VARIANTS_ROWS_PER_PAGE';
export const CHANGE_VARIANTS_SEARCH_TERM = 'CHANGE_VARIANTS_SEARCH_TERM';
export const RESET_VARIANTS_TABLE = 'RESET_VARIANTS_TABLE';


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
export const SET_PLAN_STATUS = 'SET_PLAN_STATUS';
export const SET_PLAN_NAME = 'SET_PLAN_NAME';

// Tasks
export const GET_TASKS = 'GET_TASKS';
export const GET_TASKS_START = 'GET_TASKS_START';
export const GET_TASKS_SUCCESS = 'GET_TASKS_SUCCESS';
export const GET_TASKS_FAILED = 'GET_TASKS_FAILED';
export const UPDATE_TASKS_FILTERS = 'UPDATE_TASKS_FILTERS';
export const CHANGE_TASKS_PAGE = 'CHANGE_TASKS_PAGE';
export const CHANGE_TASKS_ROWS_PER_PAGE = 'CHANGE_TASKS_ROWS_PER_PAGE';
export const CHANGE_TASKS_SEARCH_TERM = 'CHANGE_TASKS_SEARCH_TERM';

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
export const GET_BRANDS_START = 'GET_BRANDS_START';
export const GET_BRANDS_FAILED = 'GET_BRANDS_FAILED';


// Categories
export const GET_CATEGORIES_START = 'GET_CATEGORIES_START';
export const GET_CATEGORIES = 'GET_CATEGORIES';
export const GET_CATEGORIES_SUCCESS = 'GET_CATEGORIES_SUCCESS';
export const GET_CATEGORIES_FAILED = 'GET_CATEGORIES_FAILED';

// User
export const SET_USER = 'SET_USER';
export const SET_CODE = 'SET_CODE';
