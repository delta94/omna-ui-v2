/* eslint-disable */
import React from 'react';
import Loading from 'dan-components/Loading';
import loadable from '../utils/loadable';

// Landing Page
// export const Analytics = loadable(() => import('./Widgets/Analytics'), {
//   fallback: <Loading />
// });

// Other
export const NotFound = loadable(() => import('./NotFound/NotFound'), {
  fallback: <Loading />
});

export const NotFoundDedicated = loadable(
  () => import('./Pages/Standalone/NotFoundDedicated'),
  {
    fallback: <Loading />
  }
);

export const Error = loadable(() => import('./Pages/Error'), {
  fallback: <Loading />
});

export const Maintenance = loadable(() => import('./Pages/Maintenance'), {
  fallback: <Loading />
});

export const Parent = loadable(() => import('./Parent'), {
  fallback: <Loading />
});

export const Settings = loadable(() => import('./Pages/Settings'), {
  fallback: <Loading />
});

export const HelpSupport = loadable(() => import('./Pages/HelpSupport'), {
  fallback: <Loading />
});

// OMNA
// export const Dashboard = loadable(() => import('./Omna/Tasks/TaskList'), {
//   fallback: <Loading />
// });

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
