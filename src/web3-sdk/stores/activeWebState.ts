import type { ethers } from 'ethers';
import piniaPersistConfig from '@/config/piniaPersist';
import { defineStore, storeToRefs } from 'pinia';
import { shortenAddress } from '../utils/contract';
import type { ConnectorNames } from '../wallet/types';
import { getActiveLibrary } from '../core/web3';
import { getRpcProviderByChain } from '../utils/providers';
import { BASE_CHAIN_ID } from '../constants';
import { useUserStore } from '@/store/modules/user.js';
import { useCommonStore } from '@/store/modules/common.js';
const chainId = BASE_CHAIN_ID;
interface ActiveWebState {
  _account: string; // 钱包地址
  chainId: number; // 钱包链id
  connectorName?: ConnectorNames; // 钱包链接方式
  isKill?: boolean; // 是否断开链接
  addressData: string;
  _librarySigner: ethers.Signer | null;
  priceNumberHds?: number;
}

export const useActiveWebState = defineStore({
  id: 'activeWebState',
  state: (): ActiveWebState => ({
    _account: '',
    chainId: BASE_CHAIN_ID,
    connectorName: undefined,
    _librarySigner: null,
    isKill: false,
    addressData: '',
    priceNumberHds: 0
  }),

  getters: {
    account(): string {
      if (this._account) {
        return this._account;
      }
    },
    accountLower(): string {
      return this.account?.toLowerCase();
    },
    shortAccount(): string {
      return shortenAddress(this.account);
    },
    library(): ethers.providers.JsonRpcProvider | null | null {
      if (this.account) {
        return getActiveLibrary(this.chainId);
      }
      return getRpcProviderByChain(this.chainId);
    }
  },
  actions: {
    setAccount(account: string) {
      console.log('this._account === account：', this._account, account);
      console.log('this._account === account：', this._account === account);
      console.log('this.chainId：', this.chainId);
      if (this._account === account) return;
      this._account = account;
      // if (account) {
      //   const userStore = useUserStore();
      //   userStore.memberUserExistsApi(account);
      // }
    },
    setChainId(chainId: number) {
      this.chainId = chainId;
    },
    setConnectorName(connectorName: ConnectorNames) {
      this.connectorName = connectorName;
    },
    killConnect() {
      this.isKill = true;
      this._account = '';
    },
    setAddress(connector: any) {
      this.addressData = connector;
    },
    setHdsprice(account: any) {
      this.priceNumberHds = account;
    },
    setLibrarySigner(signer: ethers.Signer | null) {
      this._librarySigner = signer;
    }
  },
  persist: piniaPersistConfig('bridging-activeWebState', null)
  /* persist: {
    paths: ['connectorName', 'priceNumberHds']
  } */
});

export const useActiveWebStateRefs = () => storeToRefs(useActiveWebState());
