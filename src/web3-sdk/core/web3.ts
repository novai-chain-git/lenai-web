import { BASE_CHAIN_ID, BASE_URL } from '../constants';
import { ConnectorNames } from '../wallet';
import { ETHEREUM_CHAIN } from '../wallet/networks';
import { useActiveWebState, useActiveWebStateRefs } from '../stores/activeWebState';
// import { ethers } from "ethers";
// import chainId from "../chainId";
import { getLibrary } from './web3Core';
import { useUserStore } from '@/store/modules/user.js';
import { WalletTypes } from '@/web3-sdk';
import tp from 'tp-js-sdk';

// export const chainId = BASE_CHAIN_ID;

/**
 * @dev 获取当前浏览器供应者
 * @returns
 */
export const getActiveLibrary = (chainId) => {
  if (window.ethereum) {
    return getLibrary(window.ethereum);
  }
  console.log('请安装MetaMask钱包, ');
  return null;
};

/**
 * 获取钱包地址
 * @returns 钱包地址数组
 */
export const getAccountAddress = async (): Promise<string[]> => {
  const library = getActiveLibrary();
  if (!library) return [];
  try {
    const accounts = await library.send('eth_requestAccounts', []);
    return accounts;
  } catch (error) {
    console.error(error);
    return [];
  }
};

/**
 * @dev 链接钱包
 * @returns 钱包地址数组
 */
export const connectWallet = async (): Promise<string[]> => {
  const { setConnectorName, setAccount, setChainId } = useActiveWebState();
  const { collateralCurr } = useUserStore();
  console.log('window.ethereum2222', window.ethereum);
  if (!window.ethereum) {
    window.open('https://metamask.io/download/');
    return;
  }
  const library = getActiveLibrary();

  if (!library) return [];
  try {
    const accounts = await library.send('eth_requestAccounts', []);

    if (accounts.length) {
      setConnectorName(ConnectorNames.Injected);
      setAccount(accounts[0]);
      console.log('连接钱包', accounts[0]);
    }
    // 切换链ID
    const _chainId = await getChanId();

    // if (Number(chainId) !== _chainId) {
    //   const res = await walletSwitchChain();
    //   if (res) {
    //     setChainId(Number(chainId));
    //   }
    // } else {
    // setChainId(_chainId);
    // }
    setChainId(_chainId);
    const chainOriginalId = collateralCurr.chainOriginalId;
    await walletSwitchChain(chainOriginalId);
    return accounts;
  } catch (error) {
    console.error(error);
    return [];
  }
};

// 断开连接钱包
export const disconnectWallet = async (): Promise<void> => {
  const { setConnectorName, setAccount, setChainId } = useActiveWebState();

  // 清除账户信息
  setAccount(null);
  // 清除链ID
  setChainId(null);
  // 清除连接器名称
  setConnectorName(null);
  const library = getActiveLibrary();
  if (!library) return;
  try {
    await library.send('wallet_revokePermissions', [{ eth_accounts: {} }]);
    console.log('已断开连接钱包');
  } catch (error) {
    console.error('断开连接钱包时出错：', error);
  }
};
/**
 * @dev 添加链
 * @returns 如果成功返回链id
 */
export const walletAddChain = async (chainId: number): Promise<unknown> => {
  console.log('ETHEREUM_CHAIN[chainId]', ETHEREUM_CHAIN[chainId]);
  if (window.ethereum) {
    const data = { ...ETHEREUM_CHAIN[chainId] };
    delete data.chainOriginalId;
    delete data.icon;

    console.log('data', data, ETHEREUM_CHAIN[chainId]);

    try {
      // 添加当前DAPP使用的链
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [data]
      });
      await walletSwitchChain(chainId);
    } catch (error) {
      console.error(error);
    }
  }
  return undefined;
};

/**
 * @dev 切换链
 * @returns 如果成功返回链id
 */
