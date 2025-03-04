// 中间内容用***代替
export const against = (t) => {
  if (!t) return '';
  if (t.length <= 10) {
    return t;
  }
  return t.substring(0, 4) + '****' + t.substring(t.length - 4, t.length);
};

export const againstLater = (t) => {
  if (!t) return '';
  return '...' + t.substring(t.length - 4, t.length);
};
