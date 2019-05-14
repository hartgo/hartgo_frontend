const routes = [{
  path: '/system',
  name: 'System',
  component: () => import('@/pages/system/Main'),
  meta: {
    requireAuth: true
  },
  children: [{
    path: 'params',
    alias: '',
    name: 'SystemParams',
    component: () => import('@/pages/system/params/Main'),
    meta: {
      requireAuth: true
    },
    children: [{
      path: 'list',
      alias: '',
      name: 'ParamsList',
      component: () => import('@/pages/system/params/List'),
      meta: {
        requireAuth: true
      }
    }]
  }]
}]

export default routes
