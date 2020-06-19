import React from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard';
import DataIcon from '@material-ui/icons/Apps';
import SettingsIcon from '@material-ui/icons/Settings';
import TasksIcon from '@material-ui/icons/PlaylistAddCheck';
import DeveloperIcon from '@material-ui/icons/DeveloperMode';

export default [
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
        key: 'orders',
        name: 'Orders',
        link: '/orders'
      },
      {
        key: 'products',
        name: 'Products',
        link: '/products'
      },
      {
        key: 'inventory',
        name: 'Inventory',
        link: '/inventory'
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
        key: 'available-integrations',
        name: 'Available Integrations',
        link: '/available-integrations'
      },
      {
        key: 'installed-integrations',
        name: 'Installed Integrations',
        link: '/installed-integrations'
      }
    ]
  },
  {
    key: 'settings',
    name: 'Settings',
    icon: <SettingsIcon />,
    child: [
      {
        key: 'workflows',
        name: 'Workflows',
        link: '/workflows'
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
    key: 'developers',
    name: 'Developers',
    icon: <DeveloperIcon />,
    child: [
      {
        key: 'api-keys',
        name: 'API Keys',
        link: '/api-keys'
      },
      {
        key: 'webhooks',
        name: 'Webhooks',
        link: '/webhooks'
      }
    ]
  }
];
