const routes = [{
  path: '/report',
  name: 'Report',
  component: () => import('@/pages/report/Main'),
  meta: {
    requireAuth: true
  },
  children: [{
    path: 'bill',
    alias: '',
    name: 'BillReport',
    component: () => import('@/pages/report/bill/Main'),
    meta: {
      requireAuth: true
    },
    children: [{
      path: 'list',
      alias: '',
      name: 'BillList',
      component: () => import('@/pages/report/bill/List'),
      meta: {
        requireAuth: true
      }
    }]
  }, {
    path: 'order',
    alias: '',
    name: 'OrderReport',
    component: () => import('@/pages/report/order/Main'),
    meta: {
      requireAuth: true
    },
    children: [{
      path: 'list',
      alias: '',
      name: 'OrderList',
      component: () => import('@/pages/report/order/List'),
      meta: {
        requireAuth: true
      }
    }]
  }, {
    path: 'revenue',
    alias: '',
    name: 'RevenueReport',
    component: () => import('@/pages/report/revenue/Main'),
    meta: {
      requireAuth: true
    },
    children: [{
      path: 'list',
      alias: '',
      name: 'RevenueList',
      component: () => import('@/pages/report/revenue/List'),
      meta: {
        requireAuth: true
      }
    }]
  }, {
    path: 'task',
    alias: '',
    name: 'TaskReport',
    component: () => import('@/pages/report/task/Main'),
    meta: {
      requireAuth: true
    },
    children: [{
      path: 'list',
      alias: '',
      name: 'TaskList',
      component: () => import('@/pages/report/task/List'),
      meta: {
        requireAuth: true
      }
    }]
  }]
}]

export default routes
