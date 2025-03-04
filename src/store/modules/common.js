import { defineStore } from 'pinia';

import { ChainList } from '@/web3-sdk';
export const useCommonStore = defineStore({
  id: 'bridging-common',
  state: () => ({
    loginVisible: false,
    // 是否登录
    registerVisible: false,
    isAboutPage: false,
    // 链接钱包弹窗
    isShowLinkWalletDialog: false,
    // 币种弹框
    isShowCurrencyDialog: false,
    // 所有链
    allChainList: ChainList,
    // NOVAI余额
    novaiBalance: 0
  }),
  actions: {
    setCommonState(...args) {
      this.$patch({ [args[0]]: args[1] });
    },
    setRegisterVisible(value) {
      this.registerVisible = value;
    },
    setCurrencyDialog(value) {
      this.isShowCurrencyDialog = value;
    },
    setNovaiBalance(value) {
      this.novaiBalance = value;
    }
  }
});
