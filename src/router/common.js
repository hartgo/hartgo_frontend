const routes = [{
  path: '/pagenotfound',
  name: 'PageNotFound',
  component: () => import('@/pages/common/PageNotFound'),
  meta: {
    requireAuth: true
  }
}, {
  path: '/unauthorized',
  name: 'Unauthorized',
  component: () => import('@/pages/common/Unauthorized'),
  meta: {
    requireAuth: true
  }
}];
export default routes
