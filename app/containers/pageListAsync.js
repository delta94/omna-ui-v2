import React from 'react';
import Loading from 'dan-components/Loading';
import loadable from '../utils/loadable';

export const BlankPage = loadable(() => import('./Pages/BlankPage'), {
  fallback: <Loading />
});
export const DashboardPage = loadable(() => import('./Pages/Dashboard'), {
  fallback: <Loading />
});
export const Form = loadable(() => import('./Pages/Forms/ReduxForm'), {
  fallback: <Loading />
});
export const Table = loadable(() => import('./Pages/Table/BasicTable'), {
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
// OMNA
export const Dashboard = loadable(() => import('./Omna/Tasks/TaskList'), {
  fallback: <Loading />
});

export const Tasks = loadable(() => import('./Omna/Tasks/TaskList'), {
  fallback: <Loading />
});

export const TaskDetails = loadable(() => import('./Omna/Tasks/TaskDetails'), {
  fallback: <Loading />
});

export const Orders = loadable(() => import('./Omna/Orders/OrderList'), {
  fallback: <Loading />
});

export const OrderDetails = loadable(
  () => import('./Omna/Orders/OrderDetails'),
  {
    fallback: <Loading />
  }
);

export const Webhooks = loadable(
  () => import('./Omna/Settings/Webhooks/WebhookList'),
  {
    fallback: <Loading />
  }
);

export const CreateWebhook = loadable(
  () => import('./Omna/Settings/Webhooks/CreateWebhook'),
  {
    fallback: <Loading />
  }
);

export const Products = loadable(() => import('./Omna/Products/ProductList'), {
  fallback: <Loading />
});

export const Integrations = loadable(
  () => import('./Omna/Settings/Integrations/Integrations'),
  {
    fallback: <Loading />
  }
);

export const AddIntegrationForm = loadable(
  () => import('./Omna/Settings/Integrations/AddIntegrationForm'),
  {
    fallback: <Loading />
  }
);

export const Workflows = loadable(() => import('./Omna/Settings/Flows/Flows'), {
  fallback: <Loading />
});

export const AddWorkflow = loadable(
  () => import('./Omna/Settings/Flows/AddFlowForm'),
  {
    fallback: <Loading />
  }
);

export const EditWorkflow = loadable(
  () => import('./Omna/Settings/Flows/EditFlowForm'),
  {
    fallback: <Loading />
  }
);
