import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions/actions'
import cacheKeys from '@/utils/cacheKeys'
import {localStorage} from '@/utils/storage'

Vue.use(Vuex);

export default new Vuex.Store({
  actions,
  state: {
    // 当前登录的用户信息，只保持用户基本信息，用户权限信息和其他信息已从该对象中删除
    userInfo: localStorage.getObject(cacheKeys.CACHE_USER_INFO) || null,
    // 用户登录成功后，生成唯一的uuid，该uuid用于与后台创建WebSocket连接时使用，用于标识唯一会话
    uuid: localStorage.getObject(cacheKeys.UUID) || null,
    // 用户菜单权限数据，该数据根据登录的用户信息一起返回，数据单独存储：用于做权限控制，和菜单展示
    userMenu: localStorage.getObject(cacheKeys.USER_MAIN_MENU) || [],
    // 面包屑列表，每深入一级菜单会新增一个面包屑选项
    breadcrumbList: localStorage.getObject(cacheKeys.BREADCRUMB_LIST) || [],
    // 当前主菜单下的子菜单列表（二级菜单），展示在页面右上角的菜单列表
    subMenu: localStorage.getObject(cacheKeys.USER_SUB_MENU) || [],
    // 当前二级菜单下的子菜单列表（三级菜单），展示在页面的左上角的菜单列表，因为目前规划的最多三级菜单，因此三级菜单也叫叶子菜单
    leafMenu: localStorage.getObject(cacheKeys.USER_LEAF_MENU) || []
  },
  getters: {
    userInfo(state) {
      return state.userInfo
    },
    getUUID(state) {
      return state.uuid
    },
    breadcrumbList(state) {
      return state.breadcrumbList
    },
    userMenu(state) {
      return state.userMenu
    },
    subMenu(state) {
      return state.subMenu
    },
    leafMenu(state) {
      return state.leafMenu
    }
  },
  mutations: {
    [cacheKeys.CACHE_USER_INFO](state, data) {
      state.userInfo = data;
      localStorage.setObject(cacheKeys.CACHE_USER_INFO, data)
    },
    [cacheKeys.UUID](state, data) {
      state.uuid = data;
      localStorage.setObject(cacheKeys.UUID, data)
    },
    [cacheKeys.BREADCRUMB_LIST](state, data) {
      state.breadcrumbList = data;
      localStorage.setObject(cacheKeys.BREADCRUMB_LIST, data)
    },
    [cacheKeys.USER_MAIN_MENU](state, data) {
      state.userMenu = data;
      localStorage.setObject(cacheKeys.USER_MAIN_MENU, data)
    },
    [cacheKeys.USER_SUB_MENU](state, data) {
      state.subMenu = data;
      localStorage.setObject(cacheKeys.USER_SUB_MENU, data)
    },
    [cacheKeys.USER_LEAF_MENU](state, data) {
      state.leafMenu = data;
      localStorage.setObject(cacheKeys.USER_LEAF_MENU, data)
    }
  }
})
