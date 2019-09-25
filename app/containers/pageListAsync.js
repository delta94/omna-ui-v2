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

export const Maintenance = loadable(() => import('./Pages/Maintenance'), {
  fallback: <Loading />,
});

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

export const Orders = loadable(() => import('./Orders/OrderList'), {
  fallback: <Loading />
});

export const OrderDetails = loadable(
  () => import('./Orders/OrderDetails'),
  {
    fallback: <Loading />
  }
);

export const Webhooks = loadable(
  () => import('./Settings/Webhooks/WebhookList'),
  {
    fallback: <Loading />
  }
);

export const CreateWebhook = loadable(
  () => import('./Settings/Webhooks/CreateWebhook'),
  {
    fallback: <Loading />
  }
);

export const Products = loadable(() => import('./Products/ProductList'), {
  fallback: <Loading />
});

export const Integrations = loadable(
  () => import('./Settings/Integrations/Integrations'),
  {
    fallback: <Loading />
  }
);

export const AddIntegrationForm = loadable(
  () => import('./Settings/Integrations/AddIntegrationForm'),
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
