module.exports = [
  // {
  //   key: 'dashboard',
  //   name: 'Dashboard',
  //   icon: 'ios-stats-outline',
  //   link: '/app/dashboard'
  // },
  {
    key: 'plans',
    name: 'Plans Settings',
    icon: 'ios-stats-outline',
    link: '/app/shopify'
  },
  {
    key: 'data',
    name: 'Data',
    icon: 'ios-apps-outline',
    child: [
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
        key: 'installed-integrations',
        name: 'Installed Integrations',
        link: '/app/installed-integrations'
      },
    ]
  }
];
