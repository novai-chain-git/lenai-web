import { ethers } from 'ethers';
import addresses from '../constants/contracts';

// Addresses
import { getAddress } from './addressHelpers';

// ABI
import {
  erc20Abi,
  LaunchBridgeAbi,
  ChainConnect,
  CryptoLendingWithToken,
  SwapAbi
} from '../abi/index';

import { getContract } from './contract';

export const getERC20Contract = (
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(address, erc20Abi, signer);
};

export const getChainConnectContract = (
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(address, CryptoLendingWithToken, signer);
};

// SWAP合约
export const getSwapContract = (
  address: string,
  signer?: ethers.Signer | ethers.providers.Provider
) => {
  return getContract(address, SwapAbi, signer);
};
