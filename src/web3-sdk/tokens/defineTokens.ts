import { BASE_CHAIN_ID } from "../constants";
import { ChainId } from "../wallet/config";
import Token from "./Token";
import usdtIcon from '@/assets/tokens/USDT.svg';
import usdcIcon from '@/assets/tokens/USDC.svg';
interface TokenList {
  [symbol: string]: Token;
}

export const defineTokens = <T extends TokenList>(t: T) => t;
const mainnetTokens = defineTokens({
  usdt: new Token(
    ChainId.BSC_TESTNET,
    "0xcf52cb5e38af8358c3afc60ACAff3D102a52b9FA",
    18,
    "USDT",
    "Tether USD",
    usdtIcon,
    "https://tether.to/"
  ),
  
});

const testnetTokens = defineTokens({
  usdt: new Token(
    ChainId.BSC_TESTNET,
    "0x9F093215ad46B8079F780eA3D0952aCFE0e8dC77",
    18,
    "USDT",
    "Tether USD",
    usdtIcon,
    "https://tether.to/"
  ),
 
});

const tokens = () => {
  const chainId = BASE_CHAIN_ID;

  // If testnet - return list comprised of testnetTokens wherever they exist, and mainnetTokens where they don't
  if (chainId === ChainId.BSC_TESTNET) {
    return Object.keys(mainnetTokens).reduce((accum, key) => {
      return { ...accum, [key]: testnetTokens[key] || mainnetTokens[key] };
    }, {} as typeof testnetTokens & typeof mainnetTokens);
  }

  return mainnetTokens;
};

export const unserializedTokens = tokens();
const getTokenMapOfAddress = () => {
  return Object.values(unserializedTokens).reduce((prev, curr) => {
    return { ...prev, [curr.address]: curr, [curr.symbol]: curr };
  }, {} as { [address: string]: Token });
};
export const tokenMap = getTokenMapOfAddress();

export const balanceTokens = [
  // unserializedTokens.hds,
  // unserializedTokens.matic,
  unserializedTokens.usdt,
  // unserializedTokens.usdc,
  // unserializedTokens.im,
  // unserializedTokens.it,
  // unserializedTokens.cfx
];

export const swapTokens = [
  // unserializedTokens.hds,
  unserializedTokens.usdt
  // unserializedTokens.im,
];
