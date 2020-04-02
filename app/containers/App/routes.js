import {
  Tasks,
  TaskDetails,
  Orders,
  OrderDetails,
  Products,
  EditProduct,
  AddProduct,
  AvailableIntegrations,
  Channels,
  InstalledIntegrations,
  AddIntegrationForm,
  Workflows,
  AddWorkflow,
  EditWorkflow,
  Webhooks,
  AddWebhook,
  EditWebhook,
  DashboardPage,
  TenantConfiguration,
  AddTenant,
  InstallShopify
} from '../pageListAsync';
import ClientSettings from '../Shopify/Components/Administration/ClientSettings';

export const DashboardRoute = { link: '/dashboard', component: DashboardPage };

export const OrdersRoute = { link: '/orders', component: Orders };

export const OrderDetailsRoute = {
  link: '/orders/:number',
  component: OrderDetails
};

export const TasksRoute = { link: '/tasks', component: Tasks };

export const TaskDetailsRoute = { link: '/tasks/:id', component: TaskDetails };

export const ProductsRoute = { link: '/products', component: Products };

export const AddProductRoute = {
  link: '/products/add-product',
  component: AddProduct
};

export const EditProductRoute = {
  link: '/products/:id',
  component: EditProduct
};

export const AvailableIntegrationsRoute = {
  link: '/available-integrations',
  component: AvailableIntegrations
};

export const ChannelsRoute = { link: '/channels', component: Channels };

export const InstalledIntegrationsRoute = {
  link: '/installed-integrations',
  component: InstalledIntegrations
};

export const AddIntegrationFormRoute = {
  link: '/integrations/add-integration',
  component: AddIntegrationForm
};

export const WorkflowsRoute = { link: '/workflows', component: Workflows };

export const AddWorkflowRoute = {
  link: '/workflows/add-workflow',
  component: AddWorkflow
};

export const EditWorkflowRoute = {
  link: '/workflows/:id',
  component: EditWorkflow
};

export const AddTenantRoute = { link: '/add-tenant', component: AddTenant };

export const WebhooksRoute = { link: '/webhooks', component: Webhooks };

export const AddWebhookRoute = {
  link: '/webhooks/add-webhook',
  component: AddWebhook
};

export const EditWebhookRoute = {
  link: '/webhooks/:id',
  component: EditWebhook
};

export const InstallShopifyRoute = {
  link: '/shopify',
  component: InstallShopify
};

export const DashboardPageRoute = { link: '/', component: DashboardPage };

export const TenantConfigurationRoute = {
  link: '/tenant-configuration',
  component: TenantConfiguration
};

export const ClientSettingsRoute = {
  path: '/client-settings',
  component: ClientSettings
}

export const AllRoutes = [
  DashboardRoute,
  OrdersRoute,
  OrderDetailsRoute,
  TasksRoute,
  TaskDetailsRoute,
  ProductsRoute,
  AddProductRoute,
  EditProductRoute,
  AvailableIntegrationsRoute,
  ChannelsRoute,
  InstalledIntegrationsRoute,
  AddIntegrationFormRoute,
  WorkflowsRoute,
  AddWorkflowRoute,
  EditWorkflowRoute,
  AddTenantRoute,
  WebhooksRoute,
  AddWebhookRoute,
  EditWebhookRoute,
  InstallShopifyRoute,
  DashboardPageRoute,
  TenantConfigurationRoute,
  ClientSettingsRoute
];
