const routes = [{
  path: '/servicemgmt',
  name: 'Servicemgmt',
  component: () => import('@/pages/servicemgmt/Main'),
  meta: {
    requireAuth: true
  },
  children: [{
    path: 'service',
    alias: '',
    name: 'ServiceManage',
    component: () => import('@/pages/servicemgmt/service/Main'),
    meta: {
      requireAuth: true
    },
    children: [{
      path: 'list',
      alias: '',
      name: 'ServiceList',
      component: () => import('@/pages/servicemgmt/service/List'),
      meta: {
        requireAuth: true
      }
    }, {
      path: 'rulelist',
      name: 'ServiceRuleList',
      component: () => import('@/pages/servicemgmt/service/RuleList'),
      meta: {
        requireAuth: true,
        breadcrumb: '计价规则'
      }
    }]
  }, {
    path: 'point',
    name: 'PointManage',
    component: () => import('@/pages/servicemgmt/point/Main'),
    meta: {
      requireAuth: true
    },
    children: [{
      path: 'list',
      alias: '',
      name: 'PointList',
      component: () => import('@/pages/servicemgmt/point/List'),
      meta: {
        requireAuth: true
      }
    }]
  }]
}]

export default routes
