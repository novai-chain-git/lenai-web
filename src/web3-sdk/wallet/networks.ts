import { ChainId, ChainIdList } from './config';
import { BASE_CHAIN_ID, addresses } from '@/web3-sdk';

import usdt from '@/assets/img/token/usdt.png';
import novai from '@/assets/img/token/novai.png';
import nusdt from '@/assets/svg/nusdt.svg';

// 区块链浏览器地址配置
export const MAIN_BSC_SCAN_URLS = {
  [ChainId.NOVAI_MAINNET]: 'https://scan.novaichain.com/novaichain'
};
export const TEST_BSC_SCAN_URLS = {
  [ChainId.NOVAI_TESTNET]: 'https://scan.novaichain.com/novaichain'
};
export const BASE_BSC_SCAN_URLS = {
  ...MAIN_BSC_SCAN_URLS,
  ...TEST_BSC_SCAN_URLS
};

// ETH 链主网
export const ETHEREUM_CHAIN_MAINNET = {
  [ChainId.NOVAI_MAINNET]: {
    chainId: `0x${ChainId.NOVAI_MAINNET.toString(16)}`,
    chainOriginalId: ChainId.NOVAI_MAINNET,
    chainName: 'Novai Chain Mainnet',
    nativeCurrency: {
      name: 'nNOVAI',
      symbol: 'NOVAI',
      decimals: 18
    },
    rpcUrls: ['https://rpc.novaichain.com'],
    blockExplorerUrls: [BASE_BSC_SCAN_URLS[ChainId.NOVAI_MAINNET]],
    icon: usdt
  }
};

// ETH 测试网
export const ETHEREUM_CHAIN_TESTNET = {
  [ChainId.NOVAI_TESTNET]: {
    chainId: `0x${ChainId.NOVAI_TESTNET.toString(16)}`,
    chainOriginalId: ChainId.NOVAI_TESTNET,
    chainName: 'Novai Chain Mainnet',
    nativeCurrency: {
      name: 'nNOVAI',
      symbol: 'NOVAI',
      decimals: 18
    },
    rpcUrls: ['https://rpc.novaichain.com'],
    blockExplorerUrls: [BASE_BSC_SCAN_URLS[ChainId.NOVAI_TESTNET]],
    icon: usdt
  }
};
export const ETHEREUM_CHAIN = {
  ...ETHEREUM_CHAIN_MAINNET,
  ...ETHEREUM_CHAIN_TESTNET
};

const TokenInfoTestnet = {
  [ChainId.NOVAI_TESTNET]: [
    {
      chainOriginalId: ChainId.NOVAI_TESTNET,
      name: 'nUSDT',
      symbol: 'USDT',
      img: nusdt
    },
    {
      chainOriginalId: ChainId.NOVAI_TESTNET,
      name: 'NOVAI',
      symbol: 'NOVAI',
      img: novai
    }
  ]
};

const TokenInfoMainnet = {
  [ChainId.NOVAI_MAINNET]: [
    {
      chainOriginalId: ChainId.NOVAI_MAINNET,
      name: 'nUSDT',
      symbol: 'USDT',
      img: nusdt
    },
    {
      chainOriginalId: ChainId.NOVAI_MAINNET,
      name: 'NOVAI',
      symbol: 'NOVAI',
      img: novai
    }
  ]
};

export const TokenInfo = {
  ...TokenInfoTestnet,
  ...TokenInfoMainnet
};

// TP钱包切换网络所需要的钱包名称
export const WalletTypes = {
  [ChainId.NOVAI_MAINNET]: 'eth'
  //[ChainId.NOVAI_TESTNET]: 'eth',
};

// 更具合约地址显示代币信息
export const TokenName = {
  [addresses.USDT[ChainId.NOVAI_TESTNET]]: { name: 'nUSDT', symbol: 'USDT', icon: nusdt },
  [addresses.USDT[ChainId.NOVAI_MAINNET]]: { name: 'nUSDT', symbol: 'USDT', icon: nusdt },
  '0x0000000000000000000000000000000000000000': { name: 'NOVAI', symbol: 'NOVAI', icon: novai }
};

export type EthereumChain = keyof typeof ETHEREUM_CHAIN;

export const ChainList = ChainIdList.map((item) => ETHEREUM_CHAIN[item]);
