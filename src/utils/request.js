import axios from 'axios';
import { showFullScreenLoading, tryHideFullScreenLoading } from '@/config/serviceLoading';
import { useUserStore } from '@/store/modules/user.js';
import qs from 'qs';
import i18n from '@/lang';
import { disconnectWallet } from '@/web3-sdk';
import { ElMessage } from 'element-plus';
import router from '@/router/index.js';

const excludeUrlArr = ['/public/upload-file'];
// 请求队列
let requestList = [];
// 是否正在刷新中
let isRefreshToken = false;
const successCode = 0;
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // api的base_url
  timeout: 15000,
  withCredentials: true,
  showLoading: true,
  showToast: true,
  loadingText: '加载中...'
});
// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    config.headers['Authorization'] = `Bearer ${userStore.token}`;
    config.headers['language'] = i18n.global.locale.value;
    const params = config.params || {};
    const data = config.data || false;
    // console.log('config：', config);
    if (config.showLoading) {
      showFullScreenLoading();
      ({
        message: config.loadingText,
        duration: 0,
        forbidClick: true
      });
    }
    if (
      config.method?.toUpperCase() === 'POST' &&
      config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
    ) {
      config.data = qs.stringify(data);
    }
    // get参数编码
    if (config.method?.toUpperCase() === 'GET' && params) {
      config.params = {};
      const paramsStr = qs.stringify(params, { allowDots: true });
      if (paramsStr) {
        config.url = config.url + '?' + paramsStr;
      }
    }
    return config;
  },
  (error) => {
    console.log('request error--', error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  async (res) => {
    console.log('请求结果res：', res);
    const userStore = useUserStore();
    let { data, config } = res;
    config.showLoading && tryHideFullScreenLoading();
    const code = data.code;
    if (code === 401) {
      // 如果未认证，并且未进行刷新令牌，说明可能是访问令牌过期了
      if (!isRefreshToken) {
        isRefreshToken = true;
        // 1. 如果获取不到刷新令牌，则只能执行登出操作
        if (!userStore.refreshToken) {
          // return handleAuthorized();
        }
        // 2. 进行刷新访问令牌
        try {
          const refreshTokenRes = await refreshToken(userStore.refreshToken);
          console.log('refreshTokenRes：', refreshTokenRes);

          // 2.1 刷新成功，则回放队列的请求 + 当前请求
          userStore.setToken((await refreshTokenRes).data.data);
          config.headers.Authorization = `Bearer ${userStore.token}`;
          requestList.forEach((cb) => {
            cb();
          });
          requestList = [];
          return service(config);
        } catch (e) {
          console.log('refreshTokenRes error：', e);
          // 为什么需要 catch 异常呢？刷新失败时，请求因为 Promise.reject 触发异常。
          // 2.2 刷新失败，只回放队列的请求
          requestList.forEach((cb) => {
            cb();
          });
          // 提示是否要登出。即不回放当前请求！不然会形成递归
          // return handleAuthorized();
        } finally {
          requestList = [];
          isRefreshToken = false;
        }
      } else {
        // 添加到队列，等待刷新获取到新的令牌
        return new Promise((resolve) => {
          requestList.push(() => {
            config.headers.Authorization = `Bearer ${userStore.token}`; // 让每个请求携带自定义token 请根据实际情况自行修改
            resolve(service(config));
          });
        });
      }
    } else if (code !== successCode) {
      if (config.showToast) {
        ElMessage.error(res.data.msg || '请求失败，请重试');
      }
      res.data.hasErrors = true;
      return res.data;
    } else {
      return res.data;
    }
    // return res.data;
  },
  (error) => {
    // console.log('响应报错', error );
    tryHideFullScreenLoading();
    if (error?.config?.showToast) {
      ElMessage.error(error?.message || error?.response?.data?.msg || '请求失败');
    }
    return Promise.resolve({
      error,
      hasErrors: true
    });
  }
);
// 刷新token
const refreshToken = async (refreshToken) => {
  return await axios.post(
    import.meta.env.VITE_APP_BASE_API +
      '/app-api/member/auth/refresh-token?refreshToken=' +
      refreshToken
  );
};
// 退出操作
const handleAuthorized = () => {
  const userStore = useUserStore();
  disconnectWallet();
  userStore.logout();
  router.push({
    path: '/'
  });
  window.location.reload();
};
export default service;
