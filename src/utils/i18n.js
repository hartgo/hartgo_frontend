import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import en from '@/i18n/en'
import zh from '@/i18n/zh'
import cacheKeys from '@/utils/cacheKeys'
import { localStorage } from '@/utils/storage'
import log from '@/utils/log'

// 支持的语种及描述，也用于页面展示
const LANGUAGES = [
  {value: 'zh_CN', name: '简体中文'},
  {value: 'en_US', name: 'English'}
];

// 默认语种
const DEFAULT_LOCALE = localStorage.getString(cacheKeys.CURRENT_LANGUAGE) || LANGUAGES[0].value;

const messages = {
  en_US: {
    message: 'Hello',
    ...en,
    ...enLocale // 或者用 Object.assign({ message: 'hello' }, enLocale)
  },
  zh_CN: {
    message: '你好',
    ...zh,
    ...zhLocale // 或者用 Object.assign({ message: '你好' }, zhLocale)
  }
};

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: DEFAULT_LOCALE,
  messages
});

// 挂载支持的语种，用于页面循环展示，如：下拉框
i18n.LANGUAGES = LANGUAGES;

/**
 * 扩展方法保存当前语言到localStorage
 * @param newLocale
 * @param oldLocale
 */
i18n.saveLocale = function (newLocale, oldLocale) {
  i18n.locale = newLocale;
  localStorage.setString(cacheKeys.CURRENT_LANGUAGE, newLocale);
  log.info('用户切换语言成功，切换前的语言：', oldLocale, '；切换后的语言：', newLocale);
};

export default i18n
