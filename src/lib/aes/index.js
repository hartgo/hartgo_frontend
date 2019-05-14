import CryptoJS from 'crypto-js'
import appConfig from '@/utils/appConfig'
import log from '@/utils/log'

// AES秘钥
const key = CryptoJS.enc.Utf8.parse(appConfig.AES_KEY)
// AES密钥偏移量
const iv = CryptoJS.enc.Utf8.parse(appConfig.AES_IV);

export default {
  /**
   * aes加密
   * @param data 待加密内容
   * @returns {string}
   */
  encryption(data) {
    var parsePwd = CryptoJS.enc.Utf8.parse(data)
    var encrypt = CryptoJS.AES.encrypt(parsePwd, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })

    return encrypt.toString()
  },

  /**
   * aes解密
   * @param data 待解密内容 需要保证后台使用的秘钥和秘钥偏移量一致
   * @returns {string}
   */
  decryption(data) {
    return this.aesDecrypt(data);
  },
  /**
   * 加密字符串
   * @param {type} data 待加密的字符串
   * @returns {unresolved} 加密后的数据
   */
  aesEncrypt(data) {
    var sendData = CryptoJS.enc.Utf8.parse(data);
    var encrypted = CryptoJS.AES.encrypt(sendData, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Iso10126 });
    // return CryptoJS.enc.Base64.stringify(encrypted.toString(CryptoJS.enc.Utf8));
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
  },
  /**
   * 解密字符串
   * @param {type} data BASE64的数据
   * @returns {String} result
   */
  aesDecrypt(data) {
    // 解密字符串新增异常捕捉，当解密失败时，打印错误日志，并且返回空，避免解密失败导致代码中断
    try {
      // 解密的是基于BASE64的数据，此处data是BASE64数据
      var decrypted = CryptoJS.AES.decrypt(data, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Iso10126 });
      let result = decrypted.toString(CryptoJS.enc.Utf8);
      // 解密字符串不可打印日志
      // log.info('字符串解密成功，解密结果为：', result);
      return result
    } catch (e) {
      log.error('字符串解密失败，解密字符串为：', data);
      return null;
    }
  }
}
