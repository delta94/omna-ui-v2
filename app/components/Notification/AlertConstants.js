export const SUBSCRIBE_ACTION_TITLE = 'Billing settings';
export const SUBSCRIBE_SHOPIFY_ACTION_TITLE = 'Plan settings';
export const GENERATED_TASK_ACTION_TITLE = 'Go to task';
export const TENANT_NOT_READY_ACTION_TITLE = 'Install';
export const SUBSCRIBE_MSG = (strings, name) => `This tenant "${name}" is disabled. Go to your billing settings and subscribe to a plan for Tenant Activation.`;
export const DISABLED_TENANT_MSG = (strings, tenantName, deactivation) => `This tenant "${tenantName}" is ${deactivation} days left for deactivation.`;
export const TENANT_NOT_READY_MSG = 'The current tenant is not ready to use with OMNA application. Please, install omna-v2 collection before.';
export const GENERATED_TASK_MSG = (strings, id) => `You executed an action that generates a task. Task Id: ${id}. Please go to task for more information.`;
