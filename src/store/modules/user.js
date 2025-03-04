import { defineStore } from 'pinia';
import piniaPersistConfig from '@/config/piniaPersist';
import { cloneDeep } from 'lodash-es';
import router from '@/router/index.js';
import { ChainList, borrowList, TokenInfo } from '@/web3-sdk';
// 默认链ID
const chainOriginalId = 7256;

export const useUserStore = defineStore({
  id: 'bridging-user',
  state: () => ({
    token: '',
    refreshToken: '',
    userInfo: {
      userName: '',
      roleCode: '',
      token: ''
    },
    assets: {
      point: 0,
      assetAmount: 0,
      pointRank: 0
    },
    // 抵押默认币种
    collateralCurr: cloneDeep(TokenInfo[chainOriginalId][1]),
    // 借款默认币种
    borrowCurr: cloneDeep(TokenInfo[chainOriginalId][0])
  }),
  actions: {
    setUserState(...args) {
      this.$patch({ [args[0]]: args[1] });
    },
    setToken(token) {
      this.token = token.accessToken;
      this.refreshToken = token.refreshToken;
    },
    setCollateralCurr(data) {
      this.collateralCurr = data;
      if (data.symbol === 'USDT') {
        this.borrowCurr = TokenInfo[chainOriginalId][1];
      } else if (data.symbol === 'NOVAI') {
        this.borrowCurr = TokenInfo[chainOriginalId][0];
      }
    },
    setBorrowCurr(data) {
      this.borrowCurr = data;
      if (data.symbol === 'USDT') {
        this.collateralCurr = TokenInfo[chainOriginalId][1];
      } else if (data.symbol === 'NOVAI') {
        this.collateralCurr = TokenInfo[chainOriginalId][0];
      }
    },
    logout() {
      this.userInfo = {};
      this.token = '';
      this.refreshToken = '';
      this.assets = {
        point: 0,
        assetAmount: 0,
        pointRank: 0
      };
    }
  },
  persist: piniaPersistConfig('bridging-user')
});
