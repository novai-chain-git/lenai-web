// 返回 startNumber 到 endNumber 的随机数
export const randomNumber = (startNumber, endNumber) => {
  return Math.round((endNumber - startNumber) * Math.random()) + startNumber;
};
/**
 * @description 获取浏览器默认语言
 * @returns {String}
 */
export function getBrowserLang() {
  let browserLang = navigator.language ? navigator.language : navigator.browserLanguage;
  let defaultBrowserLang = '';
  if (['cn', 'zh', 'zh-cn'].includes(browserLang.toLowerCase())) {
    defaultBrowserLang = 'zh';
  } else {
    defaultBrowserLang = 'en';
  }
  // return defaultBrowserLang;
  // 默认英文
  return 'en';
}
