/**
 * Combine all reducers in this file and export the combined reducers.
 */
import { reducer as form } from 'redux-form/immutable';
import { combineReducers } from 'redux-immutable';
import { connectRouter } from 'connected-react-router/immutable';
import history from 'utils/history';

import languageProviderReducer from 'containers/LanguageProvider/reducer';
import login from './modules/login';
import uiReducer from './modules/ui';
import tenantReducer from './modules/tenant';
import initval from './modules/initForm';
import auth from './modules/auth';
import flowsReducer from './modules/flows';
import ordersReducer from './modules/orders';
import integrationsReducer from './modules/integrations';

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
    tenant: tenantReducer,
    integrations: integrationsReducer,
    initval,
    language: languageProviderReducer,
    router: connectRouter(history),
    flows: flowsReducer,
    ...injectedReducers
  });

  // Wrap the root reducer and return a new root reducer with router state
  const mergeWithRouterState = connectRouter(history);
  return mergeWithRouterState(rootReducer);
}
