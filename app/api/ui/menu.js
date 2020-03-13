module.exports = [
  {
    key: 'dashboard',
    name: 'Dashboard',
    icon: 'ios-stats-outline',
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
        key: 'my-integrations',
        name: 'My Integrations',
        link: '/app/integrations'
      },
      {
        key: 'available-integrations',
        name: 'Available Integrations',
        link: '/app/available-integrations'
      }
    ]
  },
  {
    key: 'settings',
    name: 'Settings',
    icon: 'ios-settings',
    child: [
      {
        key: 'collections',
        name: 'Collections',
        link: '/app/collections'
      },
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
    icon: 'ios-grid-outline',
    link: '/app/tasks'
  }
  // {
  //   key: 'pages',
  //   name: 'Pages',
  //   icon: 'ios-paper-outline',
  //   child: [
  //     {
  //       key: 'other_page',
  //       name: 'Welcome Page',
  //       title: true
  //     },
  //     {
  //       key: 'blank',
  //       name: 'Blank Page',
  //       link: '/app'
  //     },
  //     {
  //       key: 'main_page',
  //       name: 'Sample Page',
  //       title: true
  //     },
  //     {
  //       key: 'dashboard',
  //       name: 'Dashboard',
  //       link: '/app/dashboard'
  //     },
  //     {
  //       key: 'form',
  //       name: 'Form',
  //       link: '/app/form'
  //     },
  //     {
  //       key: 'table',
  //       name: 'Table',
  //       link: '/app/table'
  //     },
  //     {
  //       key: 'maintenance',
  //       name: 'Maintenance',
  //       link: '/maintenance'
  //     },
  //     {
  //       key: 'coming_soon',
  //       name: 'Coming Soon',
  //       link: '/coming-soon'
  //     }
  //   ]
  // },
  // {
  //   key: 'auth',
  //   name: 'Auth Page',
  //   icon: 'ios-contact-outline',
  //   child: [
  //     {
  //       key: 'login',
  //       name: 'Login',
  //       link: '/login'
  //     },
  //     {
  //       key: 'register',
  //       name: 'Register',
  //       link: '/register'
  //     },
  //     {
  //       key: 'reset',
  //       name: 'Reset Password',
  //       link: '/reset-password'
  //     },
  //     {
  //       key: 'lock',
  //       name: 'Lock Screen',
  //       link: '/lock-screen'
  //     }
  //   ]
  // },
  // {
  //   key: 'errors',
  //   name: 'Errors',
  //   icon: 'ios-paw-outline',
  //   child: [
  //     {
  //       key: 'not_found_page',
  //       name: 'Not Found Page',
  //       link: '/app/pages/not-found'
  //     },
  //     {
  //       key: 'error_page',
  //       name: 'Error Page',
  //       link: '/app/pages/error'
  //     }
  //   ]
  // },
  // {
  //   key: 'menu_levels',
  //   name: 'Menu Levels',
  //   multilevel: true,
  //   icon: 'ios-menu-outline',
  //   child: [
  //     {
  //       key: 'level_1',
  //       name: 'Level 1',
  //       link: '/#'
  //     },
  //     {
  //       key: 'level_2',
  //       keyParent: 'menu_levels',
  //       name: 'Level 2',
  //       child: [
  //         {
  //           key: 'sub_menu_1',
  //           name: 'Sub Menu 1',
  //           link: '/#'
  //         },
  //         {
  //           key: 'sub_menu_2',
  //           name: 'Sub Menu 2',
  //           link: '/#'
  //         }
  //       ]
  //     }
  //   ]
  // }
];
