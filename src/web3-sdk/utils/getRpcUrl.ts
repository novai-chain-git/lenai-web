import { sample } from 'lodash-es';
import { ChainId } from '../wallet/config';
import { ETHEREUM_CHAIN } from '../wallet/networks';
import { BASE_CHAIN_ID } from '../constants';

type chainId = keyof typeof ETHEREUM_CHAIN;

const ethereum = ETHEREUM_CHAIN[BASE_CHAIN_ID as unknown as chainId];

// Array of available nodes to connect to
export const nodes = [...ethereum.rpcUrls];

export const getNodeUrlByChain = (chain: ChainId) => {
  const _ethereum = ETHEREUM_CHAIN[chain];
  return sample(_ethereum.rpcUrls) as string;
};

export const getNodeUrl = () => {
  return sample(nodes) as string;
};
