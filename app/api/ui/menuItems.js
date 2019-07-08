module.exports = [
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
        key: 'stores',
        name: 'Stores',
        icon: 'ios-home-outline',
        link: '/app/settings/stores'
      },
      {
        key: 'workflows',
        name: 'Workflows',
        icon: 'ios-shuffle',
        link: '/app/settings/workflows'
      }
    ]
  },
  {
    key: 'tasks',
    name: 'Tasks',
    icon: 'ios-grid-outline',
    link: '/app/tasks-list'
  }
];
