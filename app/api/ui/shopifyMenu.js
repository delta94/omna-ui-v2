import React from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard';
import DataIcon from '@material-ui/icons/Apps';
import TasksIcon from '@material-ui/icons/PlaylistAddCheck';
import SettingsIcon from '@material-ui/icons/Settings';

export const ShopifyMenu = [
  {
    key: 'dashboard',
    name: 'Dashboard',
    icon: <DashboardIcon />,
    link: '/dashboard'
  },
  {
    key: 'data',
    name: 'Data',
    icon: <DataIcon />,
    child: [
      {
        key: 'products',
        name: 'Products',
        link: '/products'
      },
      {
        key: 'inventory',
        name: 'Inventory',
        link: '/inventory'
      },
      {
        key: 'orders',
        name: 'Orders',
        link: '/orders'
      },
      {
        key: 'ordersShopify',
        name: 'Shopify Orders',
        link: '/ordersShopify'
      }
    ]
  },
  {
    key: 'integrations',
    name: 'Integrations',
    icon: 'md-git-pull-request',
    child: [
      {
        key: 'channels',
        name: 'Channels',
        link: '/channels'
      },
      {
        key: 'installed-integrations',
        name: 'Installed Integrations',
        link: '/installed-integrations'
      }
    ]
  },
  {
    key: 'tasks',
    name: 'Tasks',
    icon: <TasksIcon />,
    link: '/tasks'
  },
  {
    key: 'settings',
    name: 'Settings',
    icon: <SettingsIcon />,
    child: [
      {
        key: 'plan',
        name: 'Plans',
        link: '/shopify'
      },
      {
        key: 'workflows',
        name: 'Workflows',
        link: '/workflows'
      }
    ]
  }
];

export const ShopifyAdminMenu = [
  {
    key: 'dashboard',
    name: 'Dashboard',
    icon: <DashboardIcon />,
    link: '/dashboard'
  },
  {
    key: 'data',
    name: 'Data',
    icon: <DataIcon />,
    child: [
      {
        key: 'products',
        name: 'Products',
        link: '/products'
      },
      {
        key: 'inventory',
        name: 'Inventory',
        link: '/inventory'
      },
      {
        key: 'orders',
        name: 'Orders',
        link: '/orders'
      },
      {
        key: 'ordersShopify',
        name: 'Shopify Orders',
        link: '/ordersShopify'
      }
    ]
  },
  {
    key: 'integrations',
    name: 'Integrations',
    icon: 'md-git-pull-request',
    child: [
      {
        key: 'channels',
        name: 'Channels',
        link: '/channels'
      },
      {
        key: 'installed-integrations',
        name: 'Installed Integrations',
        link: '/installed-integrations'
      }
    ]
  },
  {
    key: 'tasks',
    name: 'Tasks',
    icon: <TasksIcon />,
    link: '/tasks'
  },
  {
    key: 'settings',
    name: 'Settings',
    icon: <SettingsIcon />,
    child: [
      {
        key: 'plan',
        name: 'Plans',
        link: '/shopify'
      },
      {
        key: 'client-settings',
        name: 'Client Settings',
        link: '/client-settings'
      },
      {
        key: 'workflows',
        name: 'Workflows',
        link: '/workflows'
      }
    ]
  }
];


export const dataMenuPlanUnactive = [
  {
    key: 'dashboard',
    name: 'Dashboard',
    icon: <DashboardIcon />,
    link: '/dashboard'
  },
  {
    key: 'data',
    name: 'Data',
    icon: <DataIcon />,
    child: [
      {
        key: 'products',
        name: 'Products',
        link: '/products'
      }
    ]
  },
  {
    key: 'integrations',
    name: 'Integrations',
    icon: 'md-git-pull-request',
    child: [
      {
        key: 'channels',
        name: 'Channels',
        link: '/channels'
      }
    ]
  },
  {
    key: 'tasks',
    name: 'Tasks',
    icon: <TasksIcon />,
    link: '/tasks'
  },
  {
    key: 'settings',
    name: 'Settings',
    icon: <SettingsIcon />,
    child: [
      {
        key: 'plan',
        name: 'Plans',
        link: '/shopify'
      }
    ]
  }
];
