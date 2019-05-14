import Vue from 'vue'
import Router from 'vue-router'
import store from '@/lib/store'
import utils from '@/utils'
import i18n from '@/utils/i18n'
import appConfig from '@/utils/appConfig'
import log from '@/utils/log'

import common from '@/router/common'
import system from '@/router/system'
import accountmgmt from '@/router/accountmgmt'
import servicemgmt from '@/router/servicemgmt'
import report from '@/router/report'
Vue.use(Router)

const routes = [
  // 本地登录
  {
    // 登录页面路由地址
    path: '/login',
    name: 'Login',
    alias: '',
    component: () => import('@/pages/Login'),
    meta: {
      requireAuth: false
    }
  }, {
    // 系统首页路由地址
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/Dashboard'),
    meta: {
      requireAuth: true
    },
    children: [{
      path: 'home',
      name: 'HomePage',
      alias: '',
      component: () => import('@/pages/Home'),
      meta: {
        requireAuth: true
      }
    },
    ...common,
    ...system,
    ...accountmgmt,
    ...servicemgmt,
    ...report
    ]
  }
];

const router = new Router({
  routes
});
/**
 * 路由跳转前进行权限控制
 */
router.beforeEach((to, from, next) => {
  // 将当所有正在请求而未返回的请求取消，避免路由跳转后，请求中的数据又返回了
  if (window._axiosPromiseArr && window._axiosPromiseArr.length) {
    window._axiosPromiseArr.forEach((req, index) => {
      req.cancel();
      delete window._axiosPromiseArr[index]
    });
    window._axiosPromiseArr = [];
  }
  // 待跳转的路由是否需要登录权限，如需要登录权限
  // 则判断当前用户是否已登录（根据缓存中是否有用户信息来判断）
  //     如用户未登录：则跳转至登录页面
  //     如用户已登录：则跳转至目标页面
  let userInfo = store.getters.userInfo;
  // 如果跳转的页面为用户登录页面，则在跳转前，将当前页面路径信息传入登录页面，用于登录成功后进行页面跳转
  if (to.path === appConfig.LOGIN_PAGE && from.path !== appConfig.LOGIN_PAGE) {
    // 没有页面参数的情况下，再将跳转前的页面路由信息传至登录页面，如果登录页面已经包含页面参数，则不再进行页面跳转
    if (!to.query && !to.params) {
      next({
        path: appConfig.LOGIN_PAGE,
        query: utils.buildQueryParams({ path: from.path, query: from.query, params: from.params })
      });
    } else {
      next();
    }
  } else if (to.meta && to.meta.requireAuth) {
    if (userInfo !== undefined && userInfo !== null) {
      // 如果当前路由配置了权限码，则不进行路由跳转
      if (to.meta.authCode && to.meta.authCode !== -1) {
        if (!utils.checkAuth(to.meta.authCode)) {
          log.warn('页面权限校验失败，阻止页面跳转。页面地址为：', to.path, '，页面权限码为：', to.meta.authCode);
          return;
        }
      }
      // 当用户路由发生变化时，系统根据用户将要跳转的路由改变用户的子菜单列表
      let userMenu = store.getters.userMenu;
      if (userMenu && userMenu.length) {
        /* ---------------- 一级菜单路由跳转控制 ---------------- */
        /* 路由发生跳转前，如果当前访问的路由为一级菜单路由
         * 则需要判断当前的一级菜单下是否还有二级菜单，如果当前访问的一级菜单下有二级菜单
         * 则需要对路由进行再次跳转至第一个二级菜单的地址
         * 即：系统不允许访问菜单路径，只允许访问页面地址
         */
        // 首先判断当前访问的路由是否为一级菜单路由
        let firstMenu = userMenu.find((item) => {
          return item.url === to.path;
        });
        // 如果访问的地址是一级路由地址，则判断当前一级菜单下是否有二级菜单
        if (firstMenu && firstMenu.children && firstMenu.children[0] &&
          appConfig.MENU_TYPE.indexOf(firstMenu.children[0].menuType) !== -1) {
          if (!firstMenu.children[0].url || !firstMenu.children[0].url.length) {
            log.error('二级菜单地址为空，页面跳转失败，菜单名称为：', firstMenu.children[0].menuName);
            return;
          }
          router.push({
            path: firstMenu.children[0].url
          });
          return;
        }
        /* ---------------- 一级菜单路由跳转控制 ---------------- */

        // 获取根目录路由
        let rootPath = '/' + to.path.split('/')[1];
        // 根据根目录路由寻找匹配的根目录菜单节点
        let menuInfo = userMenu.find((item) => {
          return item.url === rootPath;
        });
        let activeSubMenu = null;
        let activeLeafMenu = null;
        if (menuInfo && menuInfo.children && menuInfo.children.length) {
          /* ---------------- 二级菜单路由跳转控制 ---------------- */
          /* 二级菜单下是否还有三级菜单，如果当前访问的二级菜单下有三级菜单
           * 则需要对路由进行再次跳转至第一个三级菜单的地址
           * 即：系统不允许访问菜单路径，只允许访问页面地址
           */
          // 判断当前访问的路由是否为二级菜单路由
          let secondMenu = menuInfo.children.find((item) => {
            return item.url === to.path;
          });
          // 如果访问的地址是二级路由地址，则判断当前二级菜单下是否有三级菜单
          if (secondMenu && secondMenu.children && secondMenu.children[0] &&
            appConfig.MENU_TYPE.indexOf(secondMenu.children[0].menuType) !== -1) {
            if (!secondMenu.children[0].url || !secondMenu.children[0].url.length) {
              log.error('三级菜单地址为空，页面跳转失败，菜单名称为：', secondMenu.children[0].menuName);
              return;
            }
            router.push({
              path: secondMenu.children[0].url
            });
            return;
          }
          /* ---------------- 二级菜单路由跳转控制 ---------------- */
          let subMenuActive = false;
          menuInfo.children.forEach((item) => {
            if (to.path.indexOf(item.url) !== -1) {
              item.active = true;
              activeSubMenu = item;
              subMenuActive = true;
            } else {
              item.active = false;
            }
          })
          if (!subMenuActive) {
            menuInfo.children[0].active = true;
            activeSubMenu = menuInfo.children[0];
          }
          if (activeSubMenu && activeSubMenu.children && activeSubMenu.children.length) {
            if (appConfig.MENU_TYPE.indexOf(activeSubMenu.children[0].menuType) !== -1) {
              let leafMenu = activeSubMenu.children;
              activeLeafMenu = leafMenu.find((item) => {
                return to.path.indexOf(item.url) === 0;
              });
              store.dispatch('setLeafMenu', leafMenu);
            } else {
              store.dispatch('setLeafMenu', null);
            }
          } else {
            store.dispatch('setLeafMenu', null);
          }
          store.dispatch('setSubMenu', menuInfo.children);
        } else {
          store.dispatch('setSubMenu', null);
          store.dispatch('setLeafMenu', null);
        }
        // 根据即将要到达的页面，封装页面面包屑导航栏
        let breadcrumbList = [{
          menuName: i18n.t('system.common.message.homepage'),
          url: appConfig.HOME_PAGE
        }];
        // 此处已知当前菜单级别不会超过三级，因此往菜单以下找三级即可，也可在utils中进行递归处理（暂不进行递归）
        if (menuInfo && menuInfo.url && menuInfo.menuName) {
          breadcrumbList.push({
            menuName: menuInfo.menuName,
            url: menuInfo.url
          });
        }
        if (activeSubMenu && activeSubMenu.url && activeSubMenu.menuName) {
          breadcrumbList.push({
            menuName: activeSubMenu.menuName,
            url: activeSubMenu.url
          });
        }
        if (activeLeafMenu && activeLeafMenu.url && activeLeafMenu.menuName) {
          breadcrumbList.push({
            menuName: activeLeafMenu.menuName,
            url: activeLeafMenu.url
          });
        }
        // 如果当前目标路由地址包含面包屑配置，则需要封装一层面包屑信息
        if (to.meta && to.meta.breadcrumb && to.meta.breadcrumb.length) {
          breadcrumbList.push({
            menuName: to.meta.breadcrumb,
            url: to.fullPath
          });
        }
        store.dispatch('breadcrumbList', breadcrumbList);
      }
      next()
    } else {
      log.warn('当前页面需要登录才能访问，检测用户信息为空，跳转至登录页面。页面地址为：', to.path);
      next({
        path: appConfig.LOGIN_PAGE,
        query: utils.buildQueryParams({ path: to.path, query: to.query, params: to.params })
      });
      // 跳转至登录页面时，同时清空本地缓存
      store.dispatch('clearUserCache');
    }
  } else {
    // 如果用户访问的路由在当前页面没有进行配置，则将路由跳转至首页
    if (!to || !to.name) {
      log.warn('访问的页面不存在，跳转至提示页面。页面地址为：', to.path);
      router.push({
        path: appConfig.PAGE_NOT_FOUND
      });
    } else {
      next()
    }
  }
});

export default router
