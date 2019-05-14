'use strict';
exports.__esModule = true;
exports.default = {
  /*
   * 国际化文本资源配置文件，配置规范如下：
   * 1、所有配置的key使用全小写配置，无论有几个单词，均使用全小写，建议每个key不超过两个单词
   * 2、每个模块使用一个大的对象，如system，表示系统公共文本资源配置，如login表示登录页面的国际化配置
   * 3、每个页面必须配置在对应模块下，如事件规则（eventrule）页面的国际化必须配置在事件中心模块（eventcontral）下
   * 4、每个页面必须按功能分类国际化资源配置，如页面分类如下：lable（普通文本）、placeholder（输入框的提示文本）、button（按钮文本）、message（提示消息文本）
   * 5、每个国际化资源配置建议不要超过4层，即最深的访问层级为：system.common.button.confirm
   */
  // 公共国际化资源配置
  system: {
    // 公共文本
    common: {
      // 公共按钮文本
      button: {
        confirm: 'Confirm',
        cancel: 'Cancel',
        query: 'Query',
        clear: 'Clear',
        next: 'Next',
        previous: 'Previous',
        save: 'Save',
        add: 'Add',
        delete: 'Delete'
      },
      // 公共消息
      message: {
        homepage: 'Homepage',
        nocenter: 'No central',
        systemerror: 'System error, please wait.',
        hello: 'Hello, ',
        logout: 'Sign out'
      }
    },
    platform: {
      name: 'Management platform',
      version: ''
    },
    theme: {
      default: 'Default',
      dark: 'Dark',
      light: 'Light'
    }
  },
  // 登录页面国际化资源配置
  login: {
    label: {},
    placeholder: {
      username: 'Enter a username',
      password: 'Enter password'
    },
    button: {
      submit: 'Login'
    },
    message: {}
  }
};
