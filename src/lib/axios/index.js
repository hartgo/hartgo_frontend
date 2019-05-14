/**
 * Created by FangShenglong at 2019/12/07
 */
import axios from 'axios'
import router from '@/router'
import store from '@/lib/store'
import i18n from '@/utils/i18n'
import log from '@/utils/log'
import appConfig from '@/utils/appConfig'

// 将所有的批次请求放入一个全局列表中，当页面发生跳转时，将所有未完成的请求取消掉
window._axiosPromiseArr = [];
// axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.withCredentials = true;
// Add a request interceptor
axios.interceptors.request.use((config) => {
  config.cancelToken = new axios.CancelToken(cancel => {
    window._axiosPromiseArr.push({ cancel })
  });
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
});

// 当系统出现错误请求失败时，统一返回该提示消息给接口调用处的方法
let httpError = {
  msgCode: '-1',
  msgContent: i18n.t('system.common.message.systemerror'),
  page: null,
  returnObj: null,
  success: false
}

// 当用户会话超时，返回一个空的对象，避免页面出现错误提示
let httpNull = {
  msgCode: '0',
  msgContent: '',
  page: null,
  returnObj: null,
  success: true
}

// Add a response interceptor
axios.interceptors.response.use((response) => {
  // Do something with response data
  // 接口请求成功后，判断当前用户会话是否超时，200表示http码为200，请求成功
  if (response.status === 200) {
    // 如果needLogin为true，表示用户会话超，需要跳转至用户登录页面
    if (response.data.needLogin !== undefined && !!response.data.needLogin) {
      log.error('用户会话超时，需重新登录！当前接口地址为：', response.config.url);
      // 页面跳转前，清空所有用户相关信息
      store.dispatch('clearUserCache');
      // 如果响应结果中带有跳转地址，则跳转至响应结果中的地址，否则跳转至当前系统中默认的登录页面
      if (response.data.location) {
        window.location.href = response.data.location;
      } else {
        router.push({ path: appConfig.LOGIN_PAGE });
      }
      response.data = httpNull;
    }
    return response
  } else {
    return response
  }
}, (error) => {
  // Do something with response error
  // 请求失败，执行请求失败的函数reject
  return Promise.reject(error)
});
// let filterRESTful = ['getDeptAndCameraByParentTm.json', 'myLogin.json', 'addPlanInfo.json', 'getGroupAndUserList.json', 'getGrounpByCenterId.json', 'getCamera.json', 'issPlatQueryUpdate.json', 'issPlatAdd.json', 'getVcm.json', 'delVcm.json', 'modifyVcm.json', 'updateCameraGrounpName.json', 'getPatrolRouteListByCenterId.json'];
export default function fetch(url, param, config) {
  let _config = config || {};
  if (store.getters.userInfo !== null && store.getters.userInfo !== undefined) {
    _config.headers = {
      'ticket': store.getters.userInfo.ticket || '',
      'locale': i18n.locale || ''
    };
  }
  let _param = param || {};
  return new Promise((resolve, reject) => {
    axios.post(url, _param, _config).then(response => {
      resolve(response.data)
    }, err => {
      // 所有请求失败也执行resolve方法，封装统一的错误消息给业务接口调用处
      // 只有当存在返回消息时，才返回错误消息
      if (err.message) {
        log.error('fetch接口请求失败，请求url为：', url, '；请求参数为：', _param, '；错误消息为：', err);
        resolve(httpError);
      } else {
        // 如message为空，则表示当前请求被取消，不需要进行返回
        log.info('fetch接口请求被取消，请求url为：', url);
      }
    }).catch((err) => {
      log.error('fetch接口请求失败，请求url为：', url, '；请求参数为：', _param, '；错误消息为：', err);
      if (err.message) {
        resolve(httpError);
      } else {
        // 如message为空，则表示当前请求被取消，不需要进行返回
        log.info('fetch接口请求被取消，请求url为：', url);
      }
    })
  })
}

export function fetchGet(url, config) {
  let _config = config || {};
  if (store.getters.userInfo !== null && store.getters.userInfo !== undefined) {
    _config.headers = {
      'ticket': store.getters.userInfo.ticket || ''
    };
  }
  return new Promise((resolve, reject) => {
    axios.get(url, _config).then(response => {
      resolve(response.data)
    }, err => {
      log.error('fetchGet接口请求失败，请求url为：', url, '；错误消息为：', err);
      if (err.message) {
        resolve(httpError);
      } else {
        // 如message为空，则表示当前请求被取消，不需要进行返回
        log.info('fetch接口请求被取消，请求url为：', url);
      }
    }).catch((err) => {
      log.error('fetchGet接口请求失败，请求url为：', url, '；错误消息为：', err);
      if (err.message) {
        resolve(httpError);
      } else {
        // 如message为空，则表示当前请求被取消，不需要进行返回
        log.info('fetch接口请求被取消，请求url为：', url);
      }
    })
  })
}

export function fetchForm(url, _param) {
  let config = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'locale': i18n.locale || ''
    }
  };
  if (store.getters.userInfo !== null && store.getters.userInfo !== undefined) {
    config.headers.ticket = store.getters.userInfo.ticket || '';
  }
  return new Promise((resolve, reject) => {
    axios.post(url, _param, config).then(response => {
      resolve(response.data)
    }, err => {
      log.error('fetchForm接口请求失败，请求url为：', url, '；请求参数为：', _param, '；错误消息为：', err);
      if (err.message) {
        resolve(httpError);
      } else {
        // 如message为空，则表示当前请求被取消，不需要进行返回
        log.info('fetch接口请求被取消，请求url为：', url);
      }
    }).catch((err) => {
      log.error('fetchForm接口请求失败，请求url为：', url, '；请求参数为：', _param, '；错误消息为：', err);
      if (err.message) {
        resolve(httpError);
      } else {
        // 如message为空，则表示当前请求被取消，不需要进行返回
        log.info('fetch接口请求被取消，请求url为：', url);
      }
    })
  })
}
