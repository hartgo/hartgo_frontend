/**
 * 定义工程中所有需调用的API接口地址：
 *     1、所有接口地址必须以服务器为分组的形式进行配置
 *     2、不允许在业务代码中直接使用接口地址
 * 便于接口的同一维护修改：
 *     1、接口名称必须使用有正确含义的单词定义
 *     2、命名规范遵循驼峰命名法
 */
export const api = {
  /**
   * platform服务器接口定义
   */
  platform: {
    // 用户登录
    userLogin: '/smp/myLogin.json',
    // 用户登出
    userLogout: '/smp/logout',
    // 查询版本信息
    getVersionInfo: '/smp/getVersionInfo',
    // 获取用户菜单信息（根据语种获取菜单）
    getUserMenu: '/smp/getUserMenu'
  }
};
