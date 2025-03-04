import { ChainId } from "../wallet/config";
import type { Address } from "../types";
import { BASE_CHAIN_ID } from "../constants";

export const getAddress = (address: Address, chainId: number): string => {
  return address[chainId];
};
