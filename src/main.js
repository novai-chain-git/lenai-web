// if (import.meta.env.DEV) {
// 	import('vconsole').then((vconsole) => {
// 		new vconsole.default();
// 	});
// }
import { createApp } from 'vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
/* --------------------------------
需要手动引入样式。
------------------------------------- */
import 'element-plus/theme-chalk/src/message.scss';
import 'element-plus/theme-chalk/src/message-box.scss';
import 'element-plus/theme-chalk/src/notification.scss';

import i18n from '@/lang';
import router from '@/router/index.js';
import pinia from '@/store/index.js';
import App from './App.vue';
import { eagerConnect } from './web3-sdk';
import 'virtual:uno.css';

const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(router);
app.use(pinia);
app.use(i18n);
// 监听 metamask 钱包事件
eagerConnect();
app.mount('#app');
