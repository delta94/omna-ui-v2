
import {
  Tasks,
  TaskDetails,
  Orders,
  OrderDetails,
  Variants,
  Products,
  EditProduct,
  EditVariant,
  AddProduct,
  AddVariant,
  AvailableIntegrations,
  Channels,
  Integrations,
  IntegrationForm,
  Workflows,
  AddWorkflow,
  EditWorkflow,
  Webhooks,
  AddWebhook,
  EditWebhook,
  DashboardPage,
  TenantConfiguration,
  AddTenant,
  InstallShopify,
  Inventory,
  ApiKeys,
  BrandList,
  CategoryList,
  OrderShopifyList
} from '../pageListAsync';
import ClientSettings from '../Shopify/Components/Administration/ClientSettings';

export const DashboardRoute = { link: '/dashboard', component: DashboardPage };

export const OrdersRoute = { link: '/orders', component: Orders };

export const OrdersShopifyRoute = { link: '/shopify-orders', component: OrderShopifyList };

export const OrderDetailsRoute = {
  link: '/orders/:id',
  component: OrderDetails
};

export const ShopifyOrderDetailsRoute = {
  link: '/shopify-orders/:id',
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

export const VariantsRoute = {
  link: '/products/:id/variants',
  component: Variants
};

export const AddVariantRoute = {
  link: '/products/:id/variants/add-variant',
  component: AddVariant
};

export const EditVariantRoute = {
  link: '/products/:productId/variants/:variantId',
  component: EditVariant
};

export const InventoryRoute = { link: '/inventory', component: Inventory };

export const AvailableIntegrationsRoute = {
  link: '/available-integrations',
  component: AvailableIntegrations
};

export const ChannelsRoute = { link: '/channels', component: Channels };

export const IntegrationsRoute = {
  link: '/connected-integrations',
  component: Integrations
};

export const AddIntegrationFormRoute = {
  link: '/integrations/add-integration',
  component: IntegrationForm
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
  link: '/client-settings',
  component: ClientSettings
};

export const ApiKeysRoute = {
  link: '/api-keys',
  component: ApiKeys
};

export const BrandRoute = {
  link: '/connected-integrations/:integration_id/brands',
  component: BrandList
};

export const CategoryRoute = {
  link: '/connected-integrations/:integration_id/categories',
  component: CategoryList
};

export const OmnaAppRoutes = [
  DashboardRoute,
  // Products
  VariantsRoute,
  ProductsRoute,
  AddProductRoute,
  AddVariantRoute,
  EditProductRoute,
  EditVariantRoute,
  // Inventory
  InventoryRoute,
  // Integrations
  AvailableIntegrationsRoute,
  ChannelsRoute,
  IntegrationsRoute,
  AddIntegrationFormRoute,
  OrdersRoute,
  OrderDetailsRoute,
  TasksRoute,
  TaskDetailsRoute,
  WorkflowsRoute,
  AddWorkflowRoute,
  EditWorkflowRoute,
  AddTenantRoute,
  WebhooksRoute,
  AddWebhookRoute,
  EditWebhookRoute,
  // Settings
  InstallShopifyRoute,
  DashboardPageRoute,
  TenantConfigurationRoute,
  ApiKeysRoute,
  BrandRoute,
  CategoryRoute
];

export const OmnaShopifyRoutes = [
  DashboardRoute,
  // Products
  VariantsRoute,
  ProductsRoute,
  AddProductRoute,
  EditProductRoute,
  EditVariantRoute,
  // Inventory
  InventoryRoute,
  // Integrations
  AvailableIntegrationsRoute,
  ChannelsRoute,
  IntegrationsRoute,
  AddIntegrationFormRoute,
  // Orders
  OrdersRoute,
  OrderDetailsRoute,
  OrdersShopifyRoute,
  ShopifyOrderDetailsRoute,
  // Tasks
  TasksRoute,
  TaskDetailsRoute,
  // Settings
  InstallShopifyRoute,
  DashboardPageRoute,
  ApiKeysRoute,
  BrandRoute,
  CategoryRoute
];

export const OmnaShopifyAdminRoutes = [
  ClientSettingsRoute
];
