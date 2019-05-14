/**
 * Created by FangShenglong at 2018/12/07
 */
import cacheKeys from '@/utils/cacheKeys'

/**
 * 登录成功后缓存用户相关信息
 * @param commit
 * @param param
 * @constructor
 */
export const loginSuccess = ({ commit }, param) => {
  param = param || {};
  let userMenu = (param && param.userMenus) || [];
  delete param.userMenus;
  delete param.userDept;
  commit(cacheKeys.CACHE_USER_INFO, param);
  commit(cacheKeys.USER_MAIN_MENU, userMenu);
};

/**
 * 设置用户所有的菜单信息
 * @param commit
 * @param param
 */
export const setUserMainMenu = ({ commit }, param) => {
  commit(cacheKeys.USER_MAIN_MENU, param)
};

/**
 * 清除用户相关的缓存信息
 * @param commit
 * @param param
 */
export const clearUserCache = ({ commit }, param) => {
  // 在清除缓存前，先清空用户信息，因为调用清除缓存操作为异步操作，未能及时清除用户信息，导致无法跳转至登录页面
  commit(cacheKeys.CACHE_USER_INFO, null);
  // 清空用户主菜单信息
  commit(cacheKeys.USER_MAIN_MENU, null);
  // 清空UUID信息
  commit(cacheKeys.UUID, null);
  // 清空清空面包屑信息
  commit(cacheKeys.BREADCRUMB_LIST, null);
  // 清空子菜单信息
  commit(cacheKeys.USER_SUB_MENU, null);
  // 清空叶子菜单信息
  commit(cacheKeys.USER_LEAF_MENU, null);
};

/**
 * 清除用户信息，将用户信息置为空
 * @param commit
 * @param param
 */
export const clearUserInfo = ({ commit }, param) => {
  commit(cacheKeys.CACHE_USER_INFO, null)
};

/**
 * 缓存UUID，用于与后台建立socket连接时，作为客户端唯一标记
 * @param commit
 * @param param
 */
export const setUUID = ({ commit }, param) => {
  commit(cacheKeys.UUID, param)
};

/**
 * 缓存页面面包屑列表
 * @param commit
 * @param param
 */
export const breadcrumbList = ({ commit }, param) => {
  commit(cacheKeys.BREADCRUMB_LIST, param)
};

/**
 * 缓存页面子菜单列表
 * @param commit
 * @param param
 */
export const setSubMenu = ({ commit }, param) => {
  commit(cacheKeys.USER_SUB_MENU, param)
};

/**
 * 缓存页面叶子菜单列表
 * @param commit
 * @param param
 */
export const setLeafMenu = ({ commit }, param) => {
  commit(cacheKeys.USER_LEAF_MENU, param)
};
