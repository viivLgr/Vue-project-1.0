/**
 * 缓存中存储数据
 * @param id
 * @param key
 * @param val
 */
export function saveToLocal(id, key, val) {
  let seller = window.localStorage.__seller__; // 私有
  if (!seller) {
    seller = {};
    seller[id] = {};
  } else {
    seller = JSON.parse(seller);
    if (!seller[id]) {
      seller[id] = {};
    }
  }
  seller[id][key] = val;
  window.localStorage.__seller__ = JSON.stringify(seller);
}

/**
 * 读取缓存数据
 * @param id
 * @param key
 * @param def 默认
 */
export function loadFromLocal(id, key, def) {
  let seller = window.localStorage.__seller__;
  if (!seller) {
    return def;
  }
  seller = JSON.parse(seller)[id];
  if (!seller) {
    return def;
  }
  return seller[key] || def;
}
