import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from '@/config/nprogress';

let routes = [
  {
    path: '/',
    name: 'home',
    auth: false,
    meta: {
      title: '桥接'
    },
    component: () => import('@/views/home/index.vue')
  }
];

console.log('import.meta.env：', import.meta.env);
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
});
/**
 * @description 路由拦截 beforeEach
 * */
//  ['invitePage', 'walletconnect', 'demo']
const whiteList = routes.filter((d) => d.auth === false).map((d) => d.name);
router.beforeEach((to, from, next) => {
  NProgress.start();
  // 1.NProgress 开始
  const userStore = useUserStore();
  if (whiteList.includes(to.name)) {
    // 如果有token并且是输入邀请码界面，就直接跳转到桥接页面
    next();
    /* if (userStore.token && to.name === 'invitePage') {
      next('/')
    } else {
      
    } */
  } else if (!userStore.token) {
    next('/');
  } else {
    next();
  }
});
/**
 * @description 路由跳转错误
 * */
router.onError((error) => {
  NProgress.done();
  console.warn('路由错误', error.message);
});
/**
 * @description 路由跳转结束
 * */
router.afterEach(() => {
  NProgress.done();
});
export default router;
