module.exports = [
  {
    key: 'dashboard',
    name: 'Dashboard',
    icon: 'md-analytics',
    link: '/app/dashboard'
  },
  {
    key: 'data',
    name: 'Data',
    icon: 'ios-apps-outline',
    child: [
      {
        key: 'orders',
        name: 'Orders',
        icon: 'md-list',
        link: '/app/orders-list'
      }
    ]
  },
  {
    key: 'settings',
    name: 'Settings',
    icon: 'ios-settings',
    child: [
      {
        key: 'integrations',
        name: 'Integrations',
        icon: 'ios-home-outline',
        link: '/app/settings/integrations'
      },
      {
        key: 'workflows',
        name: 'Workflows',
        icon: 'ios-shuffle',
        link: '/app/settings/workflows'
<<<<<<< HEAD
      },
      {
        key: 'webhooks',
        name: 'Webhooks',
        icon: 'ios-globe',
        link: '/app/settings/webhooks-list'
      }
=======
      }
      // {
      //   key: 'webhooks',
      //   name: 'Webhooks',
      //   icon: 'ios-globe',
      //   link: '/app/settings/webhooks-list'
      // }
>>>>>>> Add pagination to Flows view
    ]
  },
  {
    key: 'tasks',
    name: 'Tasks',
    icon: 'ios-grid-outline',
    link: '/app/tasks-list'
  }
];
