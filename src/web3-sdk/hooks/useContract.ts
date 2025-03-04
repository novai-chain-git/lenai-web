import { computed } from 'vue';
import { useActiveWebStateRefs } from '../stores/activeWebState';
import { useTronWebStateRefs } from '../stores/tronWebState';
import {
  getERC20Contract,
  getChainConnectContract,
  getSwapContract
} from '../utils/contractHelpers';
import { Contract, ethers } from 'ethers';
import { trc20Abi } from '../abi/index';
import TokenWebView from '@consenlabs-fe/webview';

// 需要链上交互 这样获取合约
export const useERC20Contract = (address: string) => {
  const { library } = useActiveWebStateRefs();

  return computed(() => {
    return getERC20Contract(address, library?.value?.getSigner());
  });
};
export const useLaunchBridgeContract = (address) => {
  const { library } = useActiveWebStateRefs();
  return computed(() => {
    return getChainConnectContract(address.value, library?.value?.getSigner());
  });
};
/**
 * 文档 https://developers.tron.network/reference/tronwebcontract#get-smart-contract-instance
 * 波场的合约
 * 读取需要 await contract.xxx.call()
 * 写入需要 await contract.xxx.send()
 * @param address
 * @returns
 */
export const useTronUsdtContract = (address: any) => {
  return computed(() => {
    return window.tronWeb.contract(trc20Abi, address.value);
  });
};

export const getSingerContract = (
  getHandler: (signer?: ethers.Signer | ethers.providers.Provider) => Contract
) => {
  const { library } = useActiveWebStateRefs();
  return getHandler(library?.value?.getSigner());
};

// SWAP合约
export const useSwapContract = (address) => {
  const { library } = useActiveWebStateRefs();
  return computed(() => {
    return getSwapContract(address.value, library?.value?.getSigner());
  });
};
