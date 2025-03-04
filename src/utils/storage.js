class Storage {
  constructor(strategy = 'internal') {
    this.strategy = strategy;
    this.preKey = '';
  }
  /**
   * 设置缓存键名的前缀
   * @param {string} key
   */
  setPreKey(key) {
    this.preKey = key;
  }
  /**
   * 获取缓存键名的前缀
   * @returns 缓存键名的前缀
   */
  getPreKey() {
    return this.preKey;
  }

  /**
   * @param {string} key
   * @param {any} val
   * @param {number} maxAge 存储时间：ms
   */
  set(key, val, maxAge = 0) {
    key = this.preKey + key;
    const data = {
      val,
      expires: maxAge === 0 ? 0 : Date.now() + maxAge
    };
    window[this.strategy][key.toString()] = JSON.stringify(data);
  }

  get(suffix) {
    const key = this.preKey + suffix;
    const data = window[this.strategy][key.toString()] && JSON.parse(window[this.strategy][key.toString()]);

    if (data) {
      if (data.expires === 0) {
        return data.val;
      }

      if (Date.now() < data.expires) {
        return data.val;
      }

      this.remove(suffix);
      return null;
    }
    return null;
  }

  remove(key) {
    key = this.preKey + key;
    delete window[this.strategy][key.toString()];
  }
  clear() {
    window[this.strategy].clear();
  }
}

// 全局变量
window.internal = window.internal || {};

export const local = new Storage('localStorage');
export const session = new Storage('sessionStorage');
export const internal = new Storage('internal');
