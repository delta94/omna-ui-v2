/**
 * Combine all reducers in this file and export the combined reducers.
 */
import { reducer as form } from 'redux-form/immutable';
import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';
import languageProviderReducer from '../containers/LanguageProvider/reducer';
import history from '../utils/history';
import availableIntegrationsReducer from './modules/availableIntegrations';
import login from './modules/login';
import uiReducer from './modules/ui';
import userReducer from './modules/user';
import initval from './modules/initForm';
import auth from './modules/auth';
import flowsReducer from './modules/flows';
import ordersReducer from './modules/orders';
import productsReducer from './modules/products';
import tasksReducer from './modules/tasks';
import integrationsReducer from './modules/integrations';
import inventoryReducer from './modules/inventory';
import notificationsReducer from './modules/notifications';
import webhooksReducer from './modules/webhooks';
import variantsReducer from './modules/variants';
import brandsReducer from './modules/brand';
import categoriesReducer from './modules/category';
/**
 * Creates the main reducer with the dynamically injected ones
 */
export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    auth,
    order: ordersReducer,
    form,
    login,
    ui: uiReducer,
    user: userReducer,
    integration: integrationsReducer,
    inventory: inventoryReducer,
    notification: notificationsReducer,
    product: productsReducer,
    variant: variantsReducer,
    availableIntegration: availableIntegrationsReducer,
    initval,
    language: languageProviderReducer,
    flow: flowsReducer,
    task: tasksReducer,
    webhook: webhooksReducer,
    brand: brandsReducer,
    category: categoriesReducer,
    router: connectRouter(history),
    ...injectedReducers
  });

  // Wrap the root reducer and return a new root reducer with router state
  const mergeWithRouterState = connectRouter(history);
  return mergeWithRouterState(rootReducer);
}