export const walletChangeChain = async (chainId: number): Promise<unknown> => {
  const { setChainId } = useActiveWebState();
  const { library } = useActiveWebStateRefs();
  console.log('ETHEREUM_CHAIN', ETHEREUM_CHAIN, chainId, ETHEREUM_CHAIN[chainId]?.chainId);

  // const address = await getAccountAddress()
  // if(address.length===0){
  //   await connectWallet()
  // }

  const activeWebState = useActiveWebState();
  const id = await getChanId();
  if (activeWebState.chainId === chainId) return;
  // 是否为tp钱包
  const isTp = tp.isConnected();
  console.log('isTp：', isTp, window.ethereum);
  if (isTp && !window.ethereum) {
    const wallet = await tp.getWallet({ walletTypes: [WalletTypes[chainId]] });
    // window.location.reload()
    console.log('wallet', wallet);
    if (wallet.msg === 'success') {
      return setChainId(chainId);
    }
  }

  if (window.ethereum) {
    try {
      console.log('ETHEREUM_CHAIN[chainId]?.chainId', ETHEREUM_CHAIN[chainId]);

      // 切换至当前DAPP使用的链
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: ETHEREUM_CHAIN[chainId]?.chainId
          }
        ]
      });

      setChainId(chainId);
    } catch (error) {
      console.error('切换链报错', error);
      const message = error.message || error.msg;
      if (
        message?.includes('Unrecognized chain ID') ||
        message?.includes('chainId not match') ||
        error?.code === 4902
      ) {
        await walletAddChain(chainId);
        console.log('切换链：walletSwitchChain');
      }
    }
  }
  return undefined;
};

/**
 * @dev 切换链
 * @returns 如果成功返回链id
 */
export const walletSwitchChain = async (chainId: number): Promise<unknown> => {
  // await walletAddChain();
  await walletChangeChain(chainId);
};

/**
 * @dev 获取当前钱包链
 * @returns
 */
export const getChanId = async (): Promise<number> => {
  if (window.ethereum) {
    const library = getActiveLibrary();
    if (library) {
      const chainId = await library.send('eth_chainId', []);
      return Number(chainId);
    }
  }
  return 0;
};

// 监听账户变化
const listenerAccountsChange = (fn: (accounts: Array<string>) => void) => {
  if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts: Array<string>) => {
      console.debug('钱包账户已改变');
      fn(accounts);
    });
  }
};

// 监听网络变化
const listenerChainIdChange = (fn: (chainId: string) => void) => {
  if (window.ethereum) {
    window.ethereum.on('chainChanged', (chainId: string) => {
      console.debug('当前网络已发生改变');
      fn(chainId);
    });
  }
};

/**
 * @dev 自动链接钱包
 *
 */
export const eagerConnect = async () => {
  console.log('初始化链接钱包');
  const { setAccount, setChainId, connectorName } = useActiveWebState();
  const { account } = useActiveWebStateRefs();
  const { collateralCurr } = useUserStore();
  // 如果是tp钱包不清除账户信息
  const isTp = tp.isConnected();

  if (isTp && window.tronWeb && !account.value) {
    const wallet = await tp.getWallet({ walletTypes: ['eth'] });
    setAccount(wallet.data.address);

    // window.location.reload()
  }
  if (isTp && !window.ethereum) return;
  // 如果是true 说明用户以前链接过钱包
  try {
    const accounts = await getAccountAddress();
    if (accounts.length) {
      setAccount(accounts[0]);
      const _chainId = await getChanId();
      setChainId(_chainId);
      const chainOriginalId = collateralCurr.chainOriginalId;
      await walletChangeChain(chainOriginalId);
    } else {
      setAccount('');
    }
  } catch (error) {
    setAccount('');
  }

  // 监听钱包
  listenerAccountsChange((accounts) => {
    console.log('监听钱包 listenerAccountsChange：', account.value, accounts);
    if (accounts.length) {
      // 如果钱包地址变了，就退出之前的重新登录
      if (account.value !== accounts[0]) {
        const userStore = useUserStore();
        userStore.logout();
      }
      setAccount(accounts[0]);
    } else {
      disconnectWallet();
    }
  });
  // 监听链
  listenerChainIdChange((_chainId) => {
    setChainId(Number(_chainId));
  });
};

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number
) => {
  const tokenAdded = await window.ethereum?.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: `${BASE_URL}/images/tokens/${tokenAddress}.png`
      }
    }
  });

  return tokenAdded;
};
