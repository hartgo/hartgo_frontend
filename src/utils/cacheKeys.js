/**
 * 定义所有缓存的Key，所有设置和使用缓存时，只能从当前配置中获取Key，不可在业务代码中直接将Key以字符串的形式使用
 */
export default {
  // 缓存后台返回的用户基本信息，只缓存用户基本信息，不缓存权限和中心信息
  CACHE_USER_INFO: 'CACHE_USER_INFO',
  // 缓存UUID
  UUID: 'UUID',
  // 缓存用户拥有的菜单权限树状列表，从登录成功后的用户信息中获取进行缓存
  USER_MAIN_MENU: 'USER_MAIN_MENU',
  // 缓存用户展示的子菜单列表
  USER_SUB_MENU: 'USER_SUB_MENU',
  // 缓存用户展示的叶子菜单列表
  USER_LEAF_MENU: 'USER_LEAF_MENU',
  // 缓存用户拥有的中心列表，从登录成功后的用户信息中获取进行缓存
  USER_OWNCENTRAL: 'USER_OWNCENTRAL',
  // 缓存面包屑列表，因为面包屑存放在公共组件中，因此需要将列表存放在缓存中
  BREADCRUMB_LIST: 'BREADCRUMB_LIST',
  // 当前用户选择的中心节点，系统中所有的中心数据需要根据该中心获取
  CURRENT_CONTROL_INFO: 'CURRENT_CONTROL_INFO',
  // 缓存用户选中的语种
  CURRENT_LANGUAGE: 'CURRENT_LANGUAGE'
}
