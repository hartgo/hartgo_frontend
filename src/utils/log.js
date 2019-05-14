import dayjs from 'dayjs'

const LEVEL_MAP = ['DEBUG', 'INFO', 'WARNING', 'ERROR'];

/**
 * 日志打印对象
 * 注：为了能正确接受调用处传入的参数（使用arguments对象接受参数），所有方法一定不能使用箭头函数的写法，一定要使用function声明函数，不可使用箭头函数
 */
const log = {
  /**
   * getLogStr 获取打印日志参数字符串
   * @param {Array} params 待打印的日志参数数组
   */
  getLogStr: (params) => {
    let timeStr = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss.SSS');
    let logStr = '[' + timeStr + ']: ';
    if (params && params.length) {
      let temp = [];
      let i = 0;
      while (i < params.length) {
        let item = params[i]
        if (typeof item === 'object') {
          item = JSON.stringify(item);
        }
        // item = '参数' + (i + 1) + ':' + item;
        temp.push(item);
        i++;
      }
      logStr += temp.join(' ');
    } else {
      logStr += '日志信息为空';
    }
    return logStr;
  },

  /**
   * debug 打印DEBUG级别日志，主要用于打印调测日志
   * @param {Object} arguments 待打印的日志参数
   */
  debug: function() {
    if (LEVEL_MAP.indexOf(window.systemConfig.LOG_LEVEL) <= LEVEL_MAP.indexOf('DEBUG')) {
      console.info('[DEBUG]' + log.getLogStr(arguments));
    }
  },

  /**
   * info 打印INFO级别日志，主要用于打印参数，打印实体类等信息，如方法入口，方法出口等用于跟踪业务逻辑的信息
   * @param {Object} arguments 待打印的日志参数
   */
  info: function() {
    if (LEVEL_MAP.indexOf(window.systemConfig.LOG_LEVEL) <= LEVEL_MAP.indexOf('INFO')) {
      console.info('[INFO]', log.getLogStr(arguments));
    }
  },

  /**
   * warn 打印WARNING级别日志，主要用于打印告警信息，如某个页面需要展示某数据，但是数据为空，此时可以打印告警日志
   * @param {Object} arguments 待打印的日志参数
   */
  warn: function() {
    if (LEVEL_MAP.indexOf(window.systemConfig.LOG_LEVEL) <= LEVEL_MAP.indexOf('WARNING')) {
      console.warn('[WARNING]' + log.getLogStr(arguments));
    }
  },

  /**
   * error 打印ERROR级别日志，当数据出现错误而影响基础功能时，打印错误日志。如新增功能必须要选择区域信息，但是区域信息为空，则打印错误日志提示
   * @param {Object} arguments 待打印的日志参数
   */
  error: function() {
    if (LEVEL_MAP.indexOf(window.systemConfig.LOG_LEVEL) <= LEVEL_MAP.indexOf('ERROR')) {
      console.error('[ERROR]' + log.getLogStr(arguments));
    }
  }
}

export default log
