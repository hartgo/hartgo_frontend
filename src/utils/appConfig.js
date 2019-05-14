export default {
  // 登录页面路由地址，所有需要跳转到登录页面的业务都使用该配置
  LOGIN_PAGE: '/login',
  // 工程首页路由地址
  HOME_PAGE: '/dashboard/home',
  // 页面无法找到的路由地址（当用户输入的地址不存在跳转至当前页面）
  PAGE_NOT_FOUND: '/pagenotfound',
  // AES方式加密使用的秘钥，与平台约定使用的秘钥
  AES_KEY: 'HarGo12345',
  // AES方式加密使用的秘钥偏移量
  AES_IV: 'HarGo12345',
  // SHA方式加密使用的秘钥，与平台约定使用的秘钥
  SHA_KEY: '0123456789ABCDEF',
  // 生成UUID使用的hexDigits字符串
  UUID_KEY: '0123456789abcdef',
  // 菜单类型，1和2表示菜单类型，用于系统中判断用户权限菜单中的节点是否为菜单，而非页面
  MENU_TYPE: ['M', 'C'],
  // 静态资源存放目录，使用
  STATIC_PATH: '@/../static/',
  // 页面主题配置
  THEME_MAP: [{
    key: 'default',
    className: 'default-theme',
    imagePath: 'default'
  }, {
    key: 'dark',
    className: 'dark-theme',
    imagePath: 'dark'
  }, {
    key: 'light',
    className: 'light-theme',
    imagePath: 'light'
  }],
  // 系统默认分页对象，所有列表页面都引入基础分页对象信息，每页展示10条数据
  pageInfo: JSON.parse(JSON.stringify({
    pageNo: 1,
    pageSize: 10
  })),
  // 页码展示的按钮数，如：1,2,3,4,5......100
  pagerCount: 5,
  // 列表数据获取时，每页对象的配置项
  pageSizes: JSON.parse(JSON.stringify([10, 30, 50, 100])),
  // 性别值和文本对应关系
  sexMap: {
    1: '男',
    2: '女',
    3: '未知'
  },
  // boolean类型的值和文本的对应关系
  booleanText: {
    1: '是',
    0: '否'
  },
  regMap: {
    email: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
  }
}
