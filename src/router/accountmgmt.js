const routes = [{
  path: '/accountmgmt',
  name: 'Accountmgmt',
  component: () => import('@/pages/accountmgmt/Main'),
  meta: {
    requireAuth: true
  },
  children: [{
    path: 'user',
    alias: '',
    name: 'UserManage',
    component: () => import('@/pages/accountmgmt/user/Main'),
    meta: {
      requireAuth: true
    },
    children: [{
      path: 'list',
      alias: '',
      name: 'UserList',
      component: () => import('@/pages/accountmgmt/user/List'),
      meta: {
        requireAuth: true
      }
    }]
  }, {
    path: 'tenant',
    name: 'TenantManage',
    component: () => import('@/pages/accountmgmt/tenant/Main'),
    meta: {
      requireAuth: true
    },
    children: [{
      path: 'list',
      alias: '',
      name: 'TenantList',
      component: () => import('@/pages/accountmgmt/tenant/List'),
      meta: {
        requireAuth: true
      }
    }]
  }]
}]

export default routes
