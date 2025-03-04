import { local } from '@/utils/storage.js';

const AccessTokenKey = 'ACCESS_TOKEN'
const RefreshTokenKey = 'REFRESH_TOKEN'
const UserRoleKey = 'USER_ROLE_KEY'

// 获取token
export const getAccessToken = () => {
  // 此处与TokenKey相同，此写法解决初始化时Cookies中不存在TokenKey报错
  return local.get(AccessTokenKey);
}

// 获取刷新token
export const getRefreshToken = () => {
  return local.get(RefreshTokenKey)
}

// 设置token
export const setToken = (token) => {
  local.set(RefreshTokenKey, token.refreshToken)
  local.set(AccessTokenKey, token.accessToken)
}

// 删除token
export const removeToken = () => {
  local.remove(AccessTokenKey)
  local.remove(RefreshTokenKey)
}

/** 格式化token（jwt格式） */
export const formatToken = (token) => {
  return 'Bearer ' + token
}

// 设置用户角色
export const setUserRole = (value) => {
  local.set(UserRoleKey, value)
}

// 获取用户角色
export const getUserRole = () => {
  return local.get(UserRoleKey);
}
