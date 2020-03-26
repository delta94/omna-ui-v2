import React from 'react';
import DashboardIcon from '@material-ui/icons/Dashboard';
import DataIcon from '@material-ui/icons/Apps';
import SettingsIcon from '@material-ui/icons/Settings';
import TasksIcon from '@material-ui/icons/PlaylistAddCheck';

export default [
  {
    key: 'dashboard',
    name: 'Dashboard',
    icon: <DashboardIcon />,
    link: '/app/dashboard'
  },
  {
    key: 'data',
    name: 'Data',
    icon: <DataIcon />,
    child: [
      {
        key: 'orders',
        name: 'Orders',
        link: '/app/orders'
      },
      {
        key: 'products',
        name: 'Products',
        link: '/app/products'
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
        link: '/app/channels'
      },
      {
        key: 'available-integrations',
        name: 'Available Integrations',
        link: '/app/available-integrations'
      },
      {
        key: 'installed-integrations',
        name: 'Installed Integrations',
        link: '/app/installed-integrations'
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
        link: '/app/workflows'
      },
      {
        key: 'webhooks',
        name: 'Webhooks',
        link: '/app/webhooks'
      }
    ]
  },
  {
    key: 'tasks',
    name: 'Tasks',
    icon: <TasksIcon />,
    link: '/app/tasks'
  }
];
