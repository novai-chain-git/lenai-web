import { defineStore } from 'pinia';
import piniaPersistConfig from '@/config/piniaPersist';
import { getBrowserLang } from '@/utils/index.js';

export const useGlobalStore = defineStore({
  id: 'bridging-global',
  // 修改默认值之后，需清除 localStorage 数据
  state: () => ({
    // element 组件大小
    assemblySize: 'default',
    // 当前系统语言
    language: getBrowserLang(),
    isLogin: false,
    tabNum: 0
  }),
  getters: {},
  actions: {
    setGlobalState(...args) {
      this.$patch({ [args[0]]: args[1] });
    }
  },
  persist: piniaPersistConfig('bridging-global')
});
