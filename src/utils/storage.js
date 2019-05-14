/**
 * 封装工程中的本地存储方法，请根据业务需要将对应的数据存储在对应的存储中
 */
function storageBuilder(type) {
  const storage = window[type];
  return {
    //
    setString(key, str) {
      storage.setItem(key, str)
    },
    getString(key) {
      return storage.getItem(key)
    },
    //
    setNumber(key, number) {
      storage.setItem(key, (number || '').replace(/[^\d]/g, ''))
    },
    getNumber(key) {
      return Number(storage.getItem(key))
    },
    //
    setBoolean(key, boolean) {
      storage.setItem(key, !!boolean)
    },
    getBoolean(key) {
      return storage.getItem(key) === 'true'
    },
    //
    setObject(key, object) {
      storage.setItem(key, JSON.stringify(object))
    },
    getObject(key) {
      let item = storage.getItem(key);
      return JSON.parse(((!item || item === 'undefined' || item === 'null') ? null : item))
    },
    removeItem(key) {
      storage.removeItem(key)
    },
    clear() {
      storage.clear();
    }
  }
}

export const sessionStorage = storageBuilder('sessionStorage');
export const localStorage = storageBuilder('localStorage');
export default {}
