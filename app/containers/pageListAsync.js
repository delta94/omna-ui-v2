import React from 'react';
import Loading from 'dan-components/Loading';
import loadable from '../utils/loadable';

export const HomePage = loadable(() => import('./LandingPage/HomePage'), {
  fallback: <Loading />
});
export const BlankPage = loadable(() => import('./Pages/BlankPage'), {
  fallback: <Loading />
});
export const DashboardPage = loadable(() => import('./Pages/Dashboard'), {
  fallback: <Loading />
});
export const Form = loadable(() => import('./Pages/Forms/ReduxForm'), {
  fallback: <Loading />
});
export const NotFound = loadable(() => import('./NotFound/NotFound'), {
  fallback: <Loading />
});
export const Login = loadable(() => import('./Pages/Users/Login'), {
  fallback: <Loading />
});
export const LoginDedicated = loadable(
  () => import('./Pages/Standalone/LoginDedicated'),
  {
    fallback: <Loading />
  }
);
export const LockScreen = loadable(() => import('./Pages/Users/LockScreen'), {
  fallback: <Loading />
});
export const Logout = loadable(() => import('./Auth/Logout'), {
  fallback: <Loading />
});

export const TenantConfiguration = loadable(
  () => import('./Pages/TenantConfiguration'),
  {
    fallback: <Loading />
  }
);

// OMNA
export const Dashboard = loadable(() => import('./Tasks/TaskList'), {
  fallback: <Loading />
});

export const Tasks = loadable(() => import('./Tasks/TaskList'), {
  fallback: <Loading />
});

export const TaskDetails = loadable(() => import('./Tasks/TaskDetails'), {
  fallback: <Loading />
});

export const Collections = loadable(() => import('./Settings/Collections/CollectionList'), {
  fallback: <Loading />
});

export const Orders = loadable(() => import('./Orders/OrderList'), {
  fallback: <Loading />
});

export const OrderDetails = loadable(() => import('./Orders/OrderDetails'), {
  fallback: <Loading />
});

export const Webhooks = loadable(
  () => import('./Settings/Webhooks/WebhookList'),
  {
    fallback: <Loading />
  }
);

export const AddWebhook = loadable(
  () => import('./Settings/Webhooks/AddWebhook'),
  {
    fallback: <Loading />
  }
);

export const EditWebhook = loadable(
  () => import('./Settings/Webhooks/EditWebhook'),
  {
    fallback: <Loading />
  }
);

export const Products = loadable(() => import('./Products/ProductList'), {
  fallback: <Loading />
});

export const EditProduct = loadable(() => import('./Products/EditProduct'), {
  fallback: <Loading />
});

export const AddProduct = loadable(() => import('./Products/AddProduct'), {
  fallback: <Loading />
});

export const AvailableIntegrations = loadable(() => import('./Integrations/AvailableIntegrations'), {
  fallback: <Loading />
});

export const Integrations = loadable(
  () => import('./Integrations/Integrations'),
  {
    fallback: <Loading />
  }
);

export const AddIntegrationForm = loadable(
  () => import('./Integrations/AddIntegrationForm'),
  {
    fallback: <Loading />
  }
);

export const Workflows = loadable(() => import('./Settings/Flows/Flows'), {
  fallback: <Loading />
});

export const AddWorkflow = loadable(
  () => import('./Settings/Flows/AddFlowForm'),
  {
    fallback: <Loading />
  }
);

export const EditWorkflow = loadable(
  () => import('./Settings/Flows/EditFlowForm'),
  {
    fallback: <Loading />
  }
);

export const AddTenant = loadable(
  () => import('./Settings/Tenants/AddTenant'),
  {
    fallback: <Loading />
  }
);

export const InstallShopify = loadable(
  () => import('./Shopify/Components/InstallShopify'),
  {
    fallback: <Loading />
  }
);
