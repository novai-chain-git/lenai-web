import { ConnectorNames } from './types';
import type { Config } from './types';

export enum ChainId {
  //  Novai USDT
  NOVAI_MAINNET = 7256,
  NOVAI_TESTNET = 7256
}
// USDT测试 精度
const DecimalsMap = {
  USDT: {
    [ChainId.NOVAI_TESTNET]: 6
  },
  NOVAI: {
    [ChainId.NOVAI_TESTNET]: 18
  }
};

// USDT正式 精度
const DecimalsMapProduction = {
  USDT: {
    [ChainId.NOVAI_MAINNET]: 6
  },
  NOVAI: {
    [ChainId.NOVAI_MAINNET]: 18
  }
};

export const ChainIdList =
  import.meta.env.VITE_APP_NODE_ENV === 'development'
    ? // 测试
      [ChainId.NOVAI_TESTNET]
    : [
        // 正式
        ChainId.NOVAI_MAINNET
      ];

export const connectorLocalStorageKey = 'connectorIdv2';
export const walletLocalStorageKey = 'wallet';
export const Decimals =
  import.meta.env.VITE_APP_NODE_ENV === 'development' ? DecimalsMap : DecimalsMapProduction;
