module.exports = [
  // {
  //   key: 'dashboard',
  //   name: 'Dashboard',
  //   icon: 'ios-stats-outline',
  //   link: '/dashboard'
  // },
  {
    key: 'plans',
    name: 'Plans Settings',
    icon: 'ios-stats-outline',
    link: '/shopify'
  },
  {
    key: 'data',
    name: 'Data',
    icon: 'ios-apps-outline',
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
      },
      {
        key: 'installed-integrations',
        name: 'Installed Integrations',
        link: '/installed-integrations'
      },
    ]
  }
];
