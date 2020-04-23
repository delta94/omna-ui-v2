module.exports = [
  // {
  //   key: 'dashboard',
  //   name: 'Dashboard',
  //   icon: 'ios-stats-outline',
  //   link: '/dashboard'
  // },
  {
    key: 'settings',
    name: 'Settings',
    icon: 'ios-apps-outline',
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
      }
    ]
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
