/**
 * Created by FangShenglong at 2018/12/07
 * Description 该文件中主要用于定义工程中的工具函数
 */
import CryptoJS from 'crypto-js'
import { Base64 } from 'js-base64';
import dayjs from 'dayjs'
import { localStorage } from '@/utils/storage'
import appConfig from '@/utils/appConfig'
import cacheKeys from '@/utils/cacheKeys'
import log from '@/utils/log'

const utils = {
  /**
   * encryptAES AES加密字符串
   * @param {String} str 待加密的字符串
   * @param {String} key AES加密使用的秘钥
   * @returns {String} 加密后的字符串
   */
  encryptAES: (str, key) => {
    str = str || '';
    key = key || '';
    let content = CryptoJS.enc.Utf8.parse(str);
    let encry = CryptoJS.AES.encrypt(content, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
    return encry.ciphertext.toString();
  },

  /**
   * appendZero 字符串补零操作
   * @param {String} str 待补零的字符串
   * @param {number} length 补零后的字符串长度
   * @param {boolean} left 补零方式：true：左补零，false：右补零
   * @param {boolean} subFlag 是否需要截取字符串，如字符串长度超过“补零后的字符串长度”，则将原始字符串进行截取至“补零后的字符串长度”
   * @returns {String} 补零后的结果字符串
   */
  appendZero: (str, length, left, subFlag) => {
    if (!length || length <= 0) {
      return str;
    }
    if (!str || !(str + '').trim().length) {
      str = '';
    }
    str += '';
    let strLength = str.length;
    while (strLength < length) {
      if (left) {
        str = '0' + str;
      } else {
        str += '0';
      }
      strLength++
    }
    if (subFlag) {
      str = str.substr(0, length);
    }
    return str;
  },

  /**
   * createUUID 根据UUID key生成UUID
   */
  createUUID: () => {
    let s = [];
    let hexDigits = appConfig.UUID_KEY;
    for (let i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4'; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';
    let uuid = s.join('');
    return uuid;
  },

  /**
   * getDateStr 根据日期获取时间字符串
   * @param {Date} date 待转换的时间，不传则取当前时间
   * @param {String} formatStr 转换后的格式，默认为'YYYY-MM-DD HH:mm:ss'
   * @returns {String} 日期转换后的结果字符串，如:2018-12-12 09:57:18
   */
  getDateStr: (date, formatStr) => {
    if (!date) {
      date = new Date();
    }
    formatStr = formatStr || 'YYYY-MM-DD HH:mm:ss'
    return dayjs(date).format(formatStr);
  },

  /**
   * isIE 判断当前浏览器是否是IE浏览器
   * @returns {Boolean} 如果当前浏览器为IE浏览器，则返回true，否则返回false
   */
  isIE: () => {
    return (window.navigator.userAgent.indexOf('MSIE') !== -1);
  },

  /**
   * encode 使用Base64对字符串进行混淆
   * @param {String} input 待混淆的字符串
   * @returns {String} 使用Base64混淆后的字符串
   */
  encode: (input) => {
    if (input === null || input === undefined) {
      return null;
    }
    input += '';
    if (input.trim() === '') {
      return null;
    }
    return Base64.encode(input);
  },

  /**
   * decode 解析Base64混淆过的字符串
   * @param {String} input 待解析的字符串
   * @returns {String} 解析后的字符串
   */
  decode: (input) => {
    input += '';
    let result = null;
    try {
      result = Base64.decode(input);
    } catch (e) {
      log.error('字符串解码失败，待解码的字符串为：', input, '；错误信息为：', e);
    }
    return result;
  },

  /**
   * parseObj 将JSON字符串转换成JSON对象
   * @param {String} input 待转换的字符串
   * @returns {Object} 转换后的对象
   */
  parseObj: (input) => {
    input += '';
    let result = null;
    try {
      result = JSON.parse(input);
    } catch (e) {
      log.error('字符串转换JSON对象失败，待转换的字符串为：', input, '；错误信息为：', e);
    }
    return result;
  },

  /**
   * stringifyParams 将参数对象转换为字符串
   * @param {Object} input 待转换的字符串
   * @returns {Object} 转换后的对象
   */
  stringifyParams: (input) => {
    input = input || {};
    input.timestamp = new Date().getTime();
    let result = null;
    try {
      result = JSON.stringify(input);
    } catch (e) {
      log.error('参数对象转换字符串失败，待转换的参数对象为：', input, '；错误信息为：', e);
    }
    return result;
  },

  /**
   * buildQueryParams 构造查询路由query参数对象
   * @param {Object} params 待传递的参数对象
   * @returns {Object} 构造后的路由参数对象
   */
  buildQueryParams: (params) => {
    params = params || {};
    return { params: utils.encode(utils.stringifyParams(params)) };
  },

  /**
   * parseQueryParams 解析查询路由query参数对象
   * @param {Object} params 待解析的参数对象
   * @returns {Object} 解析后的路由参数对象
   */
  parseQueryParams: (params) => {
    if (!params || !params.params) {
      return {};
    }
    return utils.parseObj(utils.decode(params.params));
  },

  /**
   * unRepeatArray 对象数组去重操作
   * @param {Array} resource 待去重的对象数组
   * @param {String} key 去重依据字段
   * @returns {Object} 转换后的对象
   */
  unRepeatArray: (resource, key) => {
    if (!resource || !resource.length || !key || !key.length) {
      return resource;
    }
    let tempData = [];
    let tempObj = {};
    resource.forEach((item) => {
      if (!tempObj[item[key]]) {
        tempData.push(item);
        tempObj[item[key]] = true;
      }
    })
    return tempData;
  },

  /**
   * clone 深度克隆对象，完全改变新对象的引用指向
   * @param {Object} obj 待克隆的对象
   * @returns {Object} 克隆后的对象，该对象与原对象为两个对象，修改任意一个不会影响彼此
   */
  clone: (obj) => {
    // Handle the 3 simple types, and null or undefined
    if (obj === null || typeof obj !== 'object') return obj;
    // Handle Date
    if (obj instanceof Date) {
      let copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }
    // Handle Array
    let copy = [];
    if (obj instanceof Array) {
      copy = [];
      for (let i = 0; i < obj.length; ++i) {
        copy[i] = utils.clone(obj[i]);
      }
      return copy;
    }
    // Handle Object
    if (obj instanceof Object) {
      let copy = {};
      for (let attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = utils.clone(obj[attr]);
      }
      return copy;
    }
  },

  /**
   * checkAuth 检查当前操作（访问）是否具有权限
   * @param {String} menuId 传入的权限码，在做权限判断时，传入当前页面或按钮的权限码
   * @returns {Boolean} 是否有权限：true-有权限，false-无权限
   */
  checkAuth(menuId) {
    let result = false;
    // 如果权限码为空，则直接返回权限检查通过
    if (!menuId || menuId === '') {
      return true;
    }
    let userMenus = localStorage.getString(cacheKeys.USER_MAIN_MENU);
    let permStr = '"perms":"' + menuId + '"';
    if (userMenus.indexOf(permStr) !== -1) {
      result = true;
    }
    // if (!result) {
    //   console.log('用户无权限');
    // }
    // result = true;
    return result;
  },

  /**
   * getOffsetByBody 获取当前元素相对于页面BODY元素的位置，左边和顶部
   * @param {Document} el 待获取位置的元素对象，为HTML DOM对象
   * @returns {Object} {offsetLeft: 左边相对于BODY的位置, offsetTop: 顶部相对于BODY元素的位置}
   */
  getOffsetByBody(el) {
    let offsetLeft = 0;
    let offsetTop = 0;
    let offsetWidth = el.offsetWidth;
    let offsetHeight = el.offsetHeight;
    while (el && el.tagName !== 'BODY') {
      offsetLeft += el.offsetLeft
      offsetTop += el.offsetTop
      el = el.offsetParent
    }
    return { offsetLeft: offsetLeft, offsetTop: offsetTop, offsetWidth: offsetWidth, offsetHeight: offsetHeight }
  },

  /**
   * getStyleMap 根据样式字符串获取样式键值对，为兼容IE浏览器设置元素的样式，需要将样式字符串封装为样式键值对对象，用于设置元素样式属性
   * @param {String} styleStr 待设置的样式字符串
   * @returns {Object} 封装后的样式键值对对象，key：style样式名称，value：style样式值
   */
  getStyleMap(styleStr) {
    let result = [];
    // 样式字符串存在才封装样式键值对
    if (styleStr && styleStr.length && styleStr.indexOf(':') !== -1) {
      // 将样式字符串根据“;”进行分割
      let temp = styleStr.split(';');
      temp.forEach((item) => {
        if (item && item.trim().length && item.trim().indexOf(':') !== -1) {
          // 去两边空格
          item = item.trim();
          // 根据“:”获取键值信息
          let key = item.split(':')[0];
          let value = item.split(':')[1];
          // 键值都存在继续封装
          if (key && key.trim().length && value && value.trim().length) {
            // 如果key包含“-”，则需要将key封装为驼峰命名的方式
            if (key.indexOf('-') !== -1) {
              let newKey = '';
              let tempKey = key.split('-');
              tempKey.forEach((keyItem, index) => {
                keyItem = keyItem.trim();
                newKey += (index === 0) ? keyItem : (keyItem.charAt(0).toUpperCase() + keyItem.substring(1, keyItem.length));
              });
              key = newKey;
            }
            result.push({
              key: key.trim(),
              value: value.trim()
            });
          }
        }
      })
    }
    return result;
  },

  /**
   * getIPAddress 获取浏览器本地IP地址
   * @param {Funtion} callback 获取本地IP成功后，调用回调函数
   */
  getIPAddress(callback) {
    let RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
    if (RTCPeerConnection) {
      (() => {
        let rtc = new RTCPeerConnection({ iceServers: [] });
        if (1 || window.mozRTCPeerConnection) {
          rtc.createDataChannel('', { reliable: false });
        };

        rtc.onicecandidate = (evt) => {
          if (evt.candidate) grepSDP('a=' + evt.candidate.candidate);
        };
        rtc.createOffer((offerDesc) => {
          grepSDP(offerDesc.sdp);
          rtc.setLocalDescription(offerDesc);
        }, (e) => {
          log.error('获取错误，错误信息：' + JSON.stringify(e));
        });

        let addrs = Object.create(null);
        addrs['0.0.0.0'] = false;

        let updateDisplay = (newAddr) => {
          if (newAddr in addrs) return;
          else addrs[newAddr] = true;
          let displayAddrs = Object.keys(addrs).filter((k) => { return addrs[k]; });
          for (let i = 0; i < displayAddrs.length; i++) {
            if (displayAddrs[i].length > 16) {
              displayAddrs.splice(i, 1);
              i--;
            }
          }
          log.info('当前主机的IP：' + displayAddrs[0]);
          if (callback && typeof callback === 'function') {
            callback(displayAddrs[0]);
          }
        }

        let grepSDP = (sdp) => {
          let parts, addr, type;
          sdp.split('\r\n').forEach((line, index) => {
            if (~line.indexOf('a=candidate')) {
              parts = line.split(' ');
              addr = parts[4];
              type = parts[7];
              if (type === 'host') updateDisplay(addr);
            } else if (~line.indexOf('c=')) {
              parts = line.split(' ');
              addr = parts[2];
              updateDisplay(addr);
            }
          });
        }
      })();
    } else {
      log.warn('不支持当前浏览器获取IP地址，请使用如下浏览器：Chrome，Firefox，Opera，Safari');
      if (callback && typeof callback === 'function') {
        callback();
      }
    }
  },

  /**
   * deepObjectMerge 深度合并对象，如a对象中存在的值，b对象中不存在，则继续保留a对象的值
   * @param {Object} a 需合并的基础对象
   * @param {Object} b 需合并至基础对象的对象
   * @returns {Object} 合并后的对象
   */
  deepObjectMerge(a, b) {
    for (let key in b) {
      a[key] = a[key] && typeof a[key] === 'object' ? utils.deepObjectMerge(a[key], b[key]) : a[key] = b[key];
    }
    return a;
  }
}

export default utils
